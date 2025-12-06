export function filterCars(array, search) {
    search = search.toLowerCase().trim();
    return array.filter(car =>
        car.marca.toLowerCase().includes(search) ||
        car.modelo.toLowerCase().includes(search)
    );
}
