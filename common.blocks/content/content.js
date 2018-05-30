const inputField = document.getElementById('form_input');
const addButton = $('#add_button');

const elementSelector = "tasks__item";

// const enterKeyCode = 13;
// const event = 'keyup';
//
// function addKeyupEvenListenerForInput(keyCode, eventName) {
//     inputField.addEventListener(eventName, (e) => {
//         e.preventDefault();
//         if (keyCode === enterKeyCode) {
//             addButton.click();
//         }
//     })
// }

function getFormInputValue() {
    return inputField.value;
}

function addElement() {
    let newElement = document.createElement('li');
    newElement.className = elementSelector;
    let inputedValue = getFormInputValue();

    if (inputedValue !== '') {
        newElement.textContent = inputedValue;
        document.body.appendChild(newElement);
    }
}

$(document).ready(() => {

    addButton.click(() => {
        addElement();
    });
});