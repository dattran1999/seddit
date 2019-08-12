import {createNewElement, addChildrenToElement} from './utils.js';
import API_URL from './backend_url.js';
import renderEditProfilePage from "./editProfilePage.js"
import createPostList from './components/postList.js'
import createProfilePageModal from './components/profilePageModal.js';
import createPostModal from './components/postModal.js';

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
        if (res.status !== 200) {
            throw Error(json.message)
        }
        // clear out page
        let mainContent = document.getElementsByTagName('main')[0];
        while(mainContent.firstChild) {
            mainContent.removeChild(mainContent.firstChild)
        }

        // div: showing username and edit profile button
        let profileDiv = createNewElement('div', {"class": "profile-content"})
        let usernameDiv = createNewElement('div', {"class": "profile"});
        let username = createNewElement('h1', {"class": "username"}, json.username);
        // from awesome fonts
        let editProfileButton = createNewElement('i', {"class": "fas fa-pen clickable", "id": "edit-profile-button"});
        // redirect to modify user info page if click
        editProfileButton.addEventListener("click", () => {
            renderEditProfilePage()
        })
        addChildrenToElement(usernameDiv, username, editProfileButton);

        // div: showing user info in followers and following
        let metaDiv = createNewElement('div', {"class": "user-meta"});        
        let numPost = createNewElement('p', {}, `${json.posts.length} posts `);
        let numFollowing = createNewElement('p', {"class": "clickable"}, `${json.following.length} following`);
        let numFollowed = createNewElement('p', {}, `${json.followed_num} follwers`);
        addChildrenToElement(metaDiv, numPost, numFollowed, numFollowing);

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

        // div: posts of user 
        let postDiv = createNewElement('div', {})
        let postHeader = createNewElement('h3', {"class": "feed-title flex-center"}, "My Posts");
        let posts = await createPosts(json.posts);
        addChildrenToElement(postDiv, postHeader, posts)
        
        addChildrenToElement(profileDiv, usernameDiv, metaDiv, followingDiv, postDiv);
        mainContent.appendChild(profileDiv);
    } catch(error) {
        // TODO: show error message
        console.log("error catched", error)
    }
}

async function createPosts(postIds) {
    const fetchOption = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    // maping the post ids to the post jsons (GET /post)
    let postList = await Promise.all(postIds.map(async postId => {
        try {
            const res = await fetch(`${API_URL}/post?id=${postId}`, fetchOption);
            const jsonResponse = await res.json();
            if (res.status !== 200) throw Error(jsonResponse.message);
            return jsonResponse;
        }
        catch (error){
            console.log(error);
            return null;
        }
    }));
    // creating ul element containing all posts of the user
    let postListElement = await createPostList(postList);
    // add edit button and remove button for each post
    Array.from(postListElement.children).forEach(post => {
        const postId = post.getAttribute('data-id-post');
        // console.log(postId)
        let contentDiv = post.getElementsByClassName('content')[0];
        let actionDiv = createNewElement('div', {"class": "flex-right"})
        let deleteButton = createNewElement('i', {"class": "fa fa-trash clickable action"})
        let editButton = createNewElement('i', {"class": "fas fa-pen clickable action"})
        
        deleteButton.addEventListener('click', async () => {
            // delete in backend
            await deletePost(postId);
            // hide element in front end
            post.style.display = 'none';
        })
        editButton.addEventListener('click', () => {
            const title = contentDiv.getElementsByClassName('post-title')[0].innerText;
            const text = contentDiv.getElementsByClassName('post-text')[0].innerText;
            const subseddit = contentDiv.getElementsByClassName('post-author')[0].innerText.replace(/.*r\//, "");
            // blur background
            let root = document.getElementById('root');
            root.classList.add('blur');
            // create modal and append to body
            let modal = createPostModal(postId, title, text, subseddit);
            let body = document.getElementsByTagName('body')[0];
            body.setAttribute('style', 'overflow: hidden');        
            body.appendChild(modal);
            modal.style.display = 'block';
        })
        addChildrenToElement(actionDiv, editButton, deleteButton)
        contentDiv.appendChild(actionDiv)
    });

    return postListElement;
}

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

async function deletePost(postId) {
    const fetchOption = {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    try {
        const res = await fetch(`${API_URL}/post?id=${postId}`, fetchOption)
        const json = await res.json();
        if (res.status !== 200) throw Error(json.message);
    } catch (error) {
        console.log(error)
    }
}