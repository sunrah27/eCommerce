//
// Function run on Contact page
//

// add event listners to the contact us page
function setupContactEventListeners() {
    reason.addEventListener('change', checkSelectedOptions);
    contactUs.addEventListener('click', contactMessage);
}

// Function to check options and display additional input fields
function checkSelectedOptions() {
    const productNo = document.getElementById('productNo');
    const orderNo = document.getElementById('orderNo');
    const selectedOption = document.getElementById('reason').value;

    if (selectedOption === 'product') {
        productNo.classList.remove('hidden');
        orderNo.classList.add('hidden');
    } else if (selectedOption === 'order') {
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