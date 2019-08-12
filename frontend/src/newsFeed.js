import {createNewElement} from './utils.js'
import createPostList from './components/postList.js'

// global var tracking which post are we up to
let numPost = 0;

// postNum for the function is which post to start at for user feed
export default async function renderNewsFeed(apiUrl, token, postNum) {
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
        if (postNum !== undefined && postNum !== null) {
            fetchUrl = `${apiUrl}/user/feed?p=${postNum}`
        }
    }
    try {
        const res = await fetch(fetchUrl, option);
        const json = await res.json();
        console.log(json)
        if (res.status !== 200) throw Error(res.status)
        let postList = createNewElement('p', {"class": "flex-center"}, "Your feed is empty");
        // get posts the json resp have posts in it
        if (json.posts.length > 0) {
            if (postNum === undefined || postNum === null) {
                postList = await createPostList(json.posts, true);
            } else {
                postList = await createPostList(json.posts, false);
            }
        }
        let mainContent = document.getElementsByTagName('main')[0];
        // only clear out page if we start calling the function the first time
        if (postNum === undefined || postNum === null) {
            while(mainContent.firstChild) {
                mainContent.removeChild(mainContent.firstChild)
            }        
        }
        mainContent.appendChild(postList);
        // from https://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
        window.onscroll = () =>  {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight && json.posts.length > 0) {
                console.log("numpost", json.posts.length)
                numPost += json.posts.length;
                console.log("Bottom of page", numPost);
                renderNewsFeed(apiUrl, token, numPost);
            }
        };
        return true;
    } 
    catch (error) {
        console.log("error catched", error);
        renderNewsFeed(apiUrl)
    }
    // fetch(fetchUrl, option)
    //     .then(res => {
    //         if (res.status !== 200) {
    //             console.log("error", res.status)
    //         }
    //         return res.json();
    //     })
    //     .then(res => {
    //         let postList = createNewElement('p', {}, "Your feed is empty");
    //         if (res.posts.length > 0) {
    //             postList = await createPostList(res.posts);
    //         }
    //         console.log(postList)
    //         let mainContent = document.getElementsByTagName('main')[0];
    //         mainContent.innerText = "";
    //         mainContent.appendChild(postList);
    //     })
    //     // if error in fetching post, get public posts
    //     .catch((error) => {
    //         console.log("error catched", error)
    //         renderNewsFeed(apiUrl)
    //     }
    //     )
}
