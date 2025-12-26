import { createCard } from "./components/card_cars.js";
import { alertDeleteConfirm, alertError } from "./components/alerts.js";
import { saveData } from "./storage/storage.js";
import { filterCars } from "./utils/filter.js";
import { getAllCars, deleteCar } from "./js/carsApi.js";

const btnBuscar = document.getElementById(`searchButton`);
const btnClearSearch = document.getElementById('clearSearchButton');
const btnAnterior = document.getElementById('btnPrev');
const pageIndicator = document.getElementById('pageIndicator');
const btnSiguiente = document.getElementById('btnNext');
const container = document.getElementById('card-container');

const btnCrearCar = document.getElementById('createCarButton');
const btnDelete = document.getElementById('deleteCarButton');
const btnModify = document.getElementById('modifyCarButton');

const showImagesCheckbox = document.getElementById('showImagesCheckbox');
const titleHeader = document.getElementById('title-header');

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
const itemsPerPage = 10;
async function inicio() {
    const allCars = await getAllCars();
    arrayCars = allCars; // siempre disponible

    let data = searchResults || allCars;

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    totalItems = data.length;
    titleHeader.textContent = `API Autos - Contenido (Total: ${totalItems})`;

    container.innerHTML = '';
    for (let i = start; i < end && i < totalItems; i++) {
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

function deleteItemArray(id) {
    const index = arrayCars.findIndex(car => car.id === id);
    if (index !== -1) {
        arrayCars.splice(index, 1);
    }
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
        const filteredCars = filterCars(arrayCars, inputBuscar);
        console.log("Autos filtrados:", filteredCars);
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
        const response = await deleteCar(autoSelected.id);
        deleteItemArray(autoSelected.id);
        autoSelected.id = null; // reset selección
        inicio(); 
    } catch (error) {
        console.error("Error deleting CAR:", error);
        console.log("Auto seleccionado para eliminar:", autoSelected);
        alertError("Ocurrió un error al eliminar el auto. Por favor, intenta nuevamente.");
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

showImagesCheckbox.addEventListener('change', () => {
    if (showImagesCheckbox.checked) {
        // SOLO mostrar autos que NO usan la imagen por defecto
        searchResults = arrayCars.filter(car => car.imagen !== null && car.imagen.trim() !== '');
    } else {
        searchResults = null;
    }
    page = 1;
    pageIndicator.textContent = `Page ${page}`;
    inicio();
});
