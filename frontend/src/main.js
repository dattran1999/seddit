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
import {addChildrenToElement} from './utils.js'
// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
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

export default initApp;
