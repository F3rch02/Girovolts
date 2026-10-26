const contenedorImagen = document.getElementById("fulImgBox"),
      imagenCompleta = document.getElementById("fulImg");

function mostrarImagenCompleta(urlImagen, textoAlt) {
    imagenCompleta.src = urlImagen;
    imagenCompleta.alt = textoAlt || "";
    contenedorImagen.style.display = "flex";
    document.body.style.overflow = "hidden";
}

function ocultarImagenCompleta() {
    contenedorImagen.style.display = "none";
    document.body.style.overflow = "";
}

// Cerrar tocando el fondo oscuro o con la tecla Esc
contenedorImagen.addEventListener("click", function (e) {
    if (e.target === contenedorImagen) ocultarImagenCompleta();
});
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") ocultarImagenCompleta();
});
