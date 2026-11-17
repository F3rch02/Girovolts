(function () {
    const isMobile = window.matchMedia("(max-width: 575.98px)").matches ||
        window.matchMedia("(pointer: coarse)").matches;

    if (!isMobile) return;

    let lastScrollY = window.scrollY;
    let touchStartY = null;
    let closeTimer = null;
    let desplazandoDentroDelChat = false;
    let desplazandoFueraDelChat = false;

    function obtenerVentana() {
        return document.querySelector("#dify-chatbot-bubble-window");
    }

    function obtenerBoton() {
        return document.querySelector("#dify-chatbot-bubble-button");
    }

    function estaAbierta() {
        const ventana = obtenerVentana();
        if (!ventana) return false;

        const estilo = window.getComputedStyle(ventana);
        const rect = ventana.getBoundingClientRect();

        return estilo.display !== "none" &&
            estilo.visibility !== "hidden" &&
            rect.width > 20 &&
            rect.height > 20;
    }

    function cerrarChat() {
        if (!estaAbierta()) return;

        const boton = obtenerBoton();
        if (boton) {
            boton.click();
            return;
        }

        const ventana = obtenerVentana();
        if (ventana) {
            ventana.style.setProperty("display", "none", "important");
        }
    }

    function comprobarDeslizamiento() {
        if (desplazandoDentroDelChat) return;
        const diferencia = Math.abs(window.scrollY - lastScrollY);
        if (desplazandoFueraDelChat && diferencia >= 8) {
            cerrarChat();
        }
        lastScrollY = window.scrollY;
    }

    window.addEventListener("scroll", function () {
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(comprobarDeslizamiento, 80);
    }, { passive: true });

    function estaDentroDelChat(evento) {
        const ventana = obtenerVentana();
        if (!ventana) return false;

        if (evento.target === ventana || ventana.contains(evento.target)) return true;

        return Boolean(evento.target.closest &&
            evento.target.closest("#dify-chatbot-bubble-window, #dify-chatbot-bubble-window iframe"));
    }

    window.addEventListener("pointerdown", function (evento) {
        desplazandoDentroDelChat = estaDentroDelChat(evento);
        desplazandoFueraDelChat = !desplazandoDentroDelChat;
        lastScrollY = window.scrollY;
    }, { passive: true });

    window.addEventListener("pointermove", function (evento) {
        desplazandoDentroDelChat = estaDentroDelChat(evento);
    }, { passive: true });

    window.addEventListener("mousemove", function (evento) {
        desplazandoDentroDelChat = estaDentroDelChat(evento);
    }, { passive: true });

    window.addEventListener("touchstart", function (evento) {
        desplazandoDentroDelChat = estaDentroDelChat(evento);
        desplazandoFueraDelChat = !desplazandoDentroDelChat;
        lastScrollY = window.scrollY;

        if (evento.touches.length > 0) {
            touchStartY = evento.touches[0].clientY;
        }
    }, { passive: true });

    window.addEventListener("touchmove", function (evento) {
        if (desplazandoDentroDelChat) return;
        desplazandoFueraDelChat = true;
    }, { passive: true });

    window.addEventListener("touchend", function () {
        touchStartY = null;
        desplazandoDentroDelChat = false;
        desplazandoFueraDelChat = false;
    }, { passive: true });

})();
