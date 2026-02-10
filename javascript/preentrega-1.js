// ===============================
// SIMULADOR DE TIENDA - CARRITO
// ===============================

const productos = [
    { nombre: "Remera", precio: 5000 },
    { nombre: "Pantalón", precio: 12000 },
    { nombre: "Zapatillas", precio: 25000 }
];

let carrito = [];
let totalCompra = 0;

// ---------- FUNCIONES ----------

function mostrarProductos() {
    let mensaje = "Productos disponibles:\n\n";

    for (let i = 0; i < productos.length; i++) {
        mensaje += (i + 1) + ". " + productos[i].nombre +
                " - $" + productos[i].precio + "\n";
    }

    alert(mensaje);
    console.log(mensaje);
}

// Permite agregar productos al carrito
function agregarAlCarrito() {
    let opcion = prompt(
        "Ingrese el número del producto que desea agregar:\n" +
        "1 - Remera\n2 - Pantalón\n3 - Zapatillas\n\n" +
        "Ingrese 0 para finalizar"
    );

    while (opcion !== "0") {
        let indice = parseInt(opcion) - 1;

        if (indice >= 0 && indice < productos.length) { 
            carrito.push(productos[indice]);
            totalCompra += productos[indice].precio;

            alert("Agregaste: " + productos[indice].nombre);
            console.log("Producto agregado:", productos[indice]);
        } else {
            alert("Opción inválida");
        } 

        opcion = prompt(
            "Ingrese otro producto o 0 para finalizar"
        );
    }
}

// Muestra el resumen y confirma la compra
function finalizarCompra() {
    let mensaje = "Resumen de compra:\n\n";

    for (let producto of carrito) {
        mensaje += "- " + producto.nombre +
                " $" + producto.precio + "\n";
    }

    mensaje += "\nTotal a pagar: $" + totalCompra;

    let confirmar = confirm(
        mensaje + "\n\n¿Desea confirmar la compra?"
    );

    if (confirmar) {
        alert("¡Gracias por su compra!");
        console.log("Compra confirmada. Total:", totalCompra);
    } else {
        alert("Compra cancelada");
        console.log("Compra cancelada");
    }
}



alert("Bienvenido al simulador de compra");

mostrarProductos();
agregarAlCarrito();
finalizarCompra();