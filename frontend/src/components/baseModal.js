import {createNewElement} from '../utils.js';

// template to create modal
export default function createModal() {
    let modalDiv = createNewElement('div', {"class": "modal"});
    let closeButton = createNewElement('button', {"class": "button-secondary"}, "Close");
    modalDiv.appendChild(closeButton);
    closeButton.addEventListener('click', () => {
        modalDiv.style.display = 'none';
        let root = document.getElementById('root');
        root.classList.remove('blur');
        let body = document.getElementsByTagName('body')[0];
        body.setAttribute('style', 'overflow: auto');
    });
    return modalDiv;
}