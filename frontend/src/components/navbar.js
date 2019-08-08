import { createNewElement } from "../utils.js";

export default function renderNavBar() {
    let navbar = document.getElementById('nav');
    let navbarList = navbar.getElementsByClassName('nav')[0];
    if (localStorage.getItem('sedditToken') !== null) {
        // create button for user profile page
        let myProfileListItem = createNewElement('li', {'class': 'nav-item'});
        let myProfileButton = createNewElement('button', {"class": "button button-primary"}, "My Profile");
        // TODO: add button to render profile page
        myProfileListItem.appendChild(myProfileButton);    
        navbarList.insertBefore(myProfileListItem, navbarList.childNodes[0]);
    }
    return navbar;
}