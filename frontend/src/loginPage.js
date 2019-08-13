import {addChildrenToElement, createInput, createNewElement} from './utils.js'
import renderNewsFeed from './newsFeed.js';
import renderNavBar from './components/navbar.js'

export default function renderLoginPage(apiUrl) {
    let mainContent = document.getElementsByTagName('main')[0];
    while(mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild)
    }
    // create login form, with a div wrapped around it
    let loginForm = document.createElement('form');
    loginForm.classList.add("auth-form")
    // create input fields
    let usernameInput = createInput('text', 'username', 'Enter Username');
    let passwordInput = createInput('password', 'password', 'Enter Password');
    let submitButton = createNewElement('button', {'value': 'Submit', "class": 'button button-secondary'}, 'LOGIN')
    
    // put all input into the form
    addChildrenToElement(loginForm, usernameInput, passwordInput, submitButton);
    mainContent.appendChild(loginForm);

    submitButton.addEventListener('click', async(e) => {
        e.preventDefault()
        const option = {
            method: "POST",
            body: `{ "username": "${usernameInput.value}", "password": "${passwordInput.value}"}`,
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
        }
        try {
            const res = await fetch(`${apiUrl}/auth/login`, option)
            const json = await res.json()
            if (res.status !== 200) {
                throw Error('Wrong username or password')
            }
            const token = json.token;
            localStorage.setItem('sedditToken', token);
            renderNavBar();
            renderNewsFeed(apiUrl, token);
        } catch (error) {
            let errorMsg = document.getElementsByClassName("error-message")[0];
            if (errorMsg === undefined) {
                errorMsg = createNewElement('p', {"class": 'error-message'}, error)
                loginForm.insertBefore(errorMsg, submitButton);
            }
        }
    })
}