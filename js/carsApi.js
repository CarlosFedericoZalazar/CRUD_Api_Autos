export async function getAllCars() {
    const response = await fetch('https://api-autos-three.vercel.app/cars');
    console.log("Respuesta de getAllCars:", response);
    if (!response.ok) throw new Error("Error al obtener autos");
    return response.json();
}

export async function deleteCar(id) {
    const response = await fetch(`https://api-autos-three.vercel.app/cars/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': 'carscharlie12345'
        },
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Error al eliminar");
    return data;
}
