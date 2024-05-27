let currentIndex = 0;
const items = document.querySelectorAll('.carousel-item');
const totalItems = items.length;

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



