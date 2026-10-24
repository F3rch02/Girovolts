
const slides = document.querySelectorAll('.fondo-carrusel .slide');
const tiempo = 5000; // milisegundos entre cada imagen (5000 = 5 segundos)
let actual = 0;

if (slides.length > 0) {
    slides[0].classList.add('activa');

    if (slides.length > 1) {
        setInterval(() => {
            slides[actual].classList.remove('activa');
            actual = (actual + 1) % slides.length;
            slides[actual].classList.add('activa');
        }, tiempo);
    }
}
