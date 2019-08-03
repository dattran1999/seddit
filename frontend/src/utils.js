import API_URL from "./backend_url.js";

// helper functions-----------------
// TODO: might rewrite this function... prototype of parent maybe???
export function addChildrenToElement(parent, ...children) {
    children.forEach(element => {
        parent.appendChild(element);
    });
}

export function createInput(type, name, placeholder) {
    let input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('name', name);
    input.setAttribute('placeholder', placeholder);
    return input;
}
// type: string, attr: obj, classes: array, innertext: string
// FIXME: maybe remove the class...
export function createNewElement(type, attributes, innertext) {
    let element = document.createElement(type);
    for (const key of Object.keys(attributes)) {
        element.setAttribute(key, attributes[key])
    }
    if (innertext === undefined) 
        innertext = "";
    element.innerText = innertext;
    return element;
}
// get user id assuming user has logged in
export async function getUserId() { 
    console.log("function called");
    
    const fetchOption = {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: `Token ${localStorage.getItem('sedditToken')}`
        }
    }
    try {
        const res = await fetch(`${API_URL}/user/`, fetchOption);
        if (res.status !== 200) {
            throw Error();
        }
        const json = await res.json();
        return json.id;
    } 
    // error has occurred
    catch {
        console.log("error in finding id");
        return null;
    }
}
// ------------------------------------