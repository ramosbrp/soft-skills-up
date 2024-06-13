// Constants and variables
var currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
const themeToggle = document.getElementById('themeToggle');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');



// Event listeners

/**
 * Adds all event listeners
 */
document.addEventListener('DOMContentLoaded', () => {
    // Toggle themes between light and dark
    themeToggle.addEventListener('change', toggleTheme);

    // Carousel navigation
    leftArrow.addEventListener('click', showPreviousItem);
    rightArrow.addEventListener('click', showNextItem);

});


/**
 * Funções
 */
 //Função mudar tema
function toggleTheme() {
    let targetTheme;
    let currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "light") {
        targetTheme = "dark";
    } else {
        targetTheme = "light";
    }
    document.documentElement.setAttribute("data-theme", targetTheme);
}

/**
 * Item anteriror carousel
 */
function showPreviousItem() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
}

/**
 * Próximo item carousel
 */
function showNextItem() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
}

/**
 * Atualiza carousel
 */
function updateCarousel() {
    items.forEach((item, index) => {
        item.style.display = (index === currentIndex) ? 'flex' : 'none';
    });
}

// Initializa o carousel
updateCarousel();
