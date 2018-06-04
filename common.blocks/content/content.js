const duplicateMessage = 'This task is already in the list!';
const unknownActionMessage = 'Unknown action!';
const emptyInputFieldMessage = 'Empty input field!';

const selectAllStatusForSelectAllButton = 'Select all';
const deselectAllStatusForSelectAllButton = 'Deselect all';
const showAllTabName = 'All';
const showCompletedTabName = 'Completed';
const showNotCompletedTabName = 'Not completed';

const inputField = document.getElementById('form_input');
const itemsListParentNode = document.getElementById('task_list');

const addButton = $('#add_button');
const deleteAllButton = $('#delete_all_button');
const chooseAllButton = $('#choose_all_button');
const counterLabelForElementsArraySize = $('#counter_label');

const tabsSwitchSelector = 'tabs__link';
const elementSelector = 'tasks__item';
const defaultStatusClassName = 'tasks__item_default';
const doneStatusClassName = 'tasks__item_done';
const labelForActionsClassName = 'item__label';
const wrapperForInnerTextClassName = 'item__textwrapper'
const checkboxClassName = 'item__checkbox';
const deleteItemButtonClassName = 'item__delete';
const itemGhostInputFieldClassName = 'item__ghost';

const enterKey = 'Enter';
const keyEvent = 'keyup';
const mouseClickEvent = 'click';
const mouseDoubleClickEvent = 'dblclick';

const defaultStatusForTasks = 'undone';
const doneStatusForTasks = 'done';
const toRemoveStatusForTask = 'remove';
const toKeepStatusForTask = 'keep';

const defaultStatusForTasksToShow = 'all';
const doneStatusForTasksToShow = 'only_done';
const undoneStatusForTasksToShow = 'only_undone';

const tagTypeForItems = 'li';

const buttonType = 'button';
const checkboxType = 'checkbox';

const itemListArray = Array();

function addKeyupEvenListenerForInput(key, eventNameForKey) {
    inputField.focus();
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
    const partOfStringWithDeleteButton = `<button type="button" class="${deleteItemButtonClassName}" aria-label="Close"></button>`;

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

    return resultHtmlNode;
}

function getArrayByObjectKeyWrapper(itemsArray, key, value) {
    return _.filter(itemsArray, (element) => {
        return element[key] === value;
    });
}

function getItemObjectsByCurrentStatus(itemsArray, statusToShow = defaultStatusForTasksToShow) {
    switch (statusToShow) {
        case doneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, 'statusOfProgress', doneStatusForTasks);
            break;
        case undoneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, 'statusOfProgress', defaultStatusForTasks);

            break;
        case  defaultStatusForTasksToShow:
        default:
            return itemsArray;
            break;
    }
}

function createItemsTagsGroupFromArray(array, tag, selector, statusToShow) {
    const newArray = getItemObjectsByCurrentStatus(array, statusToShow);

    let itemsTagged = "";
    for (let i = 0; i < newArray.length; i++) {
        if (newArray[i].removeStatus !== toRemoveStatusForTask) {
            itemsTagged += createHtmlElementFromArrayElement(newArray[i], tag, selector);
        }
    }
    return itemsTagged;
}

function withdrawElements(itemList, itemListArray, itemsStatusToShowWithTabs) {
    const elementTaggedList = createItemsTagsGroupFromArray(itemListArray, tagTypeForItems, elementSelector, itemsStatusToShowWithTabs);
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
            repaintCurrentNodeAfterCheckboxChanged(chosenItemNode, chosenStatus);
            break;
        default:
            alert(unknownActionMessage);
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

function repaintCurrentNodeAfterCheckboxChanged(chosenItemNode, chosenStatus) {
    const repaintClassName = chosenStatus === defaultStatusForTasks ? defaultStatusClassName : doneStatusClassName;
    changeStatusForNode(chosenItemNode, repaintClassName);
}

function invokeGhostInputField(currentNode) {
    const oldValue = currentNode.textContent;
    const ghostInputFieldNodeTag = `<input class="${itemGhostInputFieldClassName}" type="text" value="${oldValue}" />`;
    // currentNode.innerHTML = ghostInputFieldNodeTag;
    currentNode.innerHTML = '';
    $(ghostInputFieldNodeTag).appendTo(currentNode).focus();



    // let newValue = '';
    // //
    // const ghostInputFieldNode = $(getJqueryFormatSelectorFrom(itemGhostInputFieldClassName));
    // console.log(ghostInputFieldNode.innerText);
    //
    // // ghostInputFieldNode.focus();
    // ghostInputFieldNode.keypress((e) => {
    //     if (e.key.toString() === enterKey) {
    //         newValue = e.currentTarget.value;
    //
    //         // $(itemGhostInputFieldSelectorForJquery).remove();
    //     }
    // });

    // $("#todolist").on('dblclick', 'span', function () {
    //     oriVal = $(this).text();
    //     $(this).text("");
    //     $("<input type='text'>").appendTo(this).focus();
    // });
    // $("#todolist").on('focusout', 'span > input', function () {
    //     var $this = $(this);
    //     $this.parent().text($this.val() || oriVal);
    //     $this.remove(); // Don't just hide, remove the element.
    // });
    //
    // return newValue;
}

function updateElement(oldValue, newValue) {
    const objectEqualsToSelected = findItemInArrayWithSameContent(oldValue, itemListArray);
    const indexOfFoundedObject = findItemInArrayWithIndex(itemListArray, objectEqualsToSelected);
    if (newValue !== '') {
        itemListArray[indexOfFoundedObject].inputedContent = newValue;
    } else {
        console.log(emptyInputFieldMessage);
    }
}

function deleteAllObjectsFromArray(listItemsArray) {
    listItemsArray.length = 0; //or = [] // Array()
}

function getElementsCountByStatus(itemsArray, statusToShow) {
    switch (statusToShow) {
        case doneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, 'statusOfProgress', doneStatusForTasks).length;
            break;
        case undoneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, 'statusOfProgress', defaultStatusForTasks).length;
            break;
        case  defaultStatusForTasksToShow:
        default:
            return itemsArray.length;
            break;
    }
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

