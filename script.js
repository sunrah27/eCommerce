document.addEventListener('DOMContentLoaded', function () {
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

    // Check and update the cart counter across every page.
    updateCartCounter();

    /////////////////////////////////////////////
    // Check if the current page is index.html //
    /////////////////////////////////////////////
    const isHomePage = window.location.pathname.includes('index.html');
    if (isHomePage) {
        fetchDataFromJSON('./productdb.json')
            .then(productData => {
                // Sort the products based on the date in descending order
                productData.sort((a, b) => b.pDate - a.pDate);
    
                // Select the container and row where you want to populate the latest products
                var row = document.getElementById('latestProductsRow');
    
                // Populate the Latest Product module with the 8 most recently added products
                for (var i = 0; i < 8 && i < productData.length; i++) {
                    var product = productData[i];
    
                    // Create the product HTML dynamically
                    var productHTML = `
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
            })
            .catch(error => {
                console.error('Error fetching product data:', error);
            });
    }

    ////////////////////////////////////////////////
    // Check if the current page is products.html //
    ////////////////////////////////////////////////
    const isProductsPage = window.location.pathname.includes('products.html');
    if (isProductsPage) {
        // Populate Products page with products from productdb.json
        const productRow = document.getElementById('productRow');

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

        fetchDataFromJSON('./productdb.json')
            .then(products => {
                // Insert products into the productRow
                products.forEach((product) => {
                    const productHTML = generateProductHTML(product);
                    productRow.insertAdjacentHTML('beforeend', productHTML);
                });
            })
            .catch(error => console.error('Error fetching products:', error));
    }

    ///////////////////////////////////////////////////////
    // Check if the current page is product-details.html //
    ///////////////////////////////////////////////////////
    const isProductDetailsPage = window.location.pathname.includes('product-details.html');
    if (isProductDetailsPage) {
        // Populate Product details based on sku
        const productDetailsRow = document.getElementById('productDetailsRow');

        function getSKUFromURL() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('sku');
        }

        function fetchProductDetails(sku) {
            fetchDataFromJSON('./productdb.json')
                .then(products => {
                    const product = products.find(product => product.pSku === sku);
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
                                <p>${product.pType}</p>
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
                                // console.log('Add to cart button clicked');

                                // Get the selected size and quantity
                                const sizeSelect = document.getElementById('selectSize');
                                const quantity = parseInt(document.getElementById('quantity').value, 10) || 0;

                                const selectedSize = sizeSelect.options[sizeSelect.selectedIndex].value;
                                // console.log('Selected size:', sizeSelect.options[sizeSelect.selectedIndex].value);


                                // Add the item to the cart
                                addToCart(product, selectedSize, quantity);
        
                                // You can also provide feedback to the user, such as a confirmation message
                                alert(`${quantity} ${product.pFullName}(s) size ${product.pSize} added to the cart!`);
                            });
                        } else {
                            console.error('Element with ID "addToCartBtn" not found.');
                        }
                        } else {
                        console.error('Product not found');
                    }
                })
                .catch(error => console.error('Error fetching product details:', error));
        }
        
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
        function fetchRelatedProducts(currentSku) {
            
            // console.log('Fetching related products for SKU:', currentSku);

            fetchDataFromJSON('./productdb.json')
                .then(products => {
                    // Find the current product
                    const currentProduct = products.find(product => product.pSku === currentSku);

                    if (currentProduct) {
                        // Filter products based on the pType of the current product
                        const relatedProducts = products.filter(product => product.pType === currentProduct.pType && product.pSku !== currentSku);

                        // console.log('Related Products:', relatedProducts);
        
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
                })
                .catch(error => console.error('Error fetching related products:', error));
        }

        // Get SKU from the URL and fetch product details
        const sku = getSKUFromURL();
        fetchProductDetails(sku);
        fetchRelatedProducts(sku);
    }

    const isCartPage = window.location.pathname.includes('cart.html');
    if (isCartPage) {
        // console.log('landed on cart page');
        displayCartItems();
    }
});

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

function displayCartItems() {
    const cartItemsContainer = document.getElementById('tableBody');
    const totalPriceContainer = document.querySelector('.totalPrice');
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    let total = 0;

    if (cartItems.length > 0) {
        // Populate cart items dynamically
        cartItems.forEach(item => {
            fetchDataFromJSON('./productdb.json')
                .then(products => {
                    const product = products.find(p => p.pSku === item.pSku);
                    console.log('product object:', product);
                    if (product) {
                        const cartItemHTML = `
                            <tr>
                                <td>
                                    <div class="cart-info">
                                        <img src="./assets/${product.pImages[0]}" alt="${product.pFullName}">
                                        <div>
                                            <p>${product.pFullName}</p>
                                            <small>Price: £${product.pPrice.toFixed(2)}</small>
                                            <a href="" onclick="removeCartItem('${product.pSku}', '${item.size}')">Remove</a>
                                        </div>
                                    </div>
                                </td>
                                <td>${item.size}</td>
                                <td>${item.quantity}</td>
                                <td>£${(item.quantity * product.pPrice).toFixed(2)}</td>
                            </tr>
                        `;
                        
                        console.log('item.quantity:', item.quantity, 'product.pPrice', product.pPrice);
                        // Calculate the total price for the cart
                        total += (item.quantity * product.pPrice);
                        console.log('total:',total);

                        // Append the cart item HTML to the cart items container
                        cartItemsContainer.innerHTML += cartItemHTML;

                        console.log('total2:',total);
                        // Calculate tax and total
                        const tax = total * 0.2; // 20% of the subtotal
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
                .catch(error => console.error('Error fetching product data:', error));
        });
    }
}

function removeCartItem(sku, size) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Remove the item from the cart based on SKU and size
    cartItems = cartItems.filter(item => !(item.pSku === sku && item.size === size));

    // Save the updated cart data to local storage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Update the cart display on the cart page
    displayCartItems();
    updateCartCounter();
}

function updateCartItemQuantity(sku, size, newQuantity) {
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Find the item in the cart based on SKU and size
    const cartItem = cartItems.find(item => item.pSku === sku && item.size === size);

    if (cartItem) {
        // Update the quantity of the item
        cartItem.quantity = parseInt(newQuantity, 10) || 0;

        // Save the updated cart data to local storage
        localStorage.setItem('cart', JSON.stringify(cartItems));

        // Update the cart display on the cart page
        displayCartItems();
        updateCartCounter();
    }
}