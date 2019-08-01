import API_URL from "../backend_url.js";
import {createNewElement} from '../utils.js';

// create modal showing people who liked the post
export default function createLikeModal(postId) {
    let modalDiv = createNewElement('div', {"class": "modal", "data-modal-id": postId});
    let closeButton = createNewElement('button', {"class": "button-secondary"}, "Close");
    modalDiv.appendChild(closeButton);
    closeButton.addEventListener('click', () => {
        modalDiv.style.display = 'none';
        let root = document.getElementById('root');
        root.classList.remove('blur')
    })
    const fetchOption = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    console.log(fetchOption);
    
    fetch(`${API_URL}/post?id=${postId}`, fetchOption)
        .then(res => res.json())
        .then(res => {
            let upvoteList = Array.from(res.meta.upvotes)
            modalDiv.appendChild(usersUpvoted(upvoteList))
        })
    return modalDiv;
}

function usersUpvoted(userIds) {
    let userList = document.createElement('ul');
    userIds.forEach(id => {
        let user = document.createElement('li');
        const fetchOption = {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Token ${localStorage.getItem('sedditToken')}`
            }
        }
        fetch(`${API_URL}/user?id=${id}`, fetchOption)
            .then(res => res.json())
            .then(res => {
                user.innerText = res.username;
                userList.appendChild(user);
                console.log(res.username)
            })
    });
    return userList;
}