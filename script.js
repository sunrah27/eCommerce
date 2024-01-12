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
        const sku = getSKUFromURL();
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

//
// Functions run on multiple pages
//

// function to fetch data from JSON file
async function fetchDataFromJSON(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Error loading data from ${filePath}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// function to generate star icons based on rating
function generateStarIcons(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(rating);

    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fa fa-star"></i>';
    }
    if (halfStar) {
        starsHTML += '<i class="fa fa-star-half-o"></i>';
    }
    for (let j = 0; j < emptyStars; j++) {
        starsHTML += '<i class="fa fa-star-o"></i>';
    }
    return starsHTML;
}

// Function check if user is logged in when Cart is clicked and redirect to Cart page or Login page
function handleCartContainerClick() {
    const cartContainer = document.querySelector('.cartContainer img');
    if (cartContainer) {
        cartContainer.addEventListener('click', function () {
            const loggedInUser = localStorage.getItem('loggedInUser');
            const redirectPath = loggedInUser ? './cart.html' : './login.html';
            window.location.href = redirectPath;
        });
    }
}

// function to display a notification product is added cart
function showNotification(message) {
    const notificationContainer = document.getElementById('notification-container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerText = message;

    notificationContainer.appendChild(notification);

    notification.addEventListener('click', () => {
        hideNotification(notification, notificationContainer);
    });

    setTimeout(() => {
        notification.classList.add('hidden');
        setTimeout(() => {
            notificationContainer.removeChild(notification);
        }, 500); // fadeout animation time. needs to match CSS timing in .notification. js time is in ms css time is in s 
    }, 3000); // time the notification is displayed in ms
}

function showNotification2(message) {
    const notificationContainer = document.getElementById('notification-container2');
    const notification = document.createElement('div');
    notification.classList.add('notification2');
    notification.innerText = message;

    notificationContainer.appendChild(notification);

    notification.addEventListener('click', () => {
        hideNotification(notification, notificationContainer);
    });

    setTimeout(() => {
        notification.classList.add('hidden');
        setTimeout(() => {
            if (notificationContainer.contains(notification)){
                notificationContainer.removeChild(notification);
            }
        }, 500); // fadeout animation time. needs to match CSS timing in .notification. js time is in ms css time is in s 
    }, 3000); // time the notification is displayed in ms
}

function hideNotification(notification, container) {
    notification.classList.add('hidden');
    setTimeout(() => {
        container.removeChild(notification);
    }, 500); // fadeout animation time (needs to match CSS timing in .notification; JavaScript time is in ms, CSS time is in s)
}

// Function to check if a user is already logged in
function checkLoggedInUser() {
    const loggedInUser = localStorage.getItem('loggedInUser');

    if (loggedInUser) {
        updateMenuAndHideLoginMessage(loggedInUser);
        const isLoginPage = window.location.pathname.includes('login.html');
        if (isLoginPage) {
            hideLoginMessage();
        }
    }

    const newLogIn = localStorage.getItem('newLogIn');
    if (newLogIn) {
        showNotification(`Welcome ${JSON.parse(loggedInUser).username}`);
        localStorage.removeItem('newLogIn');
    }
}

function updateMenuAndHideLoginMessage(loggedInUser) {
    const usernameLabel = `Hello ${JSON.parse(loggedInUser).username}`;
    document.getElementById('menuItems').querySelector('li:last-child').innerHTML = usernameLabel;

    const isLoginPage = window.location.pathname.includes('login.html');
    if (isLoginPage) {
        hideLoginMessage();
    }
}

function hideLoginMessage() {
    const loginMessage = document.querySelector('.loginMessage');
    loginMessage.classList.add('hide');
}

//
// Function run on index.html
//

// Function to populate the Latest Product module
async function populateLatestProducts(productData) {
    try {
        // Wait for the product data to be fetched and sorted
        const sortedProductData = await fetchAndSortProductData(productData);
        // Select the container and row where you want to populate the latest products
        const row = document.getElementById('latestProductsRow');
        // Clear existing content in the row
        row.innerHTML = '';

        // Populate the Latest Product module with the 8 most recently added products
        for (let i = 0; i < 8 && i < sortedProductData.length; i++) {
            const product = sortedProductData[i];

            // Create the product HTML dynamically
            const productHTML = `
                <div class="col-4">
                    <a href="./product-details.html?sku=${product.pSku}">
                        <img src="./assets/${product.pImages[0]}" alt="${product.pFullName}">
                        <h4>${product.pFullName}</h4>
                        <div class="rating">
                            ${generateStarIcons(product.pStar)}
                        </div>
                        <p>£${product.pPrice.toFixed(2)}</p>
                    </a>
                </div>
            `;

            // Append the product HTML to the row
            row.innerHTML += productHTML;
        }
    } catch (error) {
        console.error('Error fetching and populating latest products:', error);
    }
}

// Function to fetch and sort product data
function fetchAndSortProductData(productData) {
    // Sorting logic remains the same
    return productData.sort((a, b) => b.pDate - a.pDate);
}

//
// Function run on Products page
//

// Get URL parameters function
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// Function to populate Products page with filters and sort
function populateProductsPage(productData, filterType = 'all', sortType = 'default') {
    // Get filter parameter from the URL, if available
    const urlFilterType = getURLParameter('filter');

    // Use the filter from the URL if available, otherwise use the default
    filterType = urlFilterType || filterType;

    const productRow = document.getElementById('productRow');
    
    // Clear existing content in the row
    productRow.innerHTML = '';

    // Apply filter by type
    const filteredProducts = (filterType !== 'all') ? productData.filter(product => product.pType.toLowerCase() === filterType) : productData;

    // Apply sorting
    const sortedProducts = sortProducts(filteredProducts, sortType);

    // Populate the Products page with filtered and sorted products
    sortedProducts.forEach((product) => {
        const productHTML = generateProductHTML(product);
        productRow.insertAdjacentHTML('beforeend', productHTML);
    });
}

// Function to generate product HTML
function generateProductHTML(product) {
    return `
        <div class="col-4">
            <div class="product">
                <a href="./product-details.html?sku=${product.pSku}">
                    <img src="./assets/${product.pImages[0]}" alt="${product.pFullName}">
                    <h4>${product.pFullName}</h4>
                    <div class="rating">
                        ${generateStarIcons(product.pStar)}
                    </div>
                    <p>£${product.pPrice.toFixed(2)}</p>
                </a>
            </div>
        </div>
    `;
}

// Function to populate the "Filter by Type" dropdown
function populateFilterByTypeDropdown(productData) {
    const filterByTypeDropdown = document.getElementById('filterByType');
    const uniquePTypes = [...new Set(productData.map(product => product.pType))];

    uniquePTypes.forEach(type => {
        const option = document.createElement('option');
        option.value = type.toLowerCase();
        option.textContent = type;
        filterByTypeDropdown.appendChild(option);
    });
}

// Function to add event listeners for filter and sort
function setupFilterAndSortEventListeners(productData) {
    const filterByTypeDropdown = document.getElementById('filterByType');
    const sortByDropdown = document.getElementById('sortBy');

    // Event listener for filter by type
    filterByTypeDropdown.addEventListener('change', function () {
        const selectedType = filterByTypeDropdown.value;
        const selectedSort = sortByDropdown.value;
        // Update the URL with the selected filter
        window.history.replaceState({}, '', `?filter=${selectedType}&sort=${selectedSort}`);
        // Call the function to populate products based on filter and sort
        populateProductsPage(productData, selectedType, selectedSort);
    });

    // Event listener for sort
    sortByDropdown.addEventListener('change', function () {
        const selectedType = filterByTypeDropdown.value;
        const selectedSort = sortByDropdown.value;
        // Update the URL with the selected sort
        window.history.replaceState({}, '', `?filter=${selectedType}&sort=${selectedSort}`);
        // Call the function to populate products based on filter and sort
        populateProductsPage(productData, selectedType, selectedSort);
    });
}

// Function to sort products based on selected option
function sortProducts(products, sortType) {
    switch (sortType) {
        case 'default':
            return products.sort((a, b) => a.pSku - b.pSku);
        case 'priceH':
            return products.sort((a, b) => b.pPrice - a.pPrice);
        case 'priceL':
            return products.sort((a, b) => a.pPrice - b.pPrice);
        case 'rating':
            return products.sort((a, b) => b.pStar - a.pStar);
        default:
            return products.sort((a, b) => a.pSku - b.pSku);
    }
}

//
// Function run on product-details page
//

// Function to read SKU from URL
function getSKUFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('sku');
}

