import { createCard } from "./components/card_cars.js";
import { alertDeleteConfirm } from "./components/alerts.js";

const btnBuscar = document.getElementById(`searchButton`);
const btnClearSearch = document.getElementById('clearSearchButton');
const btnAnterior = document.getElementById('btnPrev');
const pageIndicator = document.getElementById('pageIndicator');
const btnSiguiente = document.getElementById('btnNext');
const container = document.getElementById('card-container');

const btnCrearCar = document.getElementById('createCarButton');
const btnDelete = document.getElementById('deleteCarButton');

let totalItems = 0;
let searchResults = null; // null = modo normal | array = modo búsqueda


const autoSelected = {
    id: null,
    marca: '',
    modelo: '',
    motor: '',
    año: ''
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

btnBuscar.addEventListener('click', async () => {
    const inputBuscar = document.getElementById('searchInput').value.trim();
    if (!inputBuscar) return;

    try {
        const data = await fetchData(`https://api-autos-three.vercel.app/cars/marca/${inputBuscar}`);

        searchResults = data;   // guardamos resultados
        page = 1;               // volvemos a página 1
        pageIndicator.textContent = `Page ${page}`;
        inicio();               // renderizamos con paginación

    } catch (error) {
        console.log("Error en la búsqueda:", error);
    }
});


btnBuscar.addEventListener('click', async () => {
    const inputBuscar = document.getElementById('searchInput').value.trim();
    console.log(inputBuscar);
    try{
        const data = await fetchData(`https://api-autos-three.vercel.app/cars/marca/${inputBuscar}`); 
        console.log(data);

         container.innerHTML = '';
    for(let i = 0; i < data.length; i++) {
        const car = data[i];
        const card = createCard(car, autoSelected);
        container.appendChild(card);
    }
        
    }
    catch(error){
        console.log("Error en la búsqueda:", error);
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