export default function createVotingDiv(postId, numVotes) {
    let voteDiv = createNewElement('div', {"class": "vote", "data-id-upvotes": postId});
    // these buttons are from font awesome https://fontawesome.com
    let upvoteButton = createNewElement('i', {"class": "fas fa-angle-up vote-button"});
    if (state.userLiked[`${postId}`]) {
        upvoteButton.classList.add('liked');
    }
    let downvoteButton = createNewElement('i', {"class": "fas fa-angle-down vote-button"});
    let commentButton = createNewElement('i', {"class": "far fa-comment"});
    
    let voteCount = createNewElement('p', {"class": "vote-count", "data-id-upvotes": numVotes}, numVotes);

    voteCount.addEventListener('click', () => {
        // blur background
        let root = document.getElementById('root');
        root.classList.add('blur')
        
        let modal = createLikeModal(postId);
        let body = document.getElementsByTagName('body')[0]
        body.appendChild(modal);
        modal.style.display = 'block';
    });

    commentButton.addEventListener('click', () => {
        // blur background
        let root = document.getElementById('root');
        root.classList.add('blur')
        // create modal and append to body
        let modal = createCommentModal(postId);
        let body = document.getElementsByTagName('body')[0]
        body.appendChild(modal);
        modal.style.display = 'block';
    });

    upvoteButton.addEventListener('click', () => {
        postLike(postId, voteCount, upvoteButton)
    })

    addChildrenToElement(voteDiv, upvoteButton, voteCount, downvoteButton, commentButton);
    return voteDiv;
}

async function postLike(postId, voteCountElement, upvoteButton) {
    // if user havent liked the content before
    let fetchOption = {
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    if (!state.userLiked[`${postId}`]) {
        fetchOption.method = "PUT";
        voteCountElement.innerText = Number(voteCountElement.innerText) + 1;
        upvoteButton.classList.add('liked');
    } else {
        fetchOption.method = "DELETE";
        voteCountElement.innerText = Number(voteCountElement.innerText) - 1;
        upvoteButton.classList.remove('liked');
    }
    state.userLiked[`${postId}`] = !state.userLiked[`${postId}`];
    try {
        const response = await fetch(`${API_URL}/post/vote?id=${postId}`, fetchOption);
        if (response.status !== 200) {
            throw Error();
        }
    }
    catch (error) {
        // TODO: showing error message...
        console.log("error occured");
    }
}

function updateState(postInfo) {     
    if (postInfo.meta.upvotes.includes(state.id)) {
        state.userLiked[`${postInfo.id}`] = true;
    } else {
        state.userLiked[`${postInfo.id}`] = false;
    }
}