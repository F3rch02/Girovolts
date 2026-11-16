const seccionProductos = document.querySelector("#productos");

if (seccionProductos) {
    const resumenCarrito = seccionProductos.querySelector("#resumen-carrito span");
    let totalProductos = 0;

    seccionProductos.addEventListener("click", (evento) => {
        const boton = evento.target.closest("[data-add-to-cart]");
        if (!boton) return;

        const tarjeta = boton.closest(".tarjeta-proyecto");
        const cantidad = tarjeta.querySelector(".cantidad-producto");
        if (!cantidad.reportValidity()) return;

        totalProductos += cantidad.valueAsNumber;
        const plural = totalProductos === 1 ? "producto" : "productos";
        resumenCarrito.textContent = `Carrito: ${totalProductos} ${plural}`;
    });
}
