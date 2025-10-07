let productosGlobales = [];
let carrito = [];
let historial = [];

const contenedorProductos = document.getElementById("productos-container");
const contenedorCarrito = document.getElementById("carrito");
const contenedorHistorial = document.getElementById("historial");
const formulario = document.getElementById("formulario");
const selectDestino = document.getElementById("destino");
const inputPersonas = document.getElementById("personas");
const selectPago = document.getElementById("pago");
const resultado = document.getElementById("resultado");

async function cargarProductos() {
    try {
        const response = await fetch("data.json");
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
        const data = await response.json();
        productosGlobales = data;
        mostrarProductos(data, "Argentina");
        llenarSelectDestinos();
        activarTabs();
    } catch (error) {j
        console.error("Error al cargar productos:", error);
        Swal.fire({
        icon: "error",
        title: "Error al cargar productos",
        text: error.message
        });
    }
    }
    cargarProductos();

    function mostrarProductos(productos, categoriaSeleccionada = "Argentina") {
    contenedorProductos.innerHTML = "";

    const grupo = productos.filter(p => p.categoria === categoriaSeleccionada);

    grupo.forEach(prod => {
        const card = document.createElement("div");
        card.classList.add("producto-card");
        card.innerHTML = `
        <h4>${prod.nombre}</h4>
        <p>Precio: $${prod.precio.toLocaleString()}</p>
        <button class="btn-agregar" data-id="${prod.id}">Agregar al carrito</button>
        `;
        contenedorProductos.appendChild(card);
    });

    document.querySelectorAll(".btn-agregar").forEach(boton => {
        boton.addEventListener("click", e => {
        const idSeleccionado = e.target.getAttribute("data-id");
        const producto = productosGlobales.find(p => p.id == idSeleccionado);
        if (producto) agregarAlCarrito(producto);
        });
    });
    }

    function activarTabs() {
    document.querySelectorAll(".tab").forEach(tab => {
        tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        const categoria = tab.getAttribute("data-cat");
        mostrarProductos(productosGlobales, categoria);
        });
    });
    }

    function llenarSelectDestinos() {
    selectDestino.innerHTML = `<option value="">-- Selecciona un destino --</option>`;
    productosGlobales.forEach(prod => {
        const option = document.createElement("option");
        option.value = prod.id;
        option.textContent = prod.nombre;
        selectDestino.appendChild(option);
    });
    }

    function agregarAlCarrito(producto) {
    const yaEnCarrito = carrito.some(p => p.id === producto.id);
    if (yaEnCarrito) {
        Swal.fire({
        icon: "info",
        title: "Ya está en el carrito",
        text: `${producto.nombre} ya fue agregado`,
        timer: 1000,
        showConfirmButton: false
        });
        return;
    }

    carrito.push(producto);
    actualizarCarrito();

    Swal.fire({
        icon: "success",
        title: "Agregado",
        text: `${producto.nombre} se agregó al carrito`,
        timer: 1000,
        showConfirmButton: false
    });
    }

    function actualizarCarrito() {
    contenedorCarrito.innerHTML = "";
    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = "<p>Carrito vacío</p>";
        return;
    }

    carrito.forEach((item, index) => {
        const div = document.createElement("div");
        div.classList.add("item-carrito");
        div.innerHTML = `
        <span>${item.nombre} - $${item.precio.toLocaleString()}</span>
        <button class="btn-eliminar" data-index="${index}">❌</button>
        `;
        contenedorCarrito.appendChild(div);
    });

    document.querySelectorAll(".btn-eliminar").forEach(btn => {
        btn.addEventListener("click", e => {
        const i = e.target.getAttribute("data-index");
        const eliminado = carrito.splice(i, 1)[0];
    actualizarCarrito();

    Toastify({
    text: `Destino eliminado: ${eliminado.nombre}`,
    duration: 2000,
    gravity: "top",
    position: "right",
    backgroundColor: "#d62828",
    stopOnFocus: true
    }).showToast();
        });
    });
    }

    function actualizarHistorial() {
    contenedorHistorial.innerHTML = "";
    if (historial.length === 0) {
        contenedorHistorial.innerHTML = "<p>Historial vacío</p>";
        return;
    }

    historial.forEach(item => {
        const div = document.createElement("div");
        div.classList.add("item-historial");
        div.innerHTML = `
        <span>
            ${item.nombre} - $${item.precioFinal.toLocaleString()}  
            (${item.personas} persona/s, pago: ${item.metodoPago})  
        </span>
        `;
        contenedorHistorial.appendChild(div);
    });
    }

    document.getElementById("borrarHistorial").addEventListener("click", () => {
    historial = [];
    actualizarHistorial();
    Swal.fire({
        icon: "success",
        title: "Historial borrado",
        timer: 1000,
        showConfirmButton: false
    });
    });

    document.getElementById("borrarCarrito").addEventListener("click", () => {
    carrito = [];
    actualizarCarrito();
    Swal.fire({
        icon: "success",
        title: "Carrito borrado",
        timer: 1000,
        showConfirmButton: false
    });
    });

    formulario.addEventListener("submit", e => {
        e.preventDefault();
        const destinoId = selectDestino.value;
        const personas = parseInt(inputPersonas.value);
        const pago = selectPago.value;

        if (!destinoId || !personas || !pago) {
        Swal.fire({
        icon: "warning",
        title: "Completa todos los campos",
        timer: 1500,
        showConfirmButton: false
        });
        return;
        }

    const producto = productosGlobales.find(p => p.id == destinoId);
    if (!producto) return;

    let precioTotal = producto.precio * personas;

    if (pago === "Efectivo") precioTotal *= 0.9;
    else if (pago === "Débito") precioTotal *= 0.95;
    else if (pago === "Crédito") precioTotal *= 1.1;

    resultado.innerHTML = `<p>Precio total para ${personas} persona(s) en ${producto.nombre}: $${precioTotal.toLocaleString()}</p>`;

    historial.push({
        nombre: producto.nombre,
        precioFinal: precioTotal,
        personas,
        metodoPago: pago,
        fecha: new Date().toLocaleString()
    });
    actualizarHistorial();
    });

    document.getElementById("limpiarForm").addEventListener("click", () => {
    formulario.reset();
    resultado.innerHTML = "";
    });
