import { createNewElement, getUserId } from "../utils.js";
import renderProfilePage from '../profilePage.js';
import renderLoginPage from "../loginPage.js";
import renderSignupPage from "../signupPage.js"
import API_URL from "../backend_url.js";
import renderNewsFeed from "../newsFeed.js";
import renderFilteredNewsFeed from '../filteredNewsFeed.js'

export default async function renderNavBar() {    
    let navbar = document.getElementById('nav');
    let navbarList; 
    if (navbar !== null) {
        navbarList = navbar.getElementsByClassName('nav')[0];
    }
    else {
        return;
    }
    // check if the token is valid by get the user id (GET /user)
    const userId = await getUserId();
    // if logged in
    if (userId !== null) {
        // create the whole nav bar from scratch
        // see if my profile button is there
        let myProfileButton = document.getElementById("my-profile-button");
        // create my profile button 
        if (myProfileButton === null) {
            let myProfileListItem = createNewElement('li', {'class': 'nav-item', "id": "my-profile-button-div"});
            myProfileButton = createNewElement('button', {"class": "button button-primary", "id": "my-profile-button"}, "My Profile");
            myProfileButton.addEventListener('click', renderProfilePage);
            myProfileListItem.appendChild(myProfileButton);
            navbarList.insertBefore(myProfileListItem, navbarList.childNodes[0]);
            // Remove login button and signup button
            const loginButton = navbarList.querySelector(".button[data-id-login]");
            const loginButtonDiv = loginButton.parentElement;
            loginButtonDiv.removeChild(loginButton);
            const signupButton = navbarList.querySelector(".button[data-id-signup]");
            const signupButtonDiv = signupButton.parentElement;
            signupButtonDiv.removeChild(signupButton);
            navbarList.removeChild(signupButtonDiv);
            // add logout button 
            let logoutButtonDiv = createNewElement('li', {'class': 'nav-item', "id": "logout-button-div"});
            let logoutButton = createNewElement('button', {"class": "button button-primary", "id": "logout-button"}, "LOG OUT");
            logoutButtonDiv.appendChild(logoutButton);         
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('sedditToken');
                renderNavBar();
                renderNewsFeed(API_URL);
            })
            navbarList.appendChild(logoutButtonDiv);
        }
        // add event listener for search form
        let searchForm = document.getElementById("search-form")
        searchForm.onsubmit = (e) => {
            e.preventDefault()
            let query = document.getElementById('search').value;
            renderFilteredNewsFeed(query)
        }
    }
    // not logged in
    else {
        // remove logout button and my profile button if have to
        let logoutButtonDiv = document.getElementById('logout-button-div');
        if (logoutButtonDiv !== null) {
            logoutButtonDiv.removeChild(logoutButtonDiv.childNodes[0]);
            navbarList.removeChild(logoutButtonDiv);
        }
        let myProfileButtonDiv = document.getElementById("my-profile-button-div");
        if (myProfileButtonDiv !== null) {
            myProfileButtonDiv.removeChild(myProfileButtonDiv.childNodes[0]);
            navbarList.removeChild(myProfileButtonDiv);
        }
        // create log in and sign up button if needed to
        let loginButton = navbarList.querySelector(".button[data-id-login]");
        if (loginButton === null) {
            let loginButtonDiv = createLoginButtonDiv('login');
            navbarList.appendChild(loginButtonDiv)

        }
        let signupButton = navbarList.querySelector(".button[data-id-signup]");
        if (signupButton === null) {
            let signupButtonDiv = createLoginButtonDiv("signup");
            navbarList.appendChild(signupButtonDiv)
        }
    }
    return navbar;
}
// create log in or signup button
function createLoginButtonDiv(type) {
    let loginButtonDiv = createNewElement('div', {"class": "nav-item"});
    let loginButton;
    if (type === 'login') {
        loginButton = createNewElement('button', {"class":"button button-primary", "data-id-login": ""}, "LOGIN");
        loginButton.addEventListener('click', () => renderLoginPage(API_URL));
    } else if (type === 'signup') {
        loginButton = createNewElement('button', {"class":"button button-secondary", "data-id-signup": ""}, "SIGN UP");
        loginButton.addEventListener('click', () => renderSignupPage(API_URL));
    }
    loginButtonDiv.appendChild(loginButton);
    return loginButtonDiv;
}