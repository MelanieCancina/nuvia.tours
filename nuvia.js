const precios = {
    "Brasil": 500,
    "México": 700,
    "España": 1200,
    "Inglaterra": 2700,
    "EE.UU": 1600,
    "Italia": 3200,
};

const titulo = document.getElementById("titulo");
const form = document.getElementById("formViaje");
const resultado = document.getElementById("precioFinal");
const listaHistorial = document.getElementById("listaHistorial");
const borrarHistorial = document.getElementById("borrarHistorial");



titulo.addEventListener("click", () => {
    titulo.style.color = titulo.style.color === "gold" ? "white" : "gold";
    titulo.style.fontFamily = titulo.style.fontFamily === "cursive" ? "Arial" : "cursive";
});


document.addEventListener("DOMContentLoaded", () => {
    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.forEach(viaje => mostrarEnHistorial(viaje));
});


form.addEventListener("submit", (e) => {
    e.preventDefault();

    let destino = document.getElementById("destino").value;
    let personas = parseInt(document.getElementById("personas").value);
    let pago = document.getElementById("pago").value;

    let precioBase = precios[destino] * personas;

    
    if (pago === "efectivo") {
        precioBase *= 0.9; // 10% descuento
    } else if (pago === "tarjeta") {
        precioBase *= 1.15; // 15% interés
    }

    resultado.textContent = `Precio final para ${personas} persona(s) a ${destino}: $${precioBase}`;
    resultado.style.color = pago === "tarjeta" ? "red" : "green";



    let viaje = { destino, personas, pago, precioBase };
    guardarHistorial(viaje);
    mostrarEnHistorial(viaje);
});


function guardarHistorial(viaje) {
    let historial = JSON.parse(localStorage.getItem("historial")) || [];
    historial.push(viaje);
    localStorage.setItem("historial", JSON.stringify(historial));
}
function mostrarEnHistorial(viaje) {
    let li = document.createElement("li");
    li.textContent = `${viaje.personas} persona(s) a ${viaje.destino} pagando con ${viaje.pago} → $${viaje.precioBase}`;
    listaHistorial.appendChild(li);
}


borrarHistorial.addEventListener("click", () => {
    localStorage.removeItem("historial");
    listaHistorial.innerHTML = "";
    resultado.textContent = "Historial borrado 👋"; //historial
});
