// helper functions-----------------

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
// ------------------------------------