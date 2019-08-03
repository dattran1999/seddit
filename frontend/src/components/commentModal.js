import API_URL from "../backend_url.js";
import {createNewElement} from '../utils.js';

// create modal showing people who liked the post
export default function createCommentModal(postId) {
    let modalDiv = createNewElement('div', {"class": "modal", "data-comment-modal-id": postId});
    let closeButton = createNewElement('button', {"class": "button-secondary"}, "Close");
    modalDiv.appendChild(closeButton);
    closeButton.addEventListener('click', () => {
        modalDiv.style.display = 'none';
        let root = document.getElementById('root');
        root.classList.remove('blur');
        let body = document.getElementsByTagName('body')[0];
        body.setAttribute('style', 'overflow: auto');
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
        .then(res => {
            if (res.status === 200) return res.json();
            else throw Error();
        })
        .then(jsonRes => {
            let comments = Array.from(jsonRes.comments)
            modalDiv.appendChild(createComments(comments))
        })
        .catch(() => {
            let errorMsg = createNewElement('p', {"class": "error-message"}, "You need to log in to view likes")
            modalDiv.appendChild(errorMsg)
        })
    return modalDiv;
}

function createComments(comments) {
    let commentList = document.createElement('ul');
    comments.forEach(comment => {
        let commentDiv = document.createElement('li');
        let commentContent = createNewElement('p', {}, `${comment.comment}`);
        let author = createNewElement(
            'p',
            {"data-id-author": `${comment.author}`, "class": "post-author"}, 
            `${comment.author}`
        );
        commentDiv.appendChild(author);
        commentDiv.appendChild(commentContent);
        commentList.appendChild(commentDiv);
    });
    return commentList;
}