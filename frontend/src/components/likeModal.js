import API_URL from "../backend_url.js";
import {createNewElement} from '../utils.js';
import createModal from "./baseModal.js";

// create modal showing people who liked the post
export default function createLikeModal(postId) {
    let modalDiv = createModal();
    modalDiv.setAttribute("data-like-modal-id", postId)
    const fetchOption = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    console.log(fetchOption);
    
    fetch(`${API_URL}/post?id=${postId}`, fetchOption)
        .then(res => {
            if (res.status === 200)
                return res.json()
            else {
                throw Error();
            }
        })
        .then(res => {
            console.log(res)
            let upvoteList = Array.from(res.meta.upvotes);
            modalDiv.appendChild(usersUpvoted(upvoteList));
        })
        .catch(() => {
            let errorMsg = createNewElement('p', {"class": "error-message"}, "You need to log in to view likes")
            modalDiv.appendChild(errorMsg)
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