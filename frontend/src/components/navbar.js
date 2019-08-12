import { createNewElement, getUserId } from "../utils.js";
import renderProfilePage from '../profilePage.js';
import renderLoginPage from "../loginPage.js";
import API_URL from "../backend_url.js";
import renderNewsFeed from "../newsFeed.js";

export default async function renderNavBar() {    
    let navbar = document.getElementById('nav');
    let navbarList; 
    if (navbar !== null) {
        navbarList = navbar.getElementsByClassName('nav')[0];
    }
    else {
        return;
    }
    // TODO: create the whole nav bar from scratch
    // check if the token is valid by get the user id (GET /user)
    const userId = await getUserId();
    // if logged in
    if (userId !== null) {
        // see if my profile button is there
        let myProfileButton = document.getElementById("my-profile-button");
        // create my profile button 
        if (myProfileButton === null) {
            let myProfileListItem = createNewElement('li', {'class': 'nav-item', "id": "my-profile-button-div"});
            myProfileButton = createNewElement('button', {"class": "button button-primary", "id": "my-profile-button"}, "My Profile");
            myProfileButton.addEventListener('click', renderProfilePage);
            myProfileListItem.appendChild(myProfileButton);
            navbarList.insertBefore(myProfileListItem, navbarList.childNodes[0]);
            // Remove login button 
            const loginButton = navbarList.querySelector(".button[data-id-login]");
            const loginButtonDiv = loginButton.parentElement;
            loginButtonDiv.removeChild(loginButton);
            navbarList.removeChild(loginButtonDiv);
            // add logout button 
            let logoutButtonDiv = createNewElement('li', {'class': 'nav-item', "id": "logout-button-div"});
            let logoutButton = createNewElement('button', {"class": "button button-primary", "id": "logout-button"}, "LOG OUT");
            logoutButtonDiv.appendChild(logoutButton);         
            logoutButton.addEventListener('click', () => {
                localStorage.removeItem('sedditToken');
                renderNavBar();
                renderNewsFeed(API_URL);
            })
            navbarList.insertBefore(logoutButtonDiv, navbarList.childNodes[2]);
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
        // create log in button if needed to
        let loginButton = navbarList.querySelector(".button[data-id-login]");
        if (loginButton === null) {
            let loginButtonDiv = createLoginButtonDiv();
            navbarList.insertBefore(loginButtonDiv, navbarList.childNodes[2])
        }
    }
    return navbar;
}
function createLoginButtonDiv() {
    let loginButtonDiv = createNewElement('div', {"class": "nav-item"});
    let loginButton = createNewElement('button', {"class":"button button-primary", "data-id-login": ""}, "LOGIN");
    loginButton.addEventListener('click', () => renderLoginPage(API_URL));
    loginButtonDiv.appendChild(loginButton);
    return loginButtonDiv;
}