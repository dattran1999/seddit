import {createNewElement, addChildrenToElement} from './utils.js';
import API_URL from './backend_url.js';
import renderEditProfilePage from "./editProfilePage.js"
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
        while(mainContent.firstChild) {
            mainContent.removeChild(mainContent.firstChild)
        }
        // add elements to page
        let contentDiv = createNewElement('div', {"class": "profile-content"})
        let profileDiv = createNewElement('div', {"class": "profile"});
        let username = createNewElement('h1', {"class": "username"}, json.username);
        // from awesome fonts
        let editProfileButton = createNewElement('i', {"class": "fas fa-pen", "id": "edit-profile-button"});
        // redirect to modify user info page if click
        editProfileButton.addEventListener("click", () => {
            renderEditProfilePage()
        })
        addChildrenToElement(profileDiv, username, editProfileButton);

        let numPost = createNewElement('p', {}, `${json.posts.length} posts `);
        let numFollowing = createNewElement('p', {}, `${json.following.length} following`);
        let numFollowed = createNewElement('p', {}, `${json.followed_num} follwers`);

        // TODO: maybe add the posts of user (use the function createPost in postList.js)
        // let posts = await createPosts(json.posts);
        addChildrenToElement(contentDiv, profileDiv, numPost, numFollowed, numFollowing);
        mainContent.appendChild(contentDiv);
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