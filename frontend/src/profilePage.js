import {createNewElement, addChildrenToElement} from './utils.js';
import API_URL from './backend_url.js';
import renderEditProfilePage from "./editProfilePage.js"
import createPostList from './components/postList.js'
import createProfilePageModal from './components/profilePageModal.js';

// TODO: button to render this page
export default async function renderProfilePage() {    
    window.onscroll = undefined;
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
        console.log(json)
        if (res.status !== 200) {
            throw Error(json.message)
        }
        // clear out page
        let mainContent = document.getElementsByTagName('main')[0];
        while(mainContent.firstChild) {
            mainContent.removeChild(mainContent.firstChild)
        }
        // add elements to page
        let profileDiv = createNewElement('div', {"class": "profile-content"})
        let usernameDiv = createNewElement('div', {"class": "profile"});
        let username = createNewElement('h1', {"class": "username"}, json.username);
        // from awesome fonts
        let editProfileButton = createNewElement('i', {"class": "fas fa-pen", "id": "edit-profile-button"});
        // redirect to modify user info page if click
        editProfileButton.addEventListener("click", () => {
            renderEditProfilePage()
        })
        addChildrenToElement(usernameDiv, username, editProfileButton);

        let metaDiv = createNewElement('div', {"class": "user-meta"});        
        let numPost = createNewElement('p', {}, `${json.posts.length} posts `);
        let numFollowing = createNewElement('p', {}, `${json.following.length} following`);
        let numFollowed = createNewElement('p', {}, `${json.followed_num} follwers`);
        addChildrenToElement(metaDiv, numPost, numFollowed, numFollowing);

        // TODO: maybe add the posts of user (use the function createPost in postList.js)
        // let posts = await createPosts(json.posts);
        let followingDiv = createNewElement('div', {"class": "toggle"});
        json.following.forEach(async userId => {
            const info = await userInfo(userId)
            // console.log(info)
            followingDiv.appendChild(info);
        });
        numFollowing.addEventListener('click', () => {
            if (followingDiv.classList.contains("toggle")) {
                followingDiv.classList.remove("toggle")
            } else {
                followingDiv.classList.add("toggle")
            }
        })
        addChildrenToElement(profileDiv, usernameDiv, metaDiv, followingDiv);
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

async function userInfo(id) {
    const fetchOption = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    try {
        const res = await fetch(`${API_URL}/user?id=${id}`, fetchOption)
        const json = await res.json();
        let username = createNewElement('p', {"class": "post-author"}, json.username);
        username.addEventListener('click', async () => {
            // blur background
            let root = document.getElementById('root');
            root.classList.add('blur');
            // create modal and append to body
            let modal = await createProfilePageModal(json.username);
            let body = document.getElementsByTagName('body')[0];
            body.setAttribute('style', 'overflow: hidden');        
            body.appendChild(modal);
            modal.style.display = 'block';
        })
        return username;
    } catch (error) {
        console.log(error)
    }
}