import {createNewElement, addChildrenToElement} from './utils.js'

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
    let post = createNewElement('li', {"data-id-post": "", "class": "post"});
    let content = createNewElement('div', {"class": "content"});
    // content of each post
    let voteDiv = createVotingDiv(postInfo.meta.upvotes.length);
    let header = createNewElement('h4', {"data-id-title": "", "class": "post-title alt-text"}, postInfo.title);
    let textContent = createNewElement('p', {"class": "post-text alt-text"}, postInfo.text);
    let author = createNewElement('p', {"data-id-author": "", "class": "post-author"}, `Posted by @${postInfo.meta.author}`);
    // add content to content div
    addChildrenToElement(content, header, textContent, author);
    post.appendChild(voteDiv);
    post.appendChild(content);
    return post;
}

function createVotingDiv(numVotes) {
    let voteDiv = createNewElement('div', {"class": "vote", "data-id-upvotes": ""});
    let upvoteButton = createNewElement('i', {"class": "fas fa-angle-up vote-button"});
    let downvoteButton = createNewElement('i', {"class": "fas fa-angle-down vote-button"});
    let voteCount = createNewElement('p', {"class": "vote-count"}, numVotes);

    addChildrenToElement(voteDiv, upvoteButton, voteCount, downvoteButton);
    return voteDiv;
}