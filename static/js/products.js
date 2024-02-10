//
// Function run on Products page
//

// Function to add event listeners for filter and sort
function setupFilterAndSortEventListeners(productData) {
    const filterByTypeDropdown = document.getElementById('filterByType');
    const sortByDropdown = document.getElementById('sortBy');

    filterByTypeDropdown.addEventListener('change', onDropdownChange);
    sortByDropdown.addEventListener('change', onDropdownChange);

    // Event listener function
    function onDropdownChange() {
        const selectedType = filterByTypeDropdown.value;
        const selectedSort = sortByDropdown.value;
        
        // Update the URL with the selected filter or sort
        window.history.replaceState({}, '', `?filter=${selectedType}&sort=${selectedSort}`);
        
        // Call the function to populate products based on filter and sort
        populateProductsPage(productData, selectedType, selectedSort);
    }
}

// Function to populate Products page with filters and sort
function populateProductsPage(productData, filterType = 'all', sortType = 'default') {
   
    // Use the filter from the URL if available, otherwise use the default
    filterType = getURLParameter('filter') || filterType;

    const productRow = document.getElementById('productRow');
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

// Get URL parameters function
function getURLParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
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