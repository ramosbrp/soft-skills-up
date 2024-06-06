let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;
const themeToggle = document.getElementById('themeToggle');


themeToggle.addEventListener('click', () => {

    /// Toggle themes on the <html> element
    document.documentElement.classList.toggle('dark-theme');
    document.documentElement.classList.toggle('light-theme');

    // Toggle themes specifically for the header or other elements if needed
    let elementsToToggle = document.querySelectorAll('.header, .other-class');
    elementsToToggle.forEach(element => {
        element.classList.toggle('dark-theme');
        element.classList.toggle('light-theme');
    });

    // Update button text based on the current theme
    this.textContent = document.documentElement.classList.contains('dark-theme') ? 'Tema Claro' : 'Tema Escuro';

    console.log(document.documentElement.classList);
});
// Funções
function updateCarousel() {
    items.forEach((item, index) => {
        if (index === currentIndex) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

document.querySelector('.left-arrow').addEventListener('click', () => {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
});

document.querySelector('.right-arrow').addEventListener('click', () => {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
});

// Initialize the carousel
updateCarousel();



