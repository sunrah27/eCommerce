//
// Function run on index.html
//

// Function to populate the Latest Product module
async function populateLatestProducts(productData) {
    try {
        // Wait for the product data to be fetched and sorted
        const sortedProductData = await fetchAndSortProductData(productData);
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