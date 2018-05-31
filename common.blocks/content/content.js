let inputField = document.getElementById('form_input');
const addButton = $('#add_button');
const itemsList = $('.tasks__list');

const elementSelector = "tasks__item";

const enterKey = 'Enter';
const event = 'keyup';

function addKeyupEvenListenerForInput(key, eventName) {
    inputField.addEventListener(eventName, (e) => {
        e.preventDefault();

        //keCode is deprecated, use instead the value for entered key
        if (e.key.toString() === key) {
            addButton.click();
        }
    })
}

function getFormInputValue() {
    return inputField.value;
}

function clearInputField() {
    inputField.value = "";
}

function addElement() {
    let newElement = document.createElement('li');
    newElement.className = elementSelector;
    let inputedValue = getFormInputValue();

    if (inputedValue !== '') {
        newElement.textContent = inputedValue;
        // Add new item before existing in the list
        itemsList.prepend(newElement);
    }
}

$(document).ready(() => {
    addKeyupEvenListenerForInput(enterKey, event);

    addButton.click(() => {
        addElement();
        clearInputField();
    });
});