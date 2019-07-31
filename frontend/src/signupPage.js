import {addChildrenToElement, createInput, createNewElement} from './utils.js'
import renderNewsFeed from './newsFeed.js';

export default function renderLoginPage(apiUrl) {
    let mainContent = document.getElementsByTagName('main')[0];
    mainContent.innerText = "";
    // create login form, with a div wrapped around it
    let loginForm = document.createElement('form');
    loginForm.classList.add("auth-form")
    
    // create input fields
    let usernameInput = createInput('text', 'username', 'Enter Username');
    let passwordInput = createInput('password', 'password', 'Enter Password');
    let emailInput = createInput('email', 'email', 'Enter your email (optional)');
    let nameInput = createInput('text', 'name', 'Enter your name (optional)');
    let submitButton = createNewElement('button', {'value': 'Submit', "class": 'button button-secondary'}, 'SIGNUP')
    
    // put all input into the form
    addChildrenToElement(loginForm, usernameInput, passwordInput, emailInput, nameInput, submitButton);
    mainContent.appendChild(loginForm);

    submitButton.addEventListener('click', (e) => {
        e.preventDefault()
        const option = {
            body: JSON.stringify({ 
                "username": `${usernameInput.value}`, 
                "password": `${passwordInput.value}`,
                "email": `${emailInput.value}`,
                "name": `${nameInput.value}`
            }),
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            method: "POST",
        }
        fetch(`${apiUrl}/auth/signup`, option)
            .then(res => {
                console.log(res)
                if (res.status === 409 || res.status === 400) {
                    res.json()
                        .then(jsonRes => {
                            throw Error(jsonRes.message)
                        })
                        .catch(res => {
                            const error = document.getElementsByClassName("error-message");
                            // FIXME: more than 1 error
                            if (Array.from(error).length === 0) {
                                let errorMsg = createNewElement('p', {"class": 'error-message'}, res)
                                loginForm.insertBefore(errorMsg, loginForm.childNodes[4]);
                            }
                        })
                }
                if (res.status === 200) {
                    res.json().then(res => {
                        // TODO: fetch posts of the user
                        const token = res.token;
                        console.log(token);
                        renderNewsFeed(apiUrl, token);
                    })
                }
            })
    })
}