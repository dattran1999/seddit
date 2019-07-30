import {addChildrenToElement, createInput, createNewElement} from './utils.js'

export default function renderLoginPage(apiUrl) {
    let mainContent = document.getElementsByTagName('main')[0];
    mainContent.innerText = "";
    // create login form, with a div wrapped around it
    let loginForm = document.createElement('form');
    loginForm.classList.add("auth-form")
    
    // create input fields
    let usernameInput = createInput('text', 'username', 'Enter Username');
    let passwordInput = createInput('password', 'password', 'Enter Password');
    let submitButton = createNewElement('button', {'value': 'Submit', "class": 'button button-secondary'}, 'SUBMIT')
    
    // put all input into the form
    addChildrenToElement(loginForm, usernameInput, passwordInput, submitButton);
    mainContent.appendChild(loginForm);

    submitButton.addEventListener('click', (e) => {
        e.preventDefault()
        const option = {
            body: `{ "username": "${usernameInput.value}", "password": "${passwordInput.value}"}`,
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST"
        }
        fetch(`${apiUrl}/auth/login`, option)
            .then(res => {
                if (res !== 200) {
                    throw Error('Wrong username or password')
                }
                res.json()
            })
            .catch(res => {
                let errorMsg = createNewElement('p', {"class": 'error-message'}, res)
                loginForm.insertBefore(errorMsg, loginForm.childNodes[2]);
            })
            .then(res => {
                // TODO: fetch posts of the user
            })
    })
}