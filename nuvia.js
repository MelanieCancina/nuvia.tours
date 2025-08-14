let misDestinos = [];
const destinos = ["Brasil", "México", "España","Italia"];
const precios = [5000, 7500, 1200, 8500];

function mostrarDestinos() {
  let mensaje = "Estos son los destinos disponibles: \n";
  for (let i = 0; i < destinos.length; i++) {
      mensaje += (i + 1) + ". " + destinos[i] + " - $" + precios[i] + "\n";
  }
  return mensaje;
}

function calcularPrecio(indice, cantidad) {
  return precios[indice] * cantidad;
}
function iniciarSimulador() {
  alert("¡Bienvenida a Nubia Tours, vamos a planificar tu viaje!");

  let opcion;
  do {
    opcion = prompt(mostrarDestinos() + "\n Escribe el número del destino o 'salir' para terminar:").toLowerCase();

    if (opcion !== "salir") {
      let indice = parseInt(opcion) - 1;

      if (destinos[indice]) {
        let cantidad = parseInt(prompt("¿Cuántas personas viajan?"));
        let precioFinal = calcularPrecio(indice, cantidad);

        misDestinos.push(destinos[indice]);
        console.log(`Agregaste: ${destinos[indice]} | Total para ${cantidad} personas: $${precioFinal}`);
        } else {
          alert("Opción inválida, intenta otra vez.");
        }
    }

  } while (opcion !== "salir");

  console.log("Tus destinos elegidos:", misDestinos);
  alert("Gracias por usar Nubia Tours, Mel 😉");
}

iniciarSimulador();
