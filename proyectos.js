const seccionProductos = document.querySelector("#productos");

if (seccionProductos) {
    const resumenCarrito = seccionProductos.querySelector("#resumen-carrito span");
    const claveCarrito = "carritoGiroVolt";

    function obtenerCarrito() {
        let carritoGuardado;
        try {
            carritoGuardado = localStorage.getItem(claveCarrito);
        } catch (error) {
            throw new Error("El navegador bloqueó el acceso al almacenamiento.");
        }
        if (carritoGuardado === null) return [];

        let carrito;
        try {
            carrito = JSON.parse(carritoGuardado);
        } catch (error) {
            throw new Error("Los datos guardados del carrito están dañados.");
        }
        const formatoValido = Array.isArray(carrito) && carrito.every((producto) =>
            producto &&
            typeof producto.nombre === "string" &&
            Number.isFinite(producto.precio) &&
            Number.isInteger(producto.cantidad) &&
            producto.cantidad > 0
        );

        if (!formatoValido) {
            throw new Error("El formato del carrito guardado no es válido.");
        }

        return carrito;
    }

    function actualizarResumen(carrito) {
        const cantidadTotal = carrito.reduce((total, producto) => total + producto.cantidad, 0);
        const nombreProducto = cantidadTotal === 1 ? "producto" : "productos";
        resumenCarrito.textContent = `Carrito: ${cantidadTotal} ${nombreProducto}`;
    }

    function agregarProducto(tarjeta) {
        const campoCantidad = tarjeta.querySelector(".cantidad-producto");
        if (!campoCantidad.reportValidity()) return;

        const nombre = tarjeta.querySelector("h3").textContent.trim();
        const precioTexto = tarjeta.querySelector(".insignia").textContent;
        const precio = Number.parseFloat(precioTexto.replace(/[^\d.]/g, ""));

        if (!Number.isFinite(precio)) {
            alert("No se pudo identificar el precio del producto.");
            return;
        }

        try {
            const carrito = obtenerCarrito();
            const productoExistente = carrito.find((producto) => producto.nombre === nombre);

            if (productoExistente) {
                productoExistente.cantidad += campoCantidad.valueAsNumber;
            } else {
                carrito.push({ nombre, precio, cantidad: campoCantidad.valueAsNumber });
            }

            localStorage.setItem(claveCarrito, JSON.stringify(carrito));
            actualizarResumen(carrito);
        } catch (error) {
            alert("No se pudo guardar el producto en el carrito. Revisa el almacenamiento del navegador e inténtalo de nuevo.");
        }
    }

    try {
        actualizarResumen(obtenerCarrito());
    } catch (error) {
        alert("No se pudo leer el carrito guardado. Revisa el almacenamiento del navegador e inténtalo de nuevo.");
        throw error;
    }

    seccionProductos.addEventListener("click", (evento) => {
        const botonAgregar = evento.target.closest("[data-add-to-cart]");
        if (!botonAgregar) return;

        const tarjeta = botonAgregar.closest(".tarjeta-proyecto");
        agregarProducto(tarjeta);
    });
}
