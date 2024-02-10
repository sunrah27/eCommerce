//
// Function run on Login page
//

// Function to add Event Listenrs on the Login page
function setupLoginEventListeners() {
    login.addEventListener('click', handleLogin);
    // signupBlogintton.addEventListener('click', handleSignup);

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
}