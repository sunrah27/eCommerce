// Import other modules
import { fetchDataFromJSON, generateStarIcons, handleCartContainerClick, showNotification, showNotification2, hideNotification, checkLoggedInUser, updateMenuAndHideLoginMessage, hideLoginMessage } from './utilities.js';
import { populateLatestProducts, fetchAndSortProductData } from './home.js';
import { setupFilterAndSortEventListeners, populateProductsPage, getURLParameter, generateProductHTML, populateFilterByTypeDropdown, sortProducts } from './products.js';
import { fetchProductDetails, addToCart, fetchRelatedProducts, updateCartCounter } from './productdetails.js';
import { displayCartItems, removeCartItem, addCartEventListners } from './cart.js';
import { setupLoginEventListeners, openTab, handleLogin, handleSignup } from './login.js';
import { setupContactEventListeners, checkSelectedOptions, contactMessage } from './contact.js';

document.addEventListener('DOMContentLoaded', async function () {
    const productData = await fetchDataFromJSON('./productdb.json');
    
    // Display mobile menu
    const menuItems = document.getElementById('menuItems');
    const menuIcon = document.getElementById('menuIcon');
    menuItems.style.maxHeight = '0px';
    menuIcon.addEventListener('click', () => {
        menuItems.style.maxHeight = menuItems.style.maxHeight === '0px' ? '200px' : '0px';
    });

    // Check if the current page is index.html
    const isHomePage = window.location.pathname.endsWith('/index.html') || window.location.pathname === '/eCommerce/';
    if (isHomePage) {
        populateLatestProducts(productData);
    }

    // Check if the current page is products.html
    const isProductsPage = window.location.pathname.includes('products.html');
    if (isProductsPage) {
        populateFilterByTypeDropdown(productData);
        setupFilterAndSortEventListeners(productData);
        populateProductsPage(productData);
    }

    // Check if the current page is product-details.html
    const isProductDetailsPage = window.location.pathname.includes('product-details.html');
    if (isProductDetailsPage) {
        const sku = getURLParameter('sku');
        fetchProductDetails(sku, productData);
        fetchRelatedProducts(sku, productData);
    }

    // Check if the current page is cart.html
    const isCartPage = window.location.pathname.includes('cart.html');
    if (isCartPage) {
        displayCartItems(productData);
        addCartEventListners();
    }

    // Check if the current page is login.html
    const isLoginPage = window.location.pathname.includes('login.html');
    if (isLoginPage) {
        setupLoginEventListeners();
    }

    const isContactPage = window.location.pathname.includes('contact.html');
    if (isContactPage) {
        setupContactEventListeners();
    }

    // Check if the user is logged in or not and redirect to Cart or Login page
    handleCartContainerClick();
    // Check if the user is logged in
    checkLoggedInUser();
    // Check and update the cart counter across every page.
    updateCartCounter();
});