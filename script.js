document.addEventListener('DOMContentLoaded', function() {

    const menuItems = document.getElementById('menuItems');
    const header = document.querySelector('.header');
    const navbar = document.querySelector('.navbar');

    menuItems.style.maxHeight = '0px';

    document.getElementById('menuIcon').addEventListener('click', () => {
        if (menuItems.style.maxHeight === '0px') {
            menuItems.style.maxHeight = '200px';
        } else {
            menuItems.style.maxHeight = '0px';
        }
    });
});