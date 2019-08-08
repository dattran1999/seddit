import {createNewElement, addChildrenToElement} from './utils.js';
import API_URL from './backend_url.js';
import createPostList from './components/postList.js'

// TODO: button to render this page
export default async function renderProfilePage() {
    const fetchOption = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    try {
        const res = await fetch(`${API_URL}/user`, fetchOption);
        const json = await res.json();
        if (res.status !== 200) {
            throw Error(json.message)
        }
        // clear out page
        let mainContent = document.getElementsByTagName('main')[0];
        mainContent.innerText = "";
        // add elements to page
        let profileDiv = createNewElement('div', {"class": "profile"});
        let username = createNewElement('h1', {"class": "username"}, json.username);
        let numPost = createNewElement('p', {}, json.posts.length);
        let numFollowing = createNewElement('p', {}, json.following.length);
        let numFollowed = createNewElement('p', {}, json.followed_num);
        // TODO: maybe add the posts of user (use the function createPost in postList.js)
        // let posts = await createPosts(json.posts);
        addChildrenToElement(profileDiv, username, numPost, numFollowed, numFollowing);
        // TODO: css
        mainContent.appendChild(profileDiv);
    } catch(error) {
        // TODO: show error message
        console.log("error catched", error)
    }
}

// async function createPost(postIds) {
//     // create json of posts and pass in the json (similar to feed format)
//     let json = {"posts": []};
//     postIds.forEach(postId => {
//         const res = await fetch(``)
//     });
// }