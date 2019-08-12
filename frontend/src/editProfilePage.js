import { createInput, createNewElement, addChildrenToElement } from "./utils.js";
import API_URL from "./backend_url.js"

export default async function renderEditProfilePage() {
    let mainContent = document.getElementsByTagName('main')[0];
    while(mainContent.firstChild) {
        mainContent.removeChild(mainContent.firstChild)
    }    
    let form = createNewElement('form', {"class": "post-form"})
    
    let emailInput = createInput("text", "email", "Enter new email");
    let nameInput = createInput("text", "name", "Enter new name"); 
    let passwordInput = createInput("password", "password", "Enter new Password");
    let submitButton = createNewElement('button', {'value': 'Submit', "class": 'button button-secondary'}, 'POST');
    addChildrenToElement(form, emailInput, nameInput, passwordInput, submitButton);
    submitButton.addEventListener('click', async (e)=> {
        e.preventDefault();
        let data = {};
        // only add attribute to body if it's not an empty string
        if (emailInput.value !== "") data.email = emailInput.value;
        if (nameInput.value !== "") data.name = nameInput.value;
        if (passwordInput.value !== "") data.password = passwordInput.value;        
        const fetchOption = {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                Authorization: `Token ${localStorage.getItem('sedditToken')}`
            },
        }
        console.log(fetchOption)
        try {
            const res = await fetch(`${API_URL}/user`, fetchOption);
            const json = await res.json();
            if (res.status !== 200) throw Error(json.message);
            console.log(json)
            // get success message. if none then create one
            let successMessages = document.getElementsByClassName("success-message");
            if (Array.from(successMessages).length === 0) {
                let successMsg = createNewElement('p', {"class": 'success-message'}, json.msg)
                form.insertBefore(successMsg, submitButton);
            }
        } catch(error) {
            console.log(error)
            const errorMessages = document.getElementsByClassName("error-message");
            if (Array.from(errorMessages).length === 0) {
                let errorMsg = createNewElement('p', {"class": 'error-message'}, error)
                form.insertBefore(errorMsg, submitButton);
            }
        }
    })
    mainContent.appendChild(form)
}