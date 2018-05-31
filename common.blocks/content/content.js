const duplicateMessage = 'This task is already in the list!';

const selectAllStatusForSelectAllButton = 'Select all';
const deselectAllStatusForSelectAllButton = 'Deselect all';

let inputField = document.getElementById('form_input');
const itemsList = document.getElementById('task_list');

const addButton = $('#add_button');
const deleteAllButton = $('#delete_all_button');
const chooseAllButton = $('#choose_all_button');

const elementSelector = "tasks__item";
const defaultStatusClassName = 'tasks__item_default';
const doneStatusClassName = 'tasks__item_done';
const checkboxClassName = 'item_checkbox';

const enterKey = 'Enter';
const keyEvent = 'keyup';

const defaultStatusForTasks = 'undone';
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
        statusOfProgress: defaultStatusForTasks,
    }
}

function createHtmlElementFromArrayElement(arrayElement, tag, selector) {
    let partOfStringWithCheckbox = `<input type="checkbox" class="${checkboxClassName}">`;
    let taskStatusSelector = '';

    // if use once again better be as written here
    if (arrayElement.statusOfProgress === defaultStatusForTasks) {
        taskStatusSelector = defaultStatusClassName;
    } else {
        taskStatusSelector = doneStatusClassName;
    }

    const finalSelectorForTag = selector + ' ' + taskStatusSelector;

    return `<${tag} class="${finalSelectorForTag}">`+ partOfStringWithCheckbox + `${arrayElement.inputedContent}` + '<' + "/" + `${tag}>`;
}

function createItemsTagsGroupFromArray(array, tag, selector) {
    let itemsTagged = "";
    for (let i = 0; i < array.length; i++) {
        itemsTagged += createHtmlElementFromArrayElement(array[i], tag, selector);;
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

function addElementToObjectsArray(array, inputField) {
    let inputedValue = getFormInputValue(inputField);
    if (inputedValue !== '') {
        if (!findItemInArrayWithSameContent(inputedValue, array)) {
            let newElement = createObjectFromNewValue(inputedValue);
            array.push(newElement);
        } else {
            alert(duplicateMessage);
        }
    }
}

function changeItemStateIfSelected(listItemArray, chosenItemNode, chosenStatus) {
    let objectEqualsToSelected = findItemInArrayWithSameContent(chosenItemNode.textContent, itemListArray);
    let indexOfFoundedObject = findItemInArrayWithIndex(itemListArray, objectEqualsToSelected);
    listItemArray[indexOfFoundedObject].statusOfProgress = chosenStatus;
    repaintCurrentNode(chosenItemNode, chosenStatus);
}

function oppositValueFor(selector, firstAlternative, secondAlternative) {
    if (selector === firstAlternative) {
        return secondAlternative;
    } else {
        return firstAlternative;
    }
}

function changeStatusForNode(currentNode, newStatus) {
    const newClassName = newStatus === defaultStatusForTasks ? defaultStatusClassName : doneStatusClassName;
    if (!(currentNode.classList.contains(newClassName))) {
        currentNode.classList.remove(oppositValueFor(newClassName));
        currentNode.classList.add(newClassName);
    } else {
        currentNode.classList.remove(newClassName);
        currentNode.classList.add(oppositValueFor(newClassName));
    }
}

function repaintCurrentNode(chosenItemNode, chosenStatus) {
    const repaintClassName = chosenStatus === defaultStatusForTasks ? defaultStatusClassName : doneStatusClassName;
    changeStatusForNode(chosenItemNode, repaintClassName);
}

function repaintAllNodes(elementSelector, clickedStatus) {
    const repaintClassName = clickedStatus === defaultStatusForTasks ? defaultStatusClassName : doneStatusClassName;

    let listElements = document.getElementsByClassName(elementSelector);
    for (let i = 0; i < listElements.size; i++) {
        changeStatusForNode(listElements[i], repaintClassName);
    }
}

function listenToItemsForClicking(listItemsArray, checkboxSelector) {
    const checkboxSelectorForJquery = '.' + checkboxSelector;
    $(checkboxSelectorForJquery).change(function() {
        let chosenItemNode = this.parentNode;
        let chosenStatus = '';
        if (this.checked) {
           chosenStatus = doneStatusForTasks;
        } else {
            chosenStatus = defaultStatusForTasks;
        }
        changeItemStateIfSelected(listItemsArray, chosenItemNode, chosenStatus);
    });
}

function deleteAllObjectsFromArray(listItemsArray) {
    listItemsArray.length = 0; //or = [] // Array()
}

function deleteChosenObject(chosenObject, listItemsArray) {
    const indexOfTheObject = findItemInArrayWithIndex(listItemsArray, chosenObject);
    listItemsArray[indexOfTheObject] = null;
    listItemsArray = _.compact(listItemsArray);

}

function getCurrentButtonValue(button) {
    return button.text();
}

function getStatusForAction(currentButtonValueString) {
    if (currentButtonValueString === selectAllStatusForSelectAllButton) {
        return doneStatusForTasks;
    } else {
        return defaultStatusForTasks;
    }
}

$(document).ready(() => {
    addKeyupEvenListenerForInput(enterKey, keyEvent);

    addButton.click(() => {
        addElementToObjectsArray(itemListArray, inputField);

        clearInputField(inputField);

        withdrawElements(itemsList, itemListArray);

        listenToItemsForClicking(itemListArray, checkboxClassName);

        //add event listener to delete buttons

    });

    deleteAllButton.click(() => {
        deleteAllObjectsFromArray(itemListArray);

        withdrawElements(itemsList, itemListArray);
    });

    chooseAllButton.click(() => {
        const currentButtonValue = getCurrentButtonValue(chooseAllButton);
        const itemStatus = getStatusForAction(currentButtonValue);
        repaintAllNodes()

    });

});