import createVotingDiv from "./votingDiv.js"

export default function createPost(postInfo) {
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