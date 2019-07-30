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
    element.innerText = innertext;
    return element;
}
// ------------------------------------