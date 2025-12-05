export function createCard(car, autoSelected) {
    //CARD
    const card = document.createElement('div');
    card.className = 'card';

    // BODY
    const body = document.createElement('div');
    body.className = 'card-body';
    body.style.textAlign = 'center';

    // TITLE
    const title = document.createElement('h5');
    title.className = 'card-title';
    title.textContent = car.marca;

    // IMAGE
    const image = document.createElement('img');
    image.classList.add('car-image');
    image.src = car.imagen || "../img/default_car.jpg";
    image.addEventListener('error', () => {
        image.src = "../img/default_car.jpg";
    });
    image.alt = `Imagen de ${car.marca}`;
    image.style.maxWidth = '100%';
    image.style.height = 'auto';
    body.appendChild(image);

    // DESCRIPTION
    const listDescription = document.createElement('ul');
    listDescription.className = 'list-group list-group-flush';

    const descriptionItems = [
        `Modelo: ${car.modelo}`,
        `Motor: ${car.motor}`,
        `Año: ${car.año}`,
    ];

    descriptionItems.forEach(itemText => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = itemText;
        listDescription.appendChild(listItem);
    });

    // APPEND
    body.appendChild(title);
    card.appendChild(body);
    card.appendChild(listDescription);

    // --- NUEVO: SELECCIÓN DE CARD ---
    card.addEventListener('click', () => {

        // Quitar selección previa
        const prev = document.querySelector('.card.selected');
        if (prev) prev.classList.remove('selected');

        // Marcar card actual
        card.classList.add('selected');

        // Guardar datos del auto seleccionado
        autoSelected.id = car.id;
        autoSelected.marca = car.marca;
        autoSelected.modelo = car.modelo;
        autoSelected.motor = car.motor;
        autoSelected.año = car.año;
        autoSelected.imagen = car.imagen || "../img/default_car.jpg";

        console.log("Auto seleccionado:", autoSelected);


    });

    return card;
}