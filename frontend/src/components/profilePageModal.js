import {createNewElement, addChildrenToElement} from '../utils.js';
import API_URL from '../backend_url.js';
import createModal from "./baseModal.js"
// import createPostList from './components/postList.js'

export default async function createProfilePageModal(username) {
    console.log(username)
    const name = username;
    let modalDiv = createModal('profile', username);
    let modalConentDiv = modalDiv.getElementsByClassName("modal-content")[0];

    const fetchOption = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    try {
        const res = await fetch(`${API_URL}/user/?username=${name}`, fetchOption);
        const json = await res.json();
        if (res.status !== 200) {
            throw Error(json.message)
        }        
        // add elements to page
        let contentDiv = createNewElement('div', {"class": "profile-content"})
        let profileDiv = createNewElement('div', {"class": "profile"});
        let username = createNewElement('h1', {"class": "username"}, json.username);
       
        profileDiv.appendChild(username);
        
        let metaDiv = createNewElement('div', {"class": "user-meta"});
        let numPost = createNewElement('p', {}, `${json.posts.length} posts `);
        let numFollowing = createNewElement('p', {}, `${json.following.length} following`);
        let numFollowed = createNewElement('p', {}, `${json.followed_num} follwers`);
        addChildrenToElement(metaDiv, numPost, numFollowed, numFollowing);
        // TODO: maybe add the posts of user (use the function createPost in postList.js)
        // let posts = await createPosts(json.posts);
        
        // track if user has follow the person or not first
        const isFollowing = await isUserFollowing(json.id, fetchOption);
        // create unfollowing or following button based on that
        // refresh modal if click the button
        let followButton;
        if (isFollowing) {
            // this follow button is for unfollowing...
            followButton = createNewElement('button', {"class": "button button-primary"}, "Unfollow");
            followButton.addEventListener("click", () => {
                followUser(name, 'unfollow');
                createProfilePageModal(name)
            });
        } else {
            followButton = createNewElement('button', {"class": "button button-primary"}, "Follow");
            followButton.addEventListener("click", () => {
                followUser(name, 'follow');
                createProfilePageModal(name)
            });
        }
        addChildrenToElement(contentDiv, profileDiv, metaDiv, followButton);
        modalConentDiv.appendChild(contentDiv);
    } catch(error) {
        // TODO: show error message
        console.log("error catched", error)
        let errorMsg = createNewElement('p', {"class": "error-message"}, "You need to log in to view this user")
        modalConentDiv.appendChild(errorMsg);
    }
    return modalDiv;

}

// async function createPost(postIds) {
//     // create json of posts and pass in the json (similar to feed format)
//     let json = {"posts": []};
//     postIds.forEach(postId => {
//         const res = await fetch(``)
//     });
// }
async function isUserFollowing(userId, fetchOption) {
    // get following list of current user
    try {
        const res = await fetch(`${API_URL}/user/`, fetchOption);
        const json = await res.json();
        if (res.status !== 200) throw Error(json.message)
        return json.following.includes(userId)

    } catch (error) {
        console.log("error catched", error)
    }
}
async function followUser(username, action) {
    console.log(`${action} ${username}`)
    const fetchOption = {
        method: "PUT",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    try {
        const res = await fetch(`${API_URL}/user/${action}/?username=${username}`, fetchOption);
        const json = await res.json();
        if (res.status !== 200) throw Error(json.message)
        console.log(json.message)
    } catch (error) {
        console.log("error catched", error)
    }
}
