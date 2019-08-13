import {createNewElement, addChildrenToElement, getUserId} from '../utils.js'
import createLikeModal from "./likeModal.js"
import createCommentModal from "./commentModal.js"
import createPostModal from "./postModal.js"
import API_URL from '../backend_url.js'
import createProfilePageModal from './profilePageModal.js'
import renderProfilePage from '../profilePage.js';

class State {
    constructor() {
        // userLiked is an object showing if a user has liked a post
        // maping the postId to boolean
        this.userLiked = {}
        this.id = null;
    }
    async init() {
        this.id = await getUserId();
    }
}

let state = new State();

// TODO: maybe split this functions into files
export default async function createPostList(posts, showHeader) {
    // get id of current user and store in state
    await state.init();

    // ul element contains all posts + header
    let postList = createNewElement('ul', {"id": "feed", "data-id-feed": ""});
    // feed header div
    if (showHeader) {
        let feedHeaderDiv = createNewElement('div', {"class": "feed-header"});
        let feedTitle = createNewElement('h3', {'class': 'feed-title alt-text'}, "Popular posts");
        let postButton = createNewElement('button', {"class": "button button-secondary", "id": "post-button"}, "Post");
        if (posts.length > 0) {
            feedTitle.innerText = "Your Posts"
        }
        addChildrenToElement(feedHeaderDiv, feedTitle, postButton);
        postList.appendChild(feedHeaderDiv);

        postButton.addEventListener('click', () => {
            // blur background
            let root = document.getElementById('root');
            root.classList.add('blur');
            // create modal and append to body
            let modal = createPostModal();
            let body = document.getElementsByTagName('body')[0];
            body.setAttribute('style', 'overflow: hidden');        
            body.appendChild(modal);
            modal.style.display = 'block';
        })
    }

    // posts 
    posts.forEach(post => {
        // check if user has liked the post
        updateState(post);
        // create li element for each post
        let child = createPost(post);
        postList.appendChild(child);
    });
    return postList;
}

function createPost(postInfo) {
    let post = createNewElement('li', {"data-id-post": `${postInfo.id}`, "class": "post"});
    let content = createNewElement('div', {"class": "content"});
    // content of each post
    let voteDiv = createVotingDiv(postInfo.id, postInfo.meta.upvotes.length);
    let header = createNewElement('h4', {"data-id-title": `${postInfo.title}`, "class": "post-title alt-text"}, postInfo.title);
    let textContent = createNewElement('p', {"class": "post-text alt-text"}, postInfo.text);
    let author = createNewElement(
        'p', 
        {"data-id-author": `${postInfo.meta.author}`, "class": "post-author"}, 
        `Posted by @${postInfo.meta.author} in r/${postInfo.meta.subseddit}`
    );
    // show info of author when click
    author.addEventListener('click', async () => {
        // blur background
        let root = document.getElementById('root');
        root.classList.add('blur');
        // create modal and append to body
        let modal = await createProfilePageModal(postInfo.meta.author)
        let body = document.getElementsByTagName('body')[0];
        body.setAttribute('style', 'overflow: hidden');        
        body.appendChild(modal);
        modal.style.display = 'block';
    })
    let image = document.createElement('img');
    // only add image to the post if it has one
    if (postInfo.thumbnail !== null && postInfo.thumbnail !== '') {
        image = createNewElement('img', {"src": `data:image/jpeg;base64, ${postInfo.thumbnail}`});
    }
    // add content to content div
    addChildrenToElement(content, header, textContent, image, author);
    post.appendChild(voteDiv);
    post.appendChild(content);
    return post;
}

function createVotingDiv(postId, numVotes) {
    let voteDiv = createNewElement('div', {"class": "vote", "data-id-upvotes": postId});
    // these buttons are from font awesome https://fontawesome.com
    let upvoteButton = createNewElement('i', {"class": "fas fa-angle-up vote-button"});
    if (state.userLiked[`${postId}`]) {
        upvoteButton.classList.add('liked');
    }
    let downvoteButton = createNewElement('i', {"class": "fas fa-angle-down vote-button"});
    let commentButton = createNewElement('i', {"class": "far fa-comment"});
    
    let voteCount = createNewElement('p', {"class": "vote-count", "data-id-upvotes": numVotes}, numVotes);

    voteCount.addEventListener('click', () => {
        // blur background
        let root = document.getElementById('root');
        root.classList.add('blur');
        // create modal and append to body
        let modal = createLikeModal(postId);
        let body = document.getElementsByTagName('body')[0];
        body.setAttribute('style', 'overflow: hidden');        
        body.appendChild(modal);
        modal.style.display = 'block';
    });

    commentButton.addEventListener('click', async () => {
        // blur background
        let root = document.getElementById('root');
        root.classList.add('blur');
        // create modal and append to body
        let modal = await createCommentModal(postId);
        let body = document.getElementsByTagName('body')[0];
        body.setAttribute('style', 'overflow: hidden');        
        body.appendChild(modal);
        modal.style.display = 'block';
    });
    // user only able to upvote if their id is valid
    if (state.id !== null) {
        upvoteButton.addEventListener('click', () => {
            postLike(postId, voteCount, upvoteButton)
        })
    }

    addChildrenToElement(voteDiv, upvoteButton, voteCount, downvoteButton, commentButton);
    return voteDiv;
}

async function postLike(postId, voteCountElement, upvoteButton) {
    // if user havent liked the content before
    let fetchOption = {
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    if (!state.userLiked[`${postId}`]) {
        fetchOption.method = "PUT";
        voteCountElement.innerText = Number(voteCountElement.innerText) + 1;
        upvoteButton.classList.add('liked');
    } else {
        fetchOption.method = "DELETE";
        voteCountElement.innerText = Number(voteCountElement.innerText) - 1;
        upvoteButton.classList.remove('liked');
    }
    state.userLiked[`${postId}`] = !state.userLiked[`${postId}`];
    try {
        const response = await fetch(`${API_URL}/post/vote?id=${postId}`, fetchOption);
        if (response.status !== 200) {
            throw Error();
        }
        const json = await response.json();
    }
    catch (error) {
        // TODO: showing error message...
        console.log("error occured");
    }
}

function updateState(postInfo) {     
    if (postInfo.meta.upvotes.includes(state.id)) {
        state.userLiked[`${postInfo.id}`] = true;
    } else {
        state.userLiked[`${postInfo.id}`] = false;
    }
}