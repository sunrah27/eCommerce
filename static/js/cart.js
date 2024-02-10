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

    // Remove item from the cart based on SKU and size
    cartItems = cartItems.filter(item => !(item.pSku === sku && item.size === size));

    // Save the updated cart data to local storage
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Update the cart display on the cart page
    displayCartItems(productData);
    updateCartCounter();
}

function addCartEventListners() {
    checkoutBtn.addEventListener('click', () => {
        event.preventDefault();
        showNotification2('Thank you for your purchase.');
    })
}