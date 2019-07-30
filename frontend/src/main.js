/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import renderLoginPage from './loginPage.js'
import renderSignupPage from './signupPage.js'
import renderNewsFeed from './newsFeed.js'
import {addChildrenToElement} from './utils.js'
// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
    // renderLoginPage(apiUrl);
    // addVotingIcons();
    renderNewsFeed(apiUrl);
    const logo = document.getElementById('logo');
    const loginButton = document.querySelector('button[data-id-login]');
    const signupButton = document.querySelector('button[data-id-signup]');
    logo.addEventListener('click', (e) => {
        renderNewsFeed(apiUrl);
    });
    loginButton.addEventListener('click', (e) => {
        renderLoginPage(apiUrl);
    });
    signupButton.addEventListener('click', (e) => {
        renderSignupPage();
    });

}

export default initApp;
