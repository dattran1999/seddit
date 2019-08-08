import createModal from "./baseModal.js";
import { createInput, createNewElement, addChildrenToElement } from '../utils.js'
import API_URL from '../backend_url.js'
export default function createPostModal() {
    let modalDiv = createModal('post');
    let modalConentDiv = modalDiv.getElementsByClassName("modal-content")[0];
    let form = createPostForm();
    modalConentDiv.appendChild(form);
    return modalDiv;
}
function createPostForm() {
    let form = createNewElement('form', {"class": "post-form"})

    let titlePrompt = createNewElement('b', {}, "Title");
    let textPrompt = createNewElement('b', {}, "Text");
    let imagePrompt = createNewElement('b', {}, "Image");
    let subsedditPrompt = createNewElement('b', {}, "Subseddit");

    let titleInput = createInput("text", "title", "Enter Title");
    let textInput = createNewElement("textarea", {"rows": "4", "cols": "20", "placeholder": "Enter Text"})
    // TODO: upload image
    let imageInput = createInput("file", "image", "Enter Image");
    imageInput.id = "image-input";
    let subsedditInput = createInput("text", "subseddit", "Enter Subseddit");

    let submitButton = createNewElement('button', {'value': 'Submit', "class": 'button button-secondary'}, 'POST')

    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        // convert image to base64
        let image = document.getElementById('image-input')
        let reader = new FileReader();
        reader.readAsDataURL(image.files[0]);
        // after reader finished converting to base64
        reader.onloadend = () => {
            let imageBase64 = reader.result;
            console.log(imageBase64)
            // remove the data type e.g. data:image/jpeg;base64,
            imageBase64 = imageBase64.replace(/^data.*base64,/, '')
            console.log(imageBase64)
            const data = {
                "title": `${titleInput.value}`,
                "text": `${textInput.value}`,
                "image": `${imageBase64}`,
                "subseddit": `${subsedditInput.value}`,
            }
            uploadPost(data);
        }
    })
    addChildrenToElement(form, titlePrompt, titleInput, textPrompt, textInput, imagePrompt, imageInput, subsedditPrompt, subsedditInput, submitButton)
    return form;
}

async function uploadPost(data) {
    const fetchOption = {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        },
    }
    try {
        const res = await fetch(`${API_URL}/post`, fetchOption);
        const json = await res.json();
        if (res.status !== 200) throw Error(json.message);
        console.log(json)
    } catch(errorMsg) {
        // TODO: show error message
    }
}