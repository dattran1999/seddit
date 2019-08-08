import {addChildrenToElement, createInput, createNewElement} from './utils.js'
import renderNewsFeed from './newsFeed.js';
import renderNavBar from './components/navbar.js'

export default function renderLoginPage(apiUrl) {
    let mainContent = document.getElementsByTagName('main')[0];
    mainContent.innerText = "";
    // create login form, with a div wrapped around it
    let loginForm = document.createElement('form');
    loginForm.classList.add("auth-form")
    renderNavBar();
    // create input fields
    let usernameInput = createInput('text', 'username', 'Enter Username');
    let passwordInput = createInput('password', 'password', 'Enter Password');
    let submitButton = createNewElement('button', {'value': 'Submit', "class": 'button button-secondary'}, 'LOGIN')
    
    // put all input into the form
    addChildrenToElement(loginForm, usernameInput, passwordInput, submitButton);
    mainContent.appendChild(loginForm);

    submitButton.addEventListener('click', (e) => {
        e.preventDefault()
        const option = {
            method: "POST",
            body: `{ "username": "${usernameInput.value}", "password": "${passwordInput.value}"}`,
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
        }
        fetch(`${apiUrl}/auth/login`, option)
            .then(res => {
                console.log(res)
                if (res.status !== 200) {
                    throw Error('Wrong username or password')
                }
                return res.json();
            })
            .then(res => {
                // TODO: fetch posts of the user
                const token = res.token;
                console.log(token);
                localStorage.setItem('sedditToken', token);
                // renderNavBar();
                // renderNewsFeed(apiUrl, token);
                return true;
            })
            .catch(res => {
                const error = document.getElementsByClassName("error-message");
                if (Array.from(error).length === 0) {
                    let errorMsg = createNewElement('p', {"class": 'error-message'}, res)
                    loginForm.insertBefore(errorMsg, loginForm.childNodes[2]);
                }
            })
    })
}