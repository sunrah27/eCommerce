document.addEventListener('DOMContentLoaded', function() {

    // Display mobile menu
    const menuItems = document.getElementById('menuItems');
    menuItems.style.maxHeight = '0px';

    document.getElementById('menuIcon').addEventListener('click', () => {
        if (menuItems.style.maxHeight === '0px') {
            menuItems.style.maxHeight = '200px';
        } else {
            menuItems.style.maxHeight = '0px';
        }
    });

    // Change the main product image
    const smallImagesContainer = document.getElementById('smallImages');
    const mainProductImage = document.getElementById('mainProduct');

    if (smallImagesContainer && mainProductImage){
        smallImagesContainer.addEventListener('click', function(event) {
            var target = event.target.closest('.small-img-col');
            if (target) {
                var newSrc = target.querySelector('img').src;
                mainProductImage.src = newSrc;
            }
        });
    }
});