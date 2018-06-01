const duplicateMessage = 'This task is already in the list!';
const unknownActionMessage = 'Unknown action!';

const selectAllStatusForSelectAllButton = 'Select all';
const deselectAllStatusForSelectAllButton = 'Deselect all';

let inputField = document.getElementById('form_input');
const itemsList = document.getElementById('task_list');

const addButton = $('#add_button');
const deleteAllButton = $('#delete_all_button');
const chooseAllButton = $('#choose_all_button');

const elementSelector = "tasks__item item";
const defaultStatusClassName = 'tasks__item_default';
const doneStatusClassName = 'tasks__item_done';
const labelForActionsClassName = 'item__label';
const wrapperForInnerTextClassName = 'item__textwrapper'
const checkboxClassName = 'item__checkbox';
const deleteItemButtonClassName = 'item__delete close';

const enterKey = 'Enter';
const keyEvent = 'keyup';

const defaultStatusForTasks = 'undone';
const doneStatusForTasks = 'done';
const toRemoveStatusForTask = 'remove';
const toKeepStatusForTask = 'keep';

const tagTypeForItems = 'li';

const buttonType = 'button';
const checkboxType = 'checkbox';

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
        removeStatus: toKeepStatusForTask,
    }
}

function createHtmlElementFromArrayElement(arrayElement, tag, selector) {
    const partOfStringWithCheckbox = `<input type="checkbox" class="${checkboxClassName}">`;
    const partOfStringWithDeleteButton = `<button type="button" class="${deleteItemButtonClassName}" aria-label="Close"><span aria-hidden="true">&times;</span></button>`;

    let taskStatusSelector = '';

    if (arrayElement.statusOfProgress === defaultStatusForTasks) {
        taskStatusSelector = defaultStatusClassName;
    } else {
        taskStatusSelector = doneStatusClassName;
    }

    const finalSelectorForTag = selector + ' ' + taskStatusSelector;
    const groupForCheckboxAndButton = `<div class="${labelForActionsClassName}">${partOfStringWithDeleteButton + partOfStringWithCheckbox}</div>`;
    const innerWrapperForTextContent = `<div class="${wrapperForInnerTextClassName}">${arrayElement.inputedContent}</div>`;

    const resultHtmlNode = `<${tag} class="${finalSelectorForTag}">`
                            + groupForCheckboxAndButton
                            + innerWrapperForTextContent
                            + '<' + "/" + `${tag}>`;
    // alert(resultHtmlNode);

    return resultHtmlNode;
}

function createItemsTagsGroupFromArray(array, tag, selector) {
    let itemsTagged = "";
    for (let i = 0; i < array.length; i++) {
        if (array[i].removeStatus !== toRemoveStatusForTask) {
            itemsTagged += createHtmlElementFromArrayElement(array[i], tag, selector);
        }
    }
    return itemsTagged;
}

function withdrawElements(itemList, itemListArray) {
    const elementTaggedList = createItemsTagsGroupFromArray(itemListArray, tagTypeForItems, elementSelector);
    itemList.innerHTML = elementTaggedList;

}

function findItemInArrayWithSameContent(htmlItemContent, itemsListArray) {
    const foundedElement = _.findWhere(itemsListArray, {inputedContent: htmlItemContent});
    return foundedElement;
}

function findItemInArrayWithIndex(itemlistArray, chosenObject) {
    const indexOfFoundedObject = _.indexOf(itemlistArray, chosenObject);
    return indexOfFoundedObject;
}

function addElementToObjectsArray(array, inputField) {
    const inputedValue = getFormInputValue(inputField);
    if (inputedValue !== '') {
        if (!findItemInArrayWithSameContent(inputedValue, array)) {
            let newElement = createObjectFromNewValue(inputedValue);
            array.push(newElement);
        } else {
            alert(duplicateMessage);
        }
    }
}

function oppositValueFor(selector, firstAlternative, secondAlternative) {
    if (selector === firstAlternative) {
        return secondAlternative;
    } else {
        return firstAlternative;
    }
}

function changeItemStateIfSelected(elementType, listItemArray, chosenItemNode, chosenStatus) {
    const objectEqualsToSelected = findItemInArrayWithSameContent(chosenItemNode.textContent, itemListArray);
    const indexOfFoundedObject = findItemInArrayWithIndex(itemListArray, objectEqualsToSelected);

    switch (elementType) {
        case buttonType:
            listItemArray[indexOfFoundedObject].removeStatus = chosenStatus;
            break;
        case checkboxType:
            listItemArray[indexOfFoundedObject].statusOfProgress = chosenStatus;
            break;
        default:
            alert(unknownActionMessage);
    }

    repaintCurrentNode(chosenItemNode, chosenStatus);
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

function runActionForCheckboxOnChange(checkboxSelector) {
    const wrapperForInnerTextClassNameForQuerySelector = "." + wrapperForInnerTextClassName;

    $(checkboxSelector).change((e) => {

        // get child, with parent LI node, DIV with inputed text
        const chosenItemNode = e.target.parentElement.parentElement.querySelector(wrapperForInnerTextClassNameForQuerySelector);
        // alert(chosenItemNode.textContent);
        let chosenStatus = '';
        const elementType = checkboxType;

        if (this.checked) {
            chosenStatus = doneStatusForTasks;
        } else {
            chosenStatus = defaultStatusForTasks;
        }

        changeItemStateIfSelected(elementType, itemListArray, chosenItemNode, chosenStatus);
    });
}

function runActionForDeleteItemButtonOnChange(deleteItemButtonSelector) {
    // $(deleteItemButtonSelector).click = () => {
    //     // const chosenItemNode = this.parentNode;
    //     // const chosenStatus = toRemoveStatusForTask;
    //     // const elementType = buttonType;
    //     //
    //     // changeItemStateIfSelected(elementType, itemListArray, chosenItemNode, chosenStatus);
    //     alert('clicked');
    // };
    // alert($('item__delete').length);
    // $('.item__').on('click', function(e) {
    //     // const chosenItemNode = this.parentNode;
    //     // const chosenStatus = toRemoveStatusForTask;
    //     // const elementType = buttonType;
    //     //
    //     // changeItemStateIfSelected(elementType, itemListArray, chosenItemNode, chosenStatus);
    //     alert(e.target.innerHTML);
    // });
}

function listenToItemsForClicking(listItemsArray, checkboxSelector, deleteItemButtonSelector) {
    const checkboxSelectorForJquery = '.' + checkboxSelector;
    const deleteButtonSelectorForJquery = '.' + deleteItemButtonSelector;

    runActionForCheckboxOnChange(checkboxSelectorForJquery);
    runActionForDeleteItemButtonOnChange(deleteButtonSelectorForJquery);
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

        listenToItemsForClicking(itemListArray, checkboxClassName, deleteItemButtonClassName);

        //add event listener to delete buttons

    });

    deleteAllButton.click(() => {
        deleteAllObjectsFromArray(itemListArray);

        withdrawElements(itemsList, itemListArray);
    });

    chooseAllButton.click(() => {
        const currentButtonValue = getCurrentButtonValue(chooseAllButton);
        const itemStatus = getStatusForAction(currentButtonValue);
        repaintAllNodes();

        // withdrawElements()
    });

});