import {createNewElement} from './utils.js'
import createPostList from './components/postList.js'
import API_URL from './backend_url.js'

export default async function renderFilteredNewsFeed(query) {
    window.onscroll = undefined;
    const fetchOption = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Token: ${localStorage.getItem('sedditToken')}`
        }
    }
    // compile regex with the query
    const queryRegex = new RegExp(query)
    // posts is a list of posts containing the query
    const posts = await getPosts(queryRegex, fetchOption)
    const postList = await createPostList(posts, true)
    let mainContent = document.getElementsByTagName('main')[0]
    // clear out page
    while(mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild)
    }
    mainContent.appendChild(postList)
    

    // mainContent.appendChild(postList);
    
}

// recursive function to get all the posts of an user
async function getPosts(queryRegex, fetchOption, startPostNum) {
    let fetchUrl = `${API_URL}/user/feed`
    // if the start post we want to fetch is declared
    if (startPostNum !== undefined && startPostNum !== null) {
        fetchUrl = `${API_URL}/user/feed?p=${startPostNum}`
    }
    let allPosts = [];
    // otherwise, fetch 10 posts (default of GET /user/feed)
    try {
        const res = await fetch(fetchUrl, fetchOption);
        const json = await res.json();
        if (res.status !== 200) throw Error(res.status)

        // get posts the json resp have posts in it
        if (json.posts.length > 0) {
            // filter the posts with title or text matching the query
            const postsMatchingQuery = json.posts.filter(post => queryRegex.test(post.title) || queryRegex.test(post.text))
            allPosts.push(...postsMatchingQuery)
            if (startPostNum === undefined) {
                startPostNum = 0
            }
            startPostNum += json.posts.length
            const remainingPosts = await getPosts(queryRegex, fetchOption, startPostNum)
            allPosts.push(...remainingPosts)
        } else {
            // if we don't have more posts
            return [];
        }
        return allPosts;
    } 
    catch (error) {
        console.log("error catched", error);
    }
}

