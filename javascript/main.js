let carrito = [];
let descuentoAplicado = false;


function cargarCarrito() {
    let carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado != null) {
        carrito = JSON.parse(carritoGuardado);
        mostrarCarrito();
    }
}


function guardarCarrito() {
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre: nombre, precio: precio });
    guardarCarrito();
    mostrarCarrito();
}

function calcularTotal() {
    let suma = 0;

    for (let i = 0; i < carrito.length; i++) {
        suma = suma + carrito[i].precio;
    }

    if (descuentoAplicado == true) {
        let descuento = suma * 0.10;
        suma = suma - descuento;
    }

    return suma;
}

function mostrarCarrito() {
    const lista = document.getElementById("carrito");
    lista.innerHTML = "";

    for (let i = 0; i < carrito.length; i++) {
        const li = document.createElement("li");
        li.textContent = carrito[i].nombre + " - $" + carrito[i].precio;
        lista.appendChild(li);
    }

    document.getElementById("total").textContent = calcularTotal();
}

function vaciarCarrito() {
    carrito = [];
    descuentoAplicado = false;
    localStorage.removeItem("carrito");
    mostrarCarrito();
}


cargarCarrito();

