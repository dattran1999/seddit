/**
 * Written by A. Hinds with Z. Afzal 2018 for UNSW CSE.
 * 
 * Updated 2019.
 */

// import your own scripts here.
import renderLoginPage from './loginPage.js'
import renderSignupPage from './signupPage.js'
import {addChildrenToElement} from './utils.js'
// your app must take an apiUrl as an argument --
// this will allow us to verify your apps behaviour with 
// different datasets.
function initApp(apiUrl) {
    // your app initialisation goes here
    addVotingIcons();
    const logo = document.getElementById('logo');
    const loginButton = document.querySelector('button[data-id-login]');
    const signupButton = document.querySelector('button[data-id-signup]');
    // FIXME: hacky. TODO: remove all code with feed
    let feed = "";
    logo.addEventListener('click', (e) => {
        // FIXME: hacky 
        if (feed !== "") {
            let mainContent = document.getElementsByTagName('main')[0];
            mainContent.innerHTML = feed;
        }
    });
    loginButton.addEventListener('click', (e) => {
        feed = renderLoginPage();
    });
    signupButton.addEventListener('click', (e) => {
        feed = renderSignupPage();
    });

}


function addVotingIcons() {
    let postVote = document.getElementsByClassName('vote');
    let upvoteButton = document.createElement('i');
    upvoteButton.classList.add("fas", "fa-angle-up", "vote-button");
    let downvoteButton = document.createElement('i');
    downvoteButton.classList.add("fas", "fa-angle-down", "vote-button");
    let voteCount = document.createElement('p');
    voteCount.classList.add("vote-count");
    voteCount.innerText = "0";
    Array.from(postVote).forEach(element => {
        // TODO: maybe add an unique id for every post
        const upvoteButtonClone = upvoteButton.cloneNode(true);
        const voteCountClone = voteCount.cloneNode(true);
        const downvoteButtonClone = downvoteButton.cloneNode(true);
        addChildrenToElement(element, upvoteButtonClone, voteCountClone, downvoteButtonClone);
    });
}

export default initApp;