// Function to populate the product-details page based on the SKU passed via URL
function fetchProductDetails(sku, productData) {
    const product = productData.find(product => product.pSku === sku);
    document.title = `Red Store | ${product.pFullName}`;
    if (product) {
        const productDetailsHTML = `
            <div class="col-2">
                <img id="mainProduct" src="./assets/${product.pImages[0]}">
                <div class="small-img-row" id="smallImages">
                    <div class="small-img-col">
                        <img src="./assets/${product.pImages[0]}">
                    </div>
                    <div class="small-img-col">
                        <img src="./assets/${product.pImages[1]}">
                    </div>
                    <div class="small-img-col">
                        <img src="./assets/${product.pImages[2]}">
                    </div>
                    <div class="small-img-col">
                        <img src="./assets/${product.pImages[3]}">
                    </div>
                </div>
            </div>
            <div class="col-2">
                <p>${product.pType} \\ SKU-${product.pSku}</p>
                <h1>${product.pFullName}</h1>
                <div class="rating">
                    ${generateStarIcons(product.pStar)}
                </div>
                <h4>£${product.pPrice.toFixed(2)}</h4>
                <select name="selectSize" id="selectSize">
                    ${product.pSize.map(size => `<option value="${size}">${size}</option>`).join('')}
                </select>
                <input id="quantity" type="number" value="1">
                <a id="addToCartBtn" href="" class="btn">Add to cart</a>
                <h3>Product details <i class="fa fa-indent"></i></h3>
                <p>${product.pDetail}</p></br>
                <ul class="pDetailList">${product.pDetailList.map(item => `<li>${item}</li>`).join('')}</ul></br>
                <p>${product.pDetailMaterials}</p>
            </div>
        `;
        productDetailsRow.innerHTML = productDetailsHTML;

        // add Event Listeners
        const smallImagesContainer = document.getElementById('smallImages');
        const mainProductImage = document.getElementById('mainProduct');
        const addToCartBtn = document.getElementById('addToCartBtn');

        // Change the main product image on product-details.html
        if (smallImagesContainer) {
            smallImagesContainer.addEventListener('click', function (event) {
                var target = event.target.closest('.small-img-col');
                if (target) {
                    var newSrc = target.querySelector('img').src;
                    mainProductImage.src = newSrc;
                }
            });
        } else {
        console.error('Element with ID "smallImagesContainer" and "mainProductImage" not found.');
        }

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', function (event) {
                event.preventDefault();

                // Get the selected size and quantity
                const sizeSelect = document.getElementById('selectSize');
                const quantity = parseInt(document.getElementById('quantity').value, 10) || 0;
                let selectedSize;

                switch(sizeSelect.options[sizeSelect.selectedIndex].value) {
                    case "S":
                        selectedSize = "Small";
                        break;
                    case "M":
                        selectedSize = "Medium";
                        break;
                    case "L":
                        selectedSize = "Large";
                        break;
                    case "XL":
                        selectedSize = "X-Large";
                        break;
                    case "XXL":
                        selectedSize = "XX_large";
                        break;
                };

                // Add the item to the cart
                addToCart(product, selectedSize, quantity);

                // You can also provide feedback to the user, such as a confirmation message
                showNotification(`${quantity} ${product.pFullName}(s) size ${selectedSize} added to the cart!`);
            });
        } else {
            console.error('Element with ID "addToCartBtn" not found.');
        }
    }  
}
        
// Function to add selected product to cart and store data to local storage
function addToCart(product, size, quantity) {
    // Get the existing cart data from local storage or initialize an empty array
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the product is already in the cart
    const existingItem = cartItems.find(item => item.pSku === product.pSku && item.size === size);

    if (existingItem) {
        // Update the quantity and size if the product is already in the cart
        existingItem.quantity += quantity;
    } else {
        // Add a new item to the cart
        const newItem = {
            pSku: product.pSku,
            size: size,
            quantity: quantity,
        };
        cartItems.push(newItem);
    }

    // Save the updated cart data to local storage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Update the cart counter display
    updateCartCounter();
}

// Function to fetch and display related products
function fetchRelatedProducts(currentSku, productData) {
    // Find the current product
    const currentProduct = productData.find(product => product.pSku === currentSku);

    if (currentProduct) {
        // Filter products based on the pType of the current product
        const relatedProducts = productData.filter(product => product.pType === currentProduct.pType && product.pSku !== currentSku);

        // Display up to 4 related products
        const maxRelatedProducts = 4;
        const relatedProductsRow = document.getElementById('relatedProductsRow');

        for (let i = 0; i < maxRelatedProducts && i < relatedProducts.length; i++) {
            const relatedProduct = relatedProducts[i];

            // Create the related product HTML dynamically
            const relatedProductHTML = `
                <div class="col-4">
                    <div class="product">
                        <a href="./product-details.html?sku=${relatedProduct.pSku}">
                            <img src="./assets/${relatedProduct.pImages[0]}" alt="${relatedProduct.pFullName}">
                            <h4>${relatedProduct.pFullName}</h4>
                            <div class="rating">
                                ${generateStarIcons(relatedProduct.pStar)}
                            </div>
                            <p>£${relatedProduct.pPrice.toFixed(2)}</p>
                        </a>
                    </div>
                </div>
            `;

            // Append the related product HTML to the row
            relatedProductsRow.innerHTML += relatedProductHTML;
        }
    } else {
        console.error('Current product not found');
    }
}

