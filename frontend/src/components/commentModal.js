import API_URL from "../backend_url.js";
import {createNewElement, addChildrenToElement} from '../utils.js';
import createModal from "./baseModal.js";

// create modal showing people who liked the post
export default async function createCommentModal(postId) {
    let modalDiv = createModal('comment', postId);
    let modalConentDiv = modalDiv.getElementsByClassName("modal-content")[0];
    const fetchOption = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    try {
        const res = await fetch(`${API_URL}/post?id=${postId}`, fetchOption);
        const json = await res.json();
        if (res.status !== 200) throw Error(json.message);
        let comments = Array.from(json.comments);
        modalConentDiv.appendChild(createCommentForm(postId));
        modalConentDiv.appendChild(createComments(comments));
    }
    catch (error){
        console.log(error)
        let errorMsg = createNewElement('p', {"class": "error-message"}, "You need to log in to view comments")
        modalConentDiv.appendChild(errorMsg);
    }
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

function createCommentForm(postId) {
    // comment input
    let commentForm = createNewElement('form', {"class": "post-form"});
    let commentInput = createNewElement("textarea", {"rows": "4", "cols": "20", "placeholder": "Enter Comment"});
    let submitButton = createNewElement('button', {'value': 'Submit', "class": 'button button-secondary'}, 'POST');

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const fetchOption = {
            method: "PUT",
            headers: {
                Accept: "application/json",
                Authorization: `Token ${localStorage.getItem('sedditToken')}`,
                "Content-Type": "application/json"
            },
            body: `{
                "comment": "${commentInput.value}"
            }`,
        }
        try {
            const res = await fetch(`${API_URL}/post/comment?id=${String(postId)}`, fetchOption);
            const json = await res.json();
            if (res.status !== 200) throw Error(json.message);
            createCommentModal(postId);
        } catch(error) {
            // TODO: show error msg
            let errorMsg = document.getElementsByClassName("error-message")[0];
            if (errorMsg === undefined) {
                errorMsg = createNewElement('p', {"class": 'error-message'}, "Error: Please Enter your comment")
                commentForm.insertBefore(errorMsg, submitButton);
            }
        }
    })
    addChildrenToElement(commentForm, commentInput, submitButton);
    return commentForm;
}