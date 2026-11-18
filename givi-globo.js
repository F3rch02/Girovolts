(function () {
    const mensaje = "Pregúntame algo, soy Givi";
    const retrasoInicial = 1500;
    const duracionVisible = 9000;
    const limiteEspera = 20000;
    let globo = null;
    let boton = null;
    let temporizadorOcultar = null;

    function ubicar() {
        if (!globo || !boton) return;

        const rect = boton.getBoundingClientRect();
        const alto = globo.offsetHeight;
        const izquierda = rect.right + 12;
        const abajo = window.innerHeight - rect.bottom + (rect.height - alto) / 2;

        globo.style.left = `${Math.round(izquierda)}px`;
        globo.style.bottom = `${Math.max(8, Math.round(abajo))}px`;
        globo.style.maxWidth = `${Math.max(140, Math.min(260, window.innerWidth - izquierda - 12))}px`;
    }

    function ocultar() {
        window.clearTimeout(temporizadorOcultar);
        if (globo) globo.classList.remove("visible");
    }

    function crearGlobo() {
        globo = document.createElement("div");
        globo.className = "globo-givi";
        globo.setAttribute("role", "status");
        globo.setAttribute("aria-live", "polite");

        const texto = document.createElement("button");
        texto.type = "button";
        texto.className = "globo-givi-texto";
        texto.textContent = mensaje;
        texto.addEventListener("click", () => {
            ocultar();
            if (boton) boton.click();
        });

        const cerrar = document.createElement("button");
        cerrar.type = "button";
        cerrar.className = "globo-givi-cerrar";
        cerrar.setAttribute("aria-label", "Cerrar mensaje");
        cerrar.textContent = "×";
        cerrar.addEventListener("click", ocultar);

        globo.append(texto, cerrar);
        document.body.appendChild(globo);
    }

    function mostrar() {
        crearGlobo();
        ubicar();

        boton.addEventListener("click", ocultar);
        window.addEventListener("resize", ubicar);

        window.setTimeout(() => {
            ubicar();
            globo.classList.add("visible");
            temporizadorOcultar = window.setTimeout(ocultar, duracionVisible);
        }, retrasoInicial);
    }

    function ventanaAbierta() {
        const ventana = document.getElementById("dify-chatbot-bubble-window");
        if (!ventana) return false;

        const estilo = window.getComputedStyle(ventana);
        return estilo.display !== "none" && estilo.visibility !== "hidden";
    }

    function sincronizarLogo() {
        if (!boton) return;
        boton.classList.toggle("givi-abierto", ventanaAbierta());
    }

    function vigilarVentana() {
        sincronizarLogo();
        boton.addEventListener("click", () => {
            window.setTimeout(sincronizarLogo, 80);
            window.setTimeout(sincronizarLogo, 400);
        });

        const observador = new MutationObserver(sincronizarLogo);
        observador.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["style", "class"]
        });
    }

    function iniciar() {
        boton = document.getElementById("dify-chatbot-bubble-button");
        if (boton) {
            vigilarVentana();
            mostrar();
            return;
        }

        const observador = new MutationObserver(() => {
            boton = document.getElementById("dify-chatbot-bubble-button");
            if (!boton) return;
            observador.disconnect();
            vigilarVentana();
            mostrar();
        });
        observador.observe(document.body, { childList: true, subtree: true });
        window.setTimeout(() => observador.disconnect(), limiteEspera);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", iniciar);
    } else {
        iniciar();
    }
})();
