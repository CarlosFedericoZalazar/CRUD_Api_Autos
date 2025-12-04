import { alertConfirm, alertError } from '../components/alerts.js';


const form = document.querySelector("form");


form.addEventListener("submit", async (e) => {
    e.preventDefault();  // ⛔ evita recarga
    
    const marcaInput = document.getElementById('marca').value;
    const modeloInput = document.getElementById('modelo').value;
    const motorInput = document.getElementById('motor').value;
    const anioInput = document.getElementById('anio').value;
    
    console.log("Creating car with data:", {
        marca: marcaInput,
        modelo: modeloInput,
        motor: motorInput,
        año: anioInput
    });

    try {
        const response = await fetch('https://api-autos-three.vercel.app/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'carscharlie12345'
            },
            body: JSON.stringify({
                marca: marcaInput,
                modelo: modeloInput,
                motor: motorInput,
                año: anioInput,
                imagen: 'https://via.placeholder.com/150'
            })
        });

        const data = await response.json();

        console.log("Respuesta del servidor:", data);

        if (!response.ok) {
            alertError(data.error);
            return;
        }

        alertConfirm("Auto creado con éxito");
        form.reset(); 
    } catch (error) {
        console.error("Error creating car:", error);
    }
});