// Function to update the cart counter display
function updateCartCounter() {
    const cartCounter = document.querySelector('.cartCounter');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Update the cart counter based on the total quantity in the cart
    const totalQuantity = cartItems.reduce((total, item) => total + item.quantity, 0);
    cartCounter.innerHTML = totalQuantity.toString();

    // Show or hide the cart counter based on whether there are items in the cart
    cartCounter.style.display = totalQuantity === 0 ? 'none' : 'block';
}

//
// Function runs only in the Cart page
//

// Function to display cart items stored in local storage on the carts page
function displayCartItems(productData) {
    const cartItemsContainer = document.getElementById('tableBody');
    const totalPriceContainer = document.querySelector('.totalPrice');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    let total = 0;

    // check if there is anything in the cart
    if (cartItems.length > 0) {
        // Populate cart items dynamically
        cartItems.forEach(item => {
            // find product details based on the pSku value stored in the local storage
            const product = productData.find(product => product.pSku === item.pSku);
            if (product) {
                // generate html for cart page
                const cartItemHTML = `
                    <tr>
                        <td>
                            <div class="cart-info">
                                <img src="./assets/${product.pImages[0]}" alt="${product.pFullName}">
                                <div>
                                    <p>${product.pFullName}</p>
                                    <small>SKU-${product.pSku}</small>
                                    <small>Price: £${product.pPrice.toFixed(2)}</small>
                                    <a href="" onclick="removeCartItem('${product.pSku}', '${item.size}')">Remove</a>
                                </div>
                            </div>
                        </td>
                        <td><p>${item.size}</p></td>
                        <td><p>${item.quantity}</p></td>
                        <td><p>£${(item.quantity * product.pPrice).toFixed(2)}</p></td>
                    </tr>
                `;
                
                // Calculate the total price for the cart
                total += (item.quantity * product.pPrice);

                // Append the cart item HTML to the cart items container
                cartItemsContainer.innerHTML += cartItemHTML;

                // Calculate tax and total
                const tax = total * 0.2;
                const subtotal = total * 0.8;

                // Update the total price table HTML
                const totalPriceHTML = `
                    <table>
                        <tbody>
                            <tr>
                                <td>Subtotal</td>
                                <td>£${(subtotal).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Tax @ 20%</td>
                                <td>£${tax.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td>Total</td>
                                <td>£${total.toFixed(2)}</td>
                            </tr>
                        </tbody>
                    </table>
                `;
                totalPriceContainer.innerHTML = totalPriceHTML;
            } else {
                console.error('Product not found for SKU:', item.pSku);
            }
        })
    };
}

// Function to remove an Item from the cart
function removeCartItem(sku, size, productData) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove the item from the cart based on SKU and size
    cartItems = cartItems.filter(item => !(item.pSku === sku && item.size === size));

    // Save the updated cart data to local storage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Update the cart display on the cart page
    displayCartItems(productData);
    updateCartCounter();
}

function addCartEventListners() {
    const checkoutBtn = document.getElementById('checkoutBtn');
    checkoutBtn.addEventListener('click', checkoutMessage);
}

function checkoutMessage (event) {
    event.preventDefault();
    showNotification2('Thank you for your purchase.')
}

//
// Function run on Login page
//

// Function to add Event Listenrs on the Login page
function setupLoginEventListeners() {
    const loginButton = document.getElementById('login');
    const signupButton = document.getElementById('signup');

    loginButton.addEventListener('click', handleLogin);
    signupButton.addEventListener('click', handleSignup);

    const title = document.querySelectorAll(".tab-header .title");
    title.forEach(function (title) {
        title.addEventListener("click", function () {
            const tabName = title.textContent.toLowerCase().trim();
            openTab(tabName);
        });
    });
}

// function to display login or sign-up fields on the login page
function openTab(tabName) {
    const tabs = document.getElementsByClassName("form-input");
    const tabHeader = document.getElementsByClassName("title");

    for (let i = 0; i < tabs.length; i++) {
        if (tabs[i].classList.contains(tabName)) {
            tabs[i].classList.add("active");
            tabHeader[i].classList.remove("notActive");
        } else {
            tabs[i].classList.remove("active");
            tabHeader[i].classList.add("notActive");
        }
    }
}

// Function to handle the login process
async function handleLogin(event) {
    event.preventDefault();
    // Get the entered email and password
    const enteredEmail = document.getElementById('email').value;
    const enteredPassword = document.getElementById('password').value;

    try {
        // Fetch user data from user.json
        const users = await fetchDataFromJSON('./user.json');
        const matchedUser = users.find(user => user.email === enteredEmail && user.password === enteredPassword);

        if (matchedUser) {
            // Store the session to local storage
            localStorage.setItem('loggedInUser', JSON.stringify(matchedUser));

            // Redirect to homepage
            localStorage.setItem('newLogIn', 1);
            window.location.href = './index.html';
        } else {
            // Display the loginMessage by removing the .hide class
            const loginMessage = document.querySelector('.loginMessage');
            loginMessage.classList.remove('hide');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Function to handle the signup process
function handleSignup(event) {
    event.preventDefault();
    const inputFields = document.querySelectorAll('#ufullname, #uemail, #upassword, #uaddress1, #ucity, #upostcode');
    const message = document.querySelector('.loginMessage2');

    if(inputFields[0].value !== '' || inputFields[1].value !== '' || inputFields[2].value !== '' || inputFields[3].value !== '' || inputFields[4].value !== '' || inputFields[5].value !== '' ) {
        showNotification2('Thank you registering an account.');
        inputFields.forEach(function (inputField) {
            inputField.value = '';
        })
        message.classList.add('hide');
    } else {
        message.classList.remove('hide');
    }
    console.log('poke');
    console.log(inputFields);
    console.log(message)
}

//
// Function run on Contact page
//

// add event listners to the contact us page
function setupContactEventListeners() {
    const dropdown = document.getElementById('reason');
    const contactUs = document.getElementById('contactUs');

    dropdown.addEventListener('change', checkSelectedOptions);
    contactUs.addEventListener('click', contactMessage);
}

// Function to check options and display additional input fields
function checkSelectedOptions() {
    const productNo = document.getElementById('productNo');
    const orderNo = document.getElementById('orderNo');
    const selectedOption = dropdown.value;

    if (selectedOption === 'product') {
        productNo.classList.remove('hidden');
        orderNo.classList.add('hidden');
    } else if (selectedOption === 'order') {
        console.log('order match');
        orderNo.classList.remove('hidden');
        productNo.classList.add('hidden');
    } else {
        productNo.classList.add('hidden');
        orderNo.classList.add('hidden');
    };
}

// Display thank you message when contact us form is completed
function contactMessage(event) {
    event.preventDefault();
    const inputFields = document.querySelectorAll('#reason, #productNo, #orderNo, #name, #email, #textarea');
    const reasonSelect = document.getElementById('reason');
    const message = document.querySelector('.loginMessage');

    if (inputFields[3].value  && inputFields[4].value && inputFields[5].value){
        showNotification2('Thank you for contacting us. We will reply as soon as possible.');
        inputFields.forEach(function (inputField) {
            inputField.value = '';
        })
        reasonSelect.selectedIndex = 0;
        message.classList.add('hide');
    } else {
        message.classList.remove('hide');
    };
}

// Fucntion added to clear local storage via console
function clearLocalStorage() {
    localStorage.clear();
    location.reload(true);
}