import { createCard } from "./components/card_cars.js";
import { alertDeleteConfirm, alertError } from "./components/alerts.js";
import { saveData } from "./storage/storage.js";

const btnBuscar = document.getElementById(`searchButton`);
const btnClearSearch = document.getElementById('clearSearchButton');
const btnAnterior = document.getElementById('btnPrev');
const pageIndicator = document.getElementById('pageIndicator');
const btnSiguiente = document.getElementById('btnNext');
const container = document.getElementById('card-container');

const btnCrearCar = document.getElementById('createCarButton');
const btnDelete = document.getElementById('deleteCarButton');
const btnModify = document.getElementById('modifyCarButton');

let totalItems = 0;
let searchResults = null; // null = modo normal | array = modo búsqueda

let arrayCars = [];


const autoSelected = {
    id: null,
    marca: '',
    modelo: '',
    motor: '',
    año: '',
    imagen: '',
}


let page = 1;
const itemsPerPage = 12;

async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;
    }
}

async function inicio() { let data;

    if (searchResults) {
        // estamos viendo resultados de búsqueda
        data = searchResults;
    } else {
        // modo normal, obtengo todos
        data = await fetchData('https://api-autos-three.vercel.app/cars');
        arrayCars = data;
    }
    // PAGINACIÓN
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;    
    totalItems = data.length;
    
    console.log(data);
    container.innerHTML = '';
    for(let i = start; i < end && i < totalItems; i++) {
        const car = data[i];
        const card = createCard(car, autoSelected);
        container.appendChild(card);
    }
    updateButtons();
}

function updateButtons() {
    const totalPages = getTotalPages();
    
    btnAnterior.disabled = page === 1;
    btnSiguiente.disabled = page >= totalPages;
}

function getTotalPages() {
    return Math.ceil(totalItems / itemsPerPage);
}

inicio();

// EVENTOS BOTONES
btnCrearCar.addEventListener('click', () => {
    window.location.href = 'html/create_car.html';
});

btnBuscar.addEventListener('click', () => {
    const inputBuscar = document.getElementById('searchInput').value.trim();
    if (!inputBuscar) return;

    try {
        // FILTRAR AUTOS POR MARCA O MODELO
        const filteredCars = arrayCars.filter(car => {
            const search = inputBuscar.toLowerCase();
            return (
                car.marca.toLowerCase().includes(search) ||
                car.modelo.toLowerCase().includes(search)
            );
        });

        // GUARDAR RESULTADOS PARA PAGINAR Y RENDERIZAR
        searchResults = filteredCars; // si usas un array temporal
        page = 1;
        pageIndicator.textContent = `Page ${page}`;
        inicio(); // renderiza el resultado filtrado

    } catch (error) {
        console.error("Error filtrando autos:", error);
    }
});

btnClearSearch.addEventListener('click', () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    searchResults = null;
    page = 1;
    pageIndicator.textContent = `Page ${page}`;
    inicio();
});

btnSiguiente.addEventListener('click', () => {
    const totalPages = getTotalPages();
    if (page < totalPages) {
        page++;
        pageIndicator.textContent = `Page ${page}`;
        inicio();
    }
});

btnAnterior.addEventListener('click', () => {
    if (page > 1) {
        pageIndicator.textContent = `Page ${page - 1}`;
        page--;
        inicio();
    }
});

btnDelete.addEventListener('click', async () => {
    alertDeleteConfirm(`Estás a punto de eliminar ${autoSelected.marca} ${autoSelected.modelo}. ¿Deseas continuar?`).then(async (result) => {
    if (!result.isConfirmed) return;
    
    try {
        const response = await fetch(`https://api-autos-three.vercel.app/cars/${autoSelected.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'carscharlie12345'
            },
        });

        const data = await response.json();
        if (!response.ok) {
            alertError(data.error);
            return;
        }
        inicio(); 
    } catch (error) {
        console.error("Error deleting car:", error);
    }
    });
});

btnModify.addEventListener('click', () => {
    if (!autoSelected.id) {
        alertError("Por favor, selecciona un auto para modificar.");
        return;
    }
    saveData('carToModify', autoSelected);
    window.location.href = 'html/modify_car.html';
});