function updateElementsCountForStatus(statusToShow) {
    const counterForElementsByStatus = getElementsCountByStatus(itemListArray, statusToShow);
    counterLabelForElementsArraySize.text(counterForElementsByStatus);
}

function getJqueryFormatSelectorFrom(plainSelector) {
    return '.' + plainSelector;
}

$(document).ready(() => {
    addKeyupEvenListenerForInput(enterKey, keyEvent);

    addButton.click(() => {
        addElementToObjectsArray(itemListArray, inputField);
        clearInputField(inputField);
        withdrawElements(itemsListParentNode, itemListArray, defaultStatusForTasksToShow);
        updateElementsCountForStatus(defaultStatusForTasksToShow);
    });

    $(document).on(mouseClickEvent, getJqueryFormatSelectorFrom(checkboxClassName), (e) => {
        const chosenItemNode = e.target.parentElement.parentElement.querySelector(getJqueryFormatSelectorFrom(wrapperForInnerTextClassName));
        let chosenStatus = '';

        if (e.target.checked) {
            chosenStatus = doneStatusForTasks;
        } else {
            chosenStatus = defaultStatusForTasks;
        }

        changeItemStateIfSelected(checkboxType, itemListArray, chosenItemNode, chosenStatus);
        updateElementsCountForStatus(defaultStatusForTasksToShow);
    });

    $(document).on(mouseClickEvent, getJqueryFormatSelectorFrom(deleteItemButtonClassName), (e) => {
        const chosenItemNode = e.target.parentElement.parentElement.querySelector(getJqueryFormatSelectorFrom(wrapperForInnerTextClassName));
        let chosenStatus = toRemoveStatusForTask;

        changeItemStateIfSelected(buttonType, itemListArray, chosenItemNode, chosenStatus);
        withdrawElements(itemsListParentNode, itemListArray, defaultStatusForTasksToShow);
        updateElementsCountForStatus(defaultStatusForTasksToShow);
    });

    $(document).on(mouseDoubleClickEvent, getJqueryFormatSelectorFrom(wrapperForInnerTextClassName), (e) => {
        e.stopPropagation();

        let chosenItemNode = e.target.parentElement.querySelector(getJqueryFormatSelectorFrom(wrapperForInnerTextClassName));
        const oldValue = chosenItemNode.textContent;

        invokeGhostInputField(chosenItemNode);

        // $(document).click(function () {
        //     chosenItemNode.innerHTML = newValue;
        // });
        //
        // if (newValue !== oldValue) {
        //     updateElement(oldValue, newValue);
        //     withdrawElements(itemsListParentNode, itemListArray);
        // } else {
        //     alert('temporary');
        // }

        // withdrawElements(itemsListParentNode, itemListArray);
    });

    $(document).on('keypress', getJqueryFormatSelectorFrom(itemGhostInputFieldClassName), () => {
        //.....
    });

    deleteAllButton.click(() => {
        deleteAllObjectsFromArray(itemListArray);
        withdrawElements(itemsListParentNode, itemListArray, doneStatusForTasksToShow);   // It doesn't matter what status, the array will be empty anymore

        updateElementsCountForStatus(doneStatusForTasksToShow);
    });

    chooseAllButton.click(() => {
        const currentButtonValue = getCurrentButtonValue(chooseAllButton);
        const itemStatus = getStatusForAction(currentButtonValue);

        const itemNodeList = document.getElementsByClassName(elementSelector);
        for (let i = 0; i < itemNodeList.length; i++) {
            changeItemStateIfSelected(checkboxType, itemListArray, itemNodeList[i], itemStatus);
        }

        const newButtonName = oppositValueFor(currentButtonValue, selectAllStatusForSelectAllButton, deselectAllStatusForSelectAllButton);
        chooseAllButton.html(newButtonName);

        withdrawElements(itemsListParentNode, itemListArray, doneStatusForTasksToShow);

        updateElementsCountForStatus(doneStatusForTasksToShow);
    });

    $(document).on(mouseClickEvent, getJqueryFormatSelectorFrom(tabsSwitchSelector), (e) => {
        switch (e.target.innerHTML) {
            case showCompletedTabName:
                withdrawElements(itemsListParentNode, itemListArray, doneStatusForTasksToShow);
                updateElementsCountForStatus(doneStatusForTasksToShow);
                break;
            case showNotCompletedTabName:
                withdrawElements(itemsListParentNode, itemListArray, undoneStatusForTasksToShow);
                updateElementsCountForStatus(undoneStatusForTasksToShow);
                break;
            case showAllTabName:
            default:
                withdrawElements(itemsListParentNode, itemListArray, defaultStatusForTasksToShow);
                updateElementsCountForStatus(defaultStatusForTasksToShow);
                break;
        }
    })
});