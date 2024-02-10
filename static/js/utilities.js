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