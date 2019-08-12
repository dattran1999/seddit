import {createNewElement} from '../utils.js';

// template to create modal
export default function createModal(type, postId) {
    // attempt to get the model if created and clear data inside
    let modalDiv;
    if (type === 'post') {
        modalDiv = document.querySelector(`.modal[data-post]`);
    } else if (type === 'comment') {
        modalDiv = document.querySelector(`.modal[data-comment-modal-id="${postId}"]`);
    } else if (type === 'like') {
        modalDiv = document.querySelector(`.modal[data-like-modal-id="${postId}"]`);
    } else if (type === 'profile') {
        modalDiv = document.querySelector(`.modal[data-profile-modal-id="${postId}"]`);
    }
    // if the modal is not yet created
    if (modalDiv === undefined || modalDiv === null) {
        modalDiv = createNewModal(type, postId)
    // otherwise...
    } else {
        let modalConentDiv = modalDiv.getElementsByClassName("modal-content")[0];
        // clear out content of the modal
        while (modalConentDiv.firstChild) {
            modalConentDiv.removeChild(modalConentDiv.firstChild);
        }
    }
    return modalDiv;
}

function createNewModal(type, postId) {
    let modalDiv = createNewElement('div', {"class": "modal"});
        if (type === 'like') {
            modalDiv.setAttribute("data-like-modal-id", postId);
        } else if (type === 'comment') {
            modalDiv.setAttribute("data-comment-modal-id", postId);
        } else if (type === 'post') {
            modalDiv.setAttribute("data-post", "")
        } else if (type === 'profile') {
            modalDiv.setAttribute("data-profile-modal-id", postId);
        }
        let closeButton = createNewElement('i', {"class": "fa fa-window-close"});
        modalDiv.appendChild(closeButton);
        let contentDiv = createNewElement('div', {"class": "modal-content"});
        modalDiv.appendChild(contentDiv)
        closeButton.addEventListener('click', () => {
            modalDiv.style.display = 'none';
            let root = document.getElementById('root');
            root.classList.remove('blur');
            let body = document.getElementsByTagName('body')[0];
            body.setAttribute('style', 'overflow: auto');
        });
    return modalDiv;
}