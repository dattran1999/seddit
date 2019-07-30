import {createNewElement, addChildrenToElement} from './utils.js'

export default function renderNewsFeed(apiUrl, token) {
    // fetch posts TODO: check if token is empty
    const option = {
        method: "GET"
    }
    // TODO: create feed header
    fetch(`${apiUrl}/post/public`, option)
        .then(res => res.json())
        .then(res => {
            let postList = createPostList(res.posts);
            let mainContent = document.getElementsByTagName('main')[0];
            mainContent.innerText = "";
            mainContent.appendChild(postList);
        });
}

function createPostList(posts) {
    // ul element contains all posts
    let postList = createNewElement('ul', {"id": "feed", "data-id-feed": ""}, "");
    posts.forEach(post => {
        // create li element for each post
        let child = createPost(post);
        console.log(child);
        postList.appendChild(child);
    });
    return postList;
}

function createPost(postInfo) {
    let post = createNewElement('li', {"data-id-post": "", "class": "post"}, "");
    let content = createNewElement('div', {"class": "content"}, [], "");

    let postDiv = createVotingDiv(postInfo.meta.upvotes.length);
    let header = createNewElement('h4', {"data-id-title": "", "class": "post-title alt-text"}, postInfo.title);
    let textContent = createNewElement('p', {"class": "post-text alt-text"}, postInfo.text);
    let author = createNewElement('p', {"data-id-author": "", "class": "post-author"}, `Posted by @${postInfo.meta.author}`);
    // TODO: add voting icons
    addChildrenToElement(content, header, textContent, author);
    post.appendChild(postDiv);
    post.appendChild(content);
    return post;
}

function createVotingDiv(numVotes) {
    let postDiv = createNewElement('div', {"class": "vote", "data-id-upvotes": ""}, "");
    let upvoteButton = createNewElement('i', {"class": "fas fa-angle-up vote-button"}, "");
    let downvoteButton = createNewElement('i', {"class": "fas fa-angle-down vote-button"}, "");
    let voteCount = createNewElement('p', {"class": "vote-count"}, numVotes);

    addChildrenToElement(postDiv, upvoteButton, voteCount, downvoteButton);
    return postDiv;
}