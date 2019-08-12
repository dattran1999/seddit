import createModal from "./baseModal.js";
import { createInput, createNewElement, addChildrenToElement } from '../utils.js'
import API_URL from '../backend_url.js'

// if id is null, this modal is for posting new post
// if id is not null, this modal is for updating post
export default function createPostModal(id, title, text, subseddit) {
    let modalDiv = createModal('post');
    let modalConentDiv = modalDiv.getElementsByClassName("modal-content")[0];
    let form = createPostForm(id, title, text, subseddit);
    modalConentDiv.appendChild(form);
    return modalDiv;
}

function createPostForm(id, title, text, subseddit) {
    let form = createNewElement('form', {"class": "post-form"})

    let titlePrompt = createNewElement('b', {}, "Title");
    let textPrompt = createNewElement('b', {}, "Text");
    let imagePrompt = createNewElement('b', {}, "Image");
    let subsedditPrompt = createNewElement('b', {}, "Subseddit");

    let titleInput = createInput("text", "title", "Enter Title");
    if (title !== undefined) titleInput.value = title;
    let textInput = createNewElement("textarea", {"rows": "4", "cols": "20", "placeholder": "Enter Text"})
    if (text !== undefined) textInput.value = text;
    // TODO: upload image
    let imageInput = createInput("file", "image", "Enter Image");
    imageInput.id = "image-input";
    let subsedditInput = createInput("text", "subseddit", "Enter Subseddit");
    if (subseddit !== undefined) subsedditInput.value = subseddit;

    let submitButton = createNewElement('button', {'value': 'Submit', "class": 'button button-secondary'}, 'POST')

    submitButton.addEventListener('click', async (e) => {
        e.preventDefault();
        // convert image to base64
        let image = document.getElementById('image-input')
        console.log("image file: ",image.files[0])
        let data;
        
        data = {
            "title": `${titleInput.value}`,
            "text": `${textInput.value}`,
            "subseddit": `${subsedditInput.value}`,
        }
        // if image is supplied 
        if (image.files[0] !== undefined) {
            data.image = await convertToBase64(image.files[0]);
        }
        console.log("data before passing in function:", data)
        const status = await uploadPost(data, id);
        if (status) {
            let successMsg = createNewElement('p', {"class": "success-message"}, "Posted!");
            form.insertBefore(successMsg, submitButton)
        } else {
            let errorMsg = document.getElementsByClassName("error-message")[0];
            if (errorMsg === undefined) {
                errorMsg = createNewElement('p', {"class": 'error-message'}, "Error: Please check your input")
                form.insertBefore(errorMsg, submitButton);
            }
        }
    })
    addChildrenToElement(form, titlePrompt, titleInput, textPrompt, textInput, imagePrompt, imageInput, subsedditPrompt, subsedditInput, submitButton)
    return form;
}

async function uploadPost(data, id) {
    let fetchOption = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        },
    }
    console.log(fetchOption.body)
    let fetchUrl = `${API_URL}/post`;
    if (id !== undefined) {
        fetchOption.method = "PUT";
        fetchUrl = `${API_URL}/post/?id=${id}`
    }
    try {
        const res = await fetch(fetchUrl, fetchOption);
        const json = await res.json();
        if (res.status !== 200) throw Error(json.message);
        console.log(json)
        return true;
    } catch(error) {
        // TODO: show error message
        console.log(error)
        return false;
    }
}
function convertToBase64(image) {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.readAsDataURL(image);
        // after reader finished converting to base64
        reader.onloadend = async () => {
            let imageBase64 = await reader.result;
            console.log("base 64", imageBase64)
            // remove the data type e.g. data:image/jpeg;base64,
            imageBase64 = imageBase64.replace(/^data.*base64,/, '')
            resolve(imageBase64);
        }
    })
}