let inputField = document.getElementById('form_input');
const itemsList = document.getElementById('task_list');
const addButton = $('#add_button');


const elementSelector = "tasks__item";

const enterKey = 'Enter';
const event = 'keyup';

const defaultStatusForTask = 'undone';
const doneStatusForTasks = 'done';

const tagTypeForItems = 'li';

const itemListArray = Array();

function addKeyupEvenListenerForInput(key, eventName) {
    inputField.addEventListener(eventName, (e) => {
        e.preventDefault();

        //keCode is deprecated, use instead the value for entered key
        if (e.key.toString() === key) {
            addButton.click();
        }
    })
}

function getFormInputValue(inputField) {
    return inputField.value;
}

function clearInputField(inputField) {
    inputField.value = "";
}

function createObjectFromNewValue(inputedValue) {
    return {
        inputedContent: inputedValue,
        statusOfProgress: defaultStatusForTask,
    }
}

function addElement(array, inputField) {
    let inputedValue = getFormInputValue(inputField);
    if (inputedValue !== '') {
        let newElement = createObjectFromNewValue(inputedValue);
        array.push(newElement);
    }
}

function createHtmlElementFromArrayElement(arrayElementInputedContent, tag, selector) {
    return `<${tag} class="${selector}">${arrayElementInputedContent}`+'<'+"/"+`${tag}>`;
}

function createItemsTagsGroupFromArray(array, tag, selector) {
    let itemsTagged = "";
    for (let i = 0; i < array.length; i++) {
        itemsTagged += createHtmlElementFromArrayElement(array[i].inputedContent, tag, selector);;
    }
    return itemsTagged;
}

function withdrawElements(itemList, itemListArray) {
    const elementTaggedList = createItemsTagsGroupFromArray(itemListArray, tagTypeForItems, elementSelector);
    alert(elementTaggedList);
    itemList.innerHTML = elementTaggedList;
}

$(document).ready(() => {
    addKeyupEvenListenerForInput(enterKey, event);

    addButton.click(() => {
        addElement(itemListArray, inputField);

        clearInputField(inputField);

        withdrawElements(itemsList, itemListArray);
    });
});