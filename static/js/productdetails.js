//
// Function run on product-details page
//

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

        // Change the main product image on product-details.html
        if (smallImages) {
            smallImages.addEventListener('click', function (event) {
                var target = event.target.closest('.small-img-col');
                if (target) {
                    var newSrc = target.querySelector('img').src;
                    mainProduct.src = newSrc;
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

                addToCart(product, selectedSize, quantity);
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