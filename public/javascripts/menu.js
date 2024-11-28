/**
 * Obtener todos los links del menu.
 * Si el link es el mismo que la url actual, agregar la clase '.active'.
 */
function activePage() {
    const links = document.querySelectorAll('.menu ul li a');
    const currentUrl = window.location.pathname;

    links.forEach(link => {
        const href = link.getAttribute('href');

        if (href === currentUrl) {
            link.classList.add('active');
        }
    });
}

activePage();