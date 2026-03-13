
const claveStorage = "coderCafeCart";

const divProductos = document.getElementById("contenedorProductos");
const listaCarrito = document.getElementById("carritoLista");
const spanTotal = document.getElementById("totalCarrito");
const botonVaciar = document.getElementById("vaciarCarrito");
const botonComprar = document.getElementById("finalizarCompra");
const btnMenu = document.getElementById("btnVerMenu");

let catalogo = [];
let carrito = [];

iniciarApp();

async function iniciarApp() {

    cargarCarritoDelStorage();

    await pedirProductos();

    dibujarProductos();
    dibujarCarrito();
    ponerEventos();
}

async function pedirProductos() {
    try {
        const respuesta = await fetch("data/productos.json");
        const data = await respuesta.json();
        catalogo = data;
    } catch (error) {
        console.log("hubo un error con el fetch", error);
        Swal.fire({
            title: "Ups!",
            text: "No se pudieron cargar los cafés.",
            icon: "error"
        });
    }
}

function dibujarProductos() {
    divProductos.innerHTML = "";


    catalogo.forEach((cafe) => {
        const card = document.createElement("article");
        card.className = "producto";
        card.innerHTML = `
            <img src="${cafe.imagen}" alt="${cafe.nombre}">
            <h3>${cafe.nombre}</h3>
            <p>$ ${cafe.precio}</p>
            <button class="btn-agregar" id="${cafe.id}">
                Agregar al carrito
            </button>
        `;
        divProductos.append(card);
    });
}

function ponerEventos() {
    divProductos.addEventListener("click", clickEnProducto);
    listaCarrito.addEventListener("click", clickEnCarrito);
    botonVaciar.addEventListener("click", vaciarTodo);
    botonComprar.addEventListener("click", terminarCompra);

    if (btnMenu) {
        btnMenu.addEventListener("click", () => {
            document.getElementById("seccionMenu").scrollIntoView({
                behavior: "smooth"
            });
        });
    }
}

function clickEnProducto(e) {
    if (e.target.classList.contains("btn-agregar")) {
        const idDelBoton = Number(e.target.id);
        agregarAlCarrito(idDelBoton);
    }
}

function agregarAlCarrito(idProducto) {
    const cafeEncontrado = catalogo.find((item) => item.id === idProducto);
    const itemCarrito = carrito.find((item) => item.id === idProducto);

    if (itemCarrito) {
        itemCarrito.cantidad += 1;
    } else {
        carrito.push({
            id: cafeEncontrado.id,
            nombre: cafeEncontrado.nombre,
            precio: cafeEncontrado.precio,
            cantidad: 1
        });
    }

    guardarEnStorage();
    dibujarCarrito();

    Swal.fire({
        title: "Agregado!",
        text: `Agregaste ${cafeEncontrado.nombre}`,
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 1500,
        showConfirmButton: false
    });
}

function clickEnCarrito(e) {
    const index = Number(e.target.dataset.index);

    if (e.target.classList.contains("incrementar")) {
        sumarOrestar(index, 1);
    }

    if (e.target.classList.contains("decrementar")) {
        sumarOrestar(index, -1);
    }

    if (e.target.classList.contains("eliminar")) {
        borrarProducto(index);
    }
}

function sumarOrestar(index, numero) {
    const miProducto = carrito[index];
    miProducto.cantidad = miProducto.cantidad + numero;

    if (miProducto.cantidad === 0) {
        carrito.splice(index, 1);
    }

    guardarEnStorage();
    dibujarCarrito();
}

function borrarProducto(index) {
    carrito.splice(index, 1);
    guardarEnStorage();
    dibujarCarrito();
}

function vaciarTodo() {
    carrito = [];
    guardarEnStorage();
    dibujarCarrito();
}

function dibujarCarrito() {
    listaCarrito.innerHTML = "";

    if (carrito.length === 0) {
        const mensaje = document.createElement("li");
        mensaje.textContent = "El carrito está vacío.";
        listaCarrito.append(mensaje);
        spanTotal.textContent = "0";
        return;
    }

    carrito.forEach((prod, index) => {
        const li = document.createElement("li");
        const totalPorProducto = prod.precio * prod.cantidad;

        li.innerHTML = `
            <div class="item-info">
                <span>${prod.nombre}</span>
                <span>x${prod.cantidad}</span>
                <span>$ ${totalPorProducto}</span>
            </div>
            <div class="item-actions">
                <button class="decrementar" data-index="${index}">-</button>
                <button class="incrementar" data-index="${index}">+</button>
                <button class="eliminar" data-index="${index}">Borrar</button>
            </div>
        `;
        listaCarrito.append(li);
    });

    spanTotal.textContent = calcularTotal();
}

function calcularTotal() {
    let total = 0;
    carrito.forEach(prod => {
        total = total + (prod.precio * prod.cantidad);
    });
    return total;
}

function terminarCompra() {
    if (carrito.length === 0) {
        Swal.fire("Primero agregá algo al carrito", "warning");
        return;
    }


    let resumen = "";
    carrito.forEach(item => {
        resumen += `${item.nombre} x${item.cantidad} - $${item.precio * item.cantidad} \n`;
    });

    Swal.fire({
        title: "Pasar por caja",
        html: `
            <pre>${resumen}</pre>
            <input id="nombreCliente" class="swal2-input" placeholder="Tu nombre">
            <input id="emailCliente" class="swal2-input" placeholder="Tu mail">
        `,
        showCancelButton: true,
        confirmButtonText: "Comprar",
        cancelButtonText: "Mejor no",
        preConfirm: () => {
            const nombre = document.getElementById("nombreCliente").value;
            const mail = document.getElementById("emailCliente").value;

            if (nombre === "" || mail === "") {
                Swal.showValidationMessage("Completá los datos porfavor!");
            }
            return { nombre: nombre };
        }
    }).then((resultado) => {
        if (resultado.isConfirmed) {
            Swal.fire({
                title: "Compra exitosa!",
                text: `Gracias ${resultado.value.nombre}. Pagás un total de $${calcularTotal()}`,
                icon: "success"
            });
            vaciarTodo();
        }
    });
}

function cargarCarritoDelStorage() {
    const loQueHay = localStorage.getItem(claveStorage);
    if (loQueHay) {
        carrito = JSON.parse(loQueHay);
    } else {
        carrito = [];
    }
}

function guardarEnStorage() {
    const carritoString = JSON.stringify(carrito);
    localStorage.setItem(claveStorage, carritoString);
}
