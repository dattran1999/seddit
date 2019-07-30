import {addChildrenToElement, createInput} from './utils.js'

export default function renderLoginPage() {
    let mainContent = document.getElementsByTagName('main')[0];
    const feed = mainContent.innerHTML;
    mainContent.innerText = "";
    // create login form, with a div wrapped around it
    let loginForm = document.createElement('form');
    let loginFormDiv = document.createElement('div');
    // create input fields
    let usernameInput = createInput('text', 'username', 'Enter Username');
    let passwordInput = createInput('password', 'password', 'Enter Password');
    let submitButton = document.createElement('button');
    submitButton.innerText = 'SUBMIT';
    submitButton.setAttribute('value', 'Submit');
    submitButton.classList.add('button','button-secondary');

    submitButton.addEventListener('click', (e) => {
        e.preventDefault()
        console.log('clicked submit');
    })
    // put all input into the form
    addChildrenToElement(loginForm, usernameInput, passwordInput, submitButton);
    loginFormDiv.appendChild(loginForm);
    loginFormDiv.setAttribute('class', 'form')
    console.log(loginFormDiv);
    mainContent.appendChild(loginFormDiv);
    return feed;
}