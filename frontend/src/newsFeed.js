import {createNewElement, addChildrenToElement, getUserId} from './utils.js'
import createLikeModal from "./components/likeModal.js"
import createCommentModal from "./components/commentModal.js"
import API_URL from './backend_url.js'

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
    updateState(postId) {
        this.userLiked.postId = !this.userLiked.postId
    }
}

let state = new State();

export default async function renderNewsFeed(apiUrl, token) {
    await state.init();
 
    // fetch posts
    let fetchUrl = `${apiUrl}/post/public`;
    let option = {
        method: "GET"
    }
    if (token !== undefined) {
        option.headers = {
            Accept: "application/json",
            Authorization: `Token: ${token}`
        }
        fetchUrl = `${apiUrl}/user/feed`
    }
    fetch(fetchUrl, option)
        .then(res => {
            if (res.status !== 200) {
                console.log("error", res.status)
            }
            return res.json();
        })
        .then(res => {
            let postList = createNewElement('p', {}, "Your feed is empty");
            if (res.posts.length > 0) {
                postList = createPostList(res.posts);
            }
            let mainContent = document.getElementsByTagName('main')[0];
            mainContent.innerText = "";
            mainContent.appendChild(postList);
        })
        // if error in fetching post, get public posts
        .catch(() => renderNewsFeed(apiUrl))
}
// TODO: maybe split this functions into files
function createPostList(posts) {
    // ul element contains all posts
    let postList = createNewElement('ul', {"id": "feed", "data-id-feed": ""});
    posts.forEach(post => {
        // check if user has liked the post
        updateState(post);
        // create li element for each post
        let child = createPost(post);
        postList.appendChild(child);
    });
    console.log(state);
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
    let image = document.createElement('img');
    if (postInfo.thumbnail !== null) {
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
        root.classList.add('blur')
        
        let modal = createLikeModal(postId);
        let body = document.getElementsByTagName('body')[0]
        body.appendChild(modal);
        modal.style.display = 'block';
    });

    commentButton.addEventListener('click', () => {
        // blur background
        let root = document.getElementById('root');
        root.classList.add('blur')
        // create modal and append to body
        let modal = createCommentModal(postId);
        let body = document.getElementsByTagName('body')[0]
        body.appendChild(modal);
        modal.style.display = 'block';
    });

    upvoteButton.addEventListener('click', () => {
        postLike(postId, voteCount, upvoteButton)
    })

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
        console.log("like");    
    } else {
        fetchOption.method = "DELETE";
        voteCountElement.innerText = Number(voteCountElement.innerText) - 1;
        upvoteButton.classList.remove('liked');
        console.log("delete");
    }
    state.userLiked[`${postId}`] = !state.userLiked[`${postId}`];
    try {
        const response = await fetch(`${API_URL}/post/vote?id=${postId}`, fetchOption);
        if (response.status !== 200) {
            throw Error();
        }
        const json = await response.json();
        console.log(json);
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