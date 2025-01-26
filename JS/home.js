const burgerMenu = document.querySelector('#burger-menu');
const navMenu = document.querySelector('#nav-menu');

burgerMenu.addEventListener('click', () => {
    navMenu.classList.toggle('show'); // Toggle visibility
});
