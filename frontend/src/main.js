/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import renderLoginPage from './loginPage.js'
import renderSignupPage from './signupPage.js'
import renderNewsFeed from './newsFeed.js'
import renderNavBar from "./components/navbar.js"
import {addChildrenToElement, createNewElement} from './utils.js'
// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
    createTemplateHtml();
    
    renderNavBar();
    const token = localStorage.getItem('sedditToken');
    if (token !== null) {
        renderNewsFeed(apiUrl, token)
    }
    else {
        renderNewsFeed(apiUrl)
    }
    const logo = document.getElementById('logo');
    const loginButton = document.querySelector('button[data-id-login]');
    const signupButton = document.querySelector('button[data-id-signup]');
    logo.addEventListener('click', () => {
        const token = localStorage.getItem('sedditToken');
        if (token === null) renderNewsFeed(apiUrl);
        else renderNewsFeed(apiUrl, token);
    });
    loginButton.addEventListener('click', () => {
        renderLoginPage(apiUrl);
    });
    signupButton.addEventListener('click', () => {
        renderSignupPage(apiUrl);
    });
}

function createTemplateHtml() {
    const root = document.getElementById('root');
    let header = document.getElementById('nav');
    console.log(header)
    if (header === null) {
        root.appendChild(createHeaderHtml());
    }
    let main = document.getElementsByTagName('main')[0];
    console.log(main)
    if (main === undefined) {
        main = createNewElement('main', {"role": 'main'})
        root.appendChild(main);
    }
}

function createHeaderHtml() {
    let header = createNewElement('header', {"class": "banner", "id": "nav"})
    let logo = createNewElement('h1', {"id": "logo", "class": "flex-center"}, "Seddit")
    let navbar = createNewElement('ul', {'class': 'nav'})
    let navItem0 = createNewElement('li', {'class': 'nav-item'})
    let searchBar = createNewElement('input', {'id': "search", 'data-id-search': "", "placeholder": "Search Seddit", "type": "search"})
    navItem0.appendChild(searchBar)
    let navItem1 = createNewElement('li', {'class': 'nav-item'})
    let loginButton = createNewElement('button', {"class":"button button-primary", "data-id-login": ""}, "LOGIN");
    navItem1.appendChild(loginButton)
    let navItem2 = createNewElement('li', {'class': 'nav-item'})
    let signupButton = createNewElement('button', {"class":"button button-secondary", "data-id-signup": ""}, "SIGN UP");
    navItem2.appendChild(signupButton)
    addChildrenToElement(navbar, navItem0, navItem1, navItem2)
    addChildrenToElement(header, logo, navbar)
    return header;
}
export default initApp;
