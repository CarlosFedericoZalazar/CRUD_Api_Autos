import { saveData, getData } from '../storage/storage.js';
import { alertConfirm, alertError } from '../components/alerts.js';
const { createClient } = supabase;

const dataCar = getData('carToModify');

const form = document.querySelector("form");
const fileInput = document.getElementById("imagen");

const marcaInput = document.getElementById('marca');
const modeloInput = document.getElementById('modelo');
const motorInput = document.getElementById('motor');
const anioInput = document.getElementById('anio');
const preview = document.getElementById("preview");


// cargar datos existentes
if (dataCar) {
    marcaInput.value = dataCar.marca;
    modeloInput.value = dataCar.modelo;
    motorInput.value = dataCar.motor;
    anioInput.value = dataCar.año;
    preview.src = dataCar.imagen;
    preview.style.display = "block";
}

const supabaseClient = createClient(
    "https://byzkpxbrbxqkjrlgjzyz.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5emtweGJyYnhxa2pybGdqenl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NzI3NDEsImV4cCI6MjA4MDE0ODc0MX0.hF5snoH9F7WFqI6McxJkA5Zb3gvFgbFulr00NatSx9Y"
);


fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
});


form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const marcaInput = document.getElementById('marca').value;
    const modeloInput = document.getElementById('modelo').value;
    const motorInput = document.getElementById('motor').value;
    const anioInput = document.getElementById('anio').value;
    const file = document.getElementById("imagen").files[0];

    let imageUrl = dataCar.imagen; // valor original

if (file) {
    const fileName = Date.now() + "_" + file.name;

    const { data: uploadData, error: uploadError } = await supabaseClient
        .storage
        .from("autos")
        .upload(fileName, file);

    if (uploadError) {
        console.error(uploadError);
        alertError("Error subiendo imagen");
        return;
    }

    const { data: urlData } = supabaseClient
        .storage
        .from("autos")
        .getPublicUrl(fileName);

    imageUrl = urlData.publicUrl;
}
        // MODIFICAMOS EL AUTO
        try {
        const response = await fetch(`https://api-autos-three.vercel.app/cars/${dataCar.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'carscharlie12345'
            },
            body: JSON.stringify({
                marca: marcaInput,
                modelo: modeloInput,
                motor: motorInput,
                año: anioInput,
                imagen: imageUrl
            })
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        if (!response.ok) {
            alertError(data.error);
            return;
        }

        alertConfirm("Auto MODIFICADO con éxito");
        form.reset();
        preview.style.display = "none";

    } catch (error) {
        console.error("Error modifying car:", error);
    }
});

