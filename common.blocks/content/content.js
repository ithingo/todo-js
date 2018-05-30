// import {addKeyupEvenListenerForInput, getFormInputValue} from "./form/form";

const addButton = document.getElementById('add_button');
const inputField = document.getElementById('form_input');
const tasksList = document.getElementsByClassName('tasks_list')[0];

const elementSelector = "tasks__item";

const enterKeyCode = 13;
const event = 'keyup';

// const itemTemplate = '<li class="tasks_item"></li>';

function addKeyupEvenListenerForInput(keyCode, eventName) {
    inputField.addEventListener(eventName, (e) => {
        e.preventDefault();
        if (keyCode === enterKeyCode) {
            addButton.click();
        }
    })
}

function getFormInputValue() {
    return inputField.value;
}

function addElement() {
    let newElement = document.createElement('li');
    newElement.setAttribute('class', elementSelector);
    newElement.innerHTML = getFormInputValue();

    tasksList.appendChild(newElement);
}

$(document).ready(() => {
    addButton.onclick = addElement()();

    addKeyupEvenListenerForInput(enterKeyCode, event); //?
})