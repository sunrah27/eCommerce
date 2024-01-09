document.addEventListener('DOMContentLoaded', function () {
    // Cart counter display
    const cartCounter = document.querySelector('.cartCounter');

    // Check if innerHTML value is 0, then hide the cartCounter
    cartCounter.style.display = cartCounter.innerHTML === '0' ? 'none' : 'block';

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

    // Check if the current page is index.html
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

    // Check if the current page is products.html
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

    // Check if the current page is product-details.html
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
                                <input type="number" value="1">
                                <a href="#" class="btn">Add to cart</a>
                                <h3>Product details <i class="fa fa-indent"></i></h3>
                                <p>${product.pDetail}</p></br>
                                <ul class="pDetailList">${product.pDetailList.map(item => `<li>${item}</li>`).join('')}</ul></br>
                                <p>${product.pDetailMaterials}</p>
                            </div>
                        `;
                        productDetailsRow.innerHTML = productDetailsHTML;

                        // Change the main product image on product-details.html
                        const smallImagesContainer = document.getElementById('smallImages');
                        const mainProductImage = document.getElementById('mainProduct');

                        if (smallImagesContainer && mainProductImage) {
                            smallImagesContainer.addEventListener('click', function (event) {
                                var target = event.target.closest('.small-img-col');
                                if (target) {
                                    var newSrc = target.querySelector('img').src;
                                    mainProductImage.src = newSrc;
                                }
                            });
                        }
                    } else {
                        console.error('Product not found');
                    }
                })
                .catch(error => console.error('Error fetching product details:', error));
        }

        // Function to fetch and display related products
        function fetchRelatedProducts(currentSku) {
            fetchDataFromJSON('./productdb.json')
                .then(products => {
                    // Find the current product
                    const currentProduct = products.find(product => product.pSku === currentSku);
        
                    if (currentProduct) {
                        // Filter products based on the pType of the current product
                        const relatedProducts = products.filter(product => product.pType === currentProduct.pType && product.pSku !== currentSku);
        
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