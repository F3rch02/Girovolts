(function () {
    const claveCarrito = "carritoGiroVolt";
    const botonCarrito = document.getElementById("botonCarritoNav");
    const contador = document.getElementById("contadorCarritoNav");
    let aviso = null;
    let temporizadorAviso = null;

    function leerCarrito() {
        try {
            const datos = localStorage.getItem(claveCarrito);
            if (datos === null) return [];
            const carrito = JSON.parse(datos);
            if (!Array.isArray(carrito)) return [];
            return carrito.filter((producto) =>
                producto && Number.isInteger(producto.cantidad) && producto.cantidad > 0
            );
        } catch (error) {
            return [];
        }
    }

    function contarProductos() {
        return leerCarrito().reduce((total, producto) => total + producto.cantidad, 0);
    }

    function actualizar() {
        if (!botonCarrito) return;

        const total = contarProductos();
        if (contador) {
            contador.textContent = total > 99 ? "99+" : String(total);
            contador.hidden = total === 0;
        }

        const descripcion = total === 0
            ? "Abrir carrito, está vacío"
            : `Abrir carrito, ${total} ${total === 1 ? "producto" : "productos"}`;
        botonCarrito.setAttribute("aria-label", descripcion);
    }

    function obtenerAviso() {
        if (aviso) return aviso;

        aviso = document.createElement("div");
        aviso.className = "aviso-giro";
        aviso.setAttribute("role", "status");
        aviso.setAttribute("aria-live", "polite");

        const icono = document.createElement("i");
        icono.setAttribute("aria-hidden", "true");

        const texto = document.createElement("span");

        aviso.append(icono, texto);
        document.body.appendChild(aviso);
        return aviso;
    }

    function avisar(mensaje, tipo) {
        const elemento = obtenerAviso();
        const alerta = tipo === "alerta";

        elemento.classList.remove("visible", "aviso-exito", "aviso-alerta");
        elemento.classList.add(alerta ? "aviso-alerta" : "aviso-exito");
        elemento.querySelector("i").className = alerta
            ? "fa-solid fa-triangle-exclamation"
            : "fa-solid fa-circle-check";
        elemento.querySelector("span").textContent = mensaje;

        void elemento.offsetWidth;
        elemento.classList.add("visible");

        window.clearTimeout(temporizadorAviso);
        temporizadorAviso = window.setTimeout(() => {
            elemento.classList.remove("visible");
        }, 3200);
    }

    function rebotar() {
        if (!botonCarrito) return;

        botonCarrito.classList.remove("rebote");
        void botonCarrito.offsetWidth;
        botonCarrito.classList.add("rebote");
    }

    if (botonCarrito) {
        botonCarrito.addEventListener("click", (evento) => {
            if (contarProductos() === 0) {
                evento.preventDefault();
                avisar("No tienes ningún producto en tu carrito", "alerta");
            }
        });

        botonCarrito.addEventListener("animationend", () => {
            botonCarrito.classList.remove("rebote");
        });
    }

    window.addEventListener("storage", actualizar);
    window.addEventListener("pageshow", actualizar);

    window.GiroVoltCarrito = { actualizar, avisar, rebotar };
    actualizar();
})();
