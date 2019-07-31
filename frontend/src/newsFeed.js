import {createNewElement, addChildrenToElement} from './utils.js'
import createLikeModal from "./components/likeModal.js"

export default function renderNewsFeed(apiUrl, token) {
    // fetch posts TODO: check if token is empty
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
    console.log(option)
    fetch(fetchUrl, option)
        .then(res => {
            if (res.status !== 200) {
                // TODO: error handling
                console.log("error", res.status)
            }
            return res.json();
        })
        .then(res => {
            console.log(res)
            let postList = createNewElement('p', {}, "Your feed is empty");
            if (res.posts.length > 0) {
                postList = createPostList(res.posts);
            }
            let mainContent = document.getElementsByTagName('main')[0];
            mainContent.innerText = "";
            mainContent.appendChild(postList);
        })
}

function createPostList(posts) {
    // ul element contains all posts
    let postList = createNewElement('ul', {"id": "feed", "data-id-feed": ""});
    posts.forEach(post => {
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
    // add content to content div
    addChildrenToElement(content, header, textContent, author);
    post.appendChild(voteDiv);
    post.appendChild(content);
    return post;
}

function createVotingDiv(postId, numVotes) {
    let voteDiv = createNewElement('div', {"class": "vote", "data-id-upvotes": numVotes});
    let upvoteButton = createNewElement('i', {"class": "fas fa-angle-up vote-button"});
    let downvoteButton = createNewElement('i', {"class": "fas fa-angle-down vote-button"});
    let voteCount = createNewElement('p', {"class": "vote-count", "data-id-upvotes": numVotes}, numVotes);

    voteCount.addEventListener('click', () => {
        // blur background
        let root = document.getElementById('root');
        root.classList.add('blur')
        
        let modal = document.querySelector(`[data-modal-id="${postId}"]`);
        if (modal === null) {
            // create modal if not yet created
            modal = createLikeModal(postId);
            let body = document.getElementsByTagName('body')[0]
            body.appendChild(modal);
        }
        // else display modal
        modal.style.display = 'block';
    });

    addChildrenToElement(voteDiv, upvoteButton, voteCount, downvoteButton);
    return voteDiv;
}