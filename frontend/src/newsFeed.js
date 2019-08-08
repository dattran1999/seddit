import {createNewElement} from './utils.js'
import createPostList from './components/postList.js'

export default async function renderNewsFeed(apiUrl, token) {
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
    }
    try {
        const res = await fetch(fetchUrl, option);
        const json = await res.json();
        console.log(json)
        if (res.status !== 200) throw Error(res.status)
        let postList = createNewElement('p', {}, "Your feed is empty");
        if (json.posts.length > 0) {
            postList = await createPostList(json.posts);
        }
        console.log(postList)
        let mainContent = document.getElementsByTagName('main')[0];
        mainContent.innerText = "";
        mainContent.appendChild(postList);
        // from https://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
        window.onscroll = () =>  {
            if ((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
              console.log("Bottom of page");
            }
        };
    } 
    catch (error) {
        console.log("error catched", error)
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
