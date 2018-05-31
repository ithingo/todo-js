let inputField = document.getElementById('form_input');
const itemsList = document.getElementById('task_list');
const addButton = $('#add_button');

const elementSelector = "tasks__item";
// const defaultStatusClassName = 'tasks__item_default';
// const doneStatusClassName = 'tasks_item_done';
const checkboxClassName = 'item_checkbox';

const enterKey = 'Enter';
const keyEvent = 'keyup';

const defaultStatusForTask = 'undone';
const doneStatusForTasks = 'done';

const tagTypeForItems = 'li';

const itemListArray = Array();

function addKeyupEvenListenerForInput(key, eventNameForKey) {
    inputField.addEventListener(eventNameForKey, (e) => {
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
        //add check for same content
        let newElement = createObjectFromNewValue(inputedValue);
        array.push(newElement);
    }
}

function createHtmlElementFromArrayElement(arrayElementInputedContent, tag, selector) {
    let partOfStringWithCheckbox = `<input type="checkbox" class="${checkboxClassName}">`;
    return `<${tag} class="${selector}">`+ partOfStringWithCheckbox + `${arrayElementInputedContent}` + '<' + "/" + `${tag}>`;
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
    itemList.innerHTML = elementTaggedList;

}

function findItemInArrayWithSameContent(htmlItemContent, itemsListArray) {
    let foundedElement = _.findWhere(itemsListArray, {inputedContent: htmlItemContent});
    return foundedElement;
}

function findItemInArrayWithIndex(itemlistArray, chosenObject) {
    let indexOfFoundedObject = _.indexOf(itemlistArray, chosenObject);
    return indexOfFoundedObject;
}
//
// function isTaskDone(arrayElement) {
//     return arrayElement.statusOfProgress === doneStatusForTasks;
// }
//

// function addSelectorTo

function changeItemStateIfSelected(listItemArray, chosenItemNode, chosenStatus) {
    let objectEqualsToSelected = findItemInArrayWithSameContent(chosenItemNode.textContent, itemListArray);
    let indexOfFoundedObject = findItemInArrayWithIndex(itemListArray, objectEqualsToSelected);
    alert(indexOfFoundedObject);
    // objectEqualsToSelected.statusOfProgress = chosenStatus;
}

function listenToItemsForClicking(listItemArray, checkboxSelector) {
    const checkboxSelectorForJquery = '.' + checkboxSelector;
    $(checkboxSelectorForJquery).change(function() {
        let chosenItemNode = this.parentNode;
        let chosenStatus = '';
        if (this.checked) {
           chosenStatus = doneStatusForTasks;
        } else {
            chosenStatus = defaultStatusForTask;
        }
        changeItemStateIfSelected(listItemArray, chosenItemNode, chosenStatus);
    });
}


$(document).ready(() => {
    addKeyupEvenListenerForInput(enterKey, keyEvent);

    addButton.click(() => {
        addElement(itemListArray, inputField);

        clearInputField(inputField);

        withdrawElements(itemsList, itemListArray);

        listenToItemsForClicking(itemListArray, checkboxClassName);
    });

});