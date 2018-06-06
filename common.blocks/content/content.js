const duplicateMessage = "This task is already in the list!";
const unknownActionMessage = "Unknown action!";
const emptyInputFieldMessage = "Empty input field!";

const selectAllStatusForSelectAllButton = "Select all";
const deselectAllStatusForSelectAllButton = "Deselect all";
const showAllTabName = "All";
const showCompletedTabName = "Completed";
const showNotCompletedTabName = "Not completed";

const inputField = document.getElementById("form_input");
const itemsListParentNode = document.getElementById("task_list");

const addButton = $("#add_button");
const deleteAllButton = $("#delete_all_button");
const chooseAllButton = $("#choose_all_button");
const counterLabelForElementsArraySize = $("#counter_label");
const paginationPannel = $("#pagination_panel");

const tabsSwitchClassName = "tabs__link";
const elementClassName = "tasks__item";
const defaultStatusClassName = "tasks__item_default";
const doneStatusClassName = "tasks__item_done";
const labelForActionsClassName = "item__label";
const wrapperForInnerTextClassName = "item__textwrapper";
const checkboxClassName = "item__checkbox";
const deleteItemButtonClassName = "item__delete";
const itemGhostInputFieldClassName = "item__ghost";
const paginationPageLinkClassName = "pagination__link";

const currentPageId = "current_page";

const enterKey = 13;

const defaultStatusForTasks = "undone";
const doneStatusForTasks = "done";
const toRemoveStatusForTask = "remove";
const toKeepStatusForTask = "keep";

const defaultStatusForTasksToShow = "all";
const doneStatusForTasksToShow = "only_done";
const undoneStatusForTasksToShow = "only_undone";

const tagTypeForItems = "li";

const buttonType = "button";
const checkboxType = "checkbox";

let itemListArray = Array();

const itemsOnOnePageCount = 5;
const defaultPageNumber = 1;

function addKeyupEvenListenerForInput() {
    inputField.focus();
    inputField.addEventListener("keyup", function(e) {
        e.preventDefault();

        if (e.which === enterKey) {
            addButton.click();
        }
    });
}

function createObjectFromNewValue(inputedValue) {
    return {
        inputedContent: inputedValue,
        statusOfProgress: defaultStatusForTasks,
        removeStatus: toKeepStatusForTask,
    };
}

function createHtmlElementFromArrayElement(arrayElement, tag, selector) {
    const partOfStringWithCheckbox = `<input type="checkbox" class="${checkboxClassName}">`;
    const partOfStringWithDeleteButton = `<button type="button" class="${deleteItemButtonClassName}" aria-label="Close"></button>`;

    let taskStatusSelector = "";

    if (arrayElement.statusOfProgress === defaultStatusForTasks) {
        taskStatusSelector = defaultStatusClassName;
    } else {
        taskStatusSelector = doneStatusClassName;
    }

    const finalSelectorForTag = selector + " " + taskStatusSelector;
    const groupForCheckboxAndButton = `<div class="${labelForActionsClassName}">${partOfStringWithDeleteButton + partOfStringWithCheckbox}</div>`;
    const innerWrapperForTextContent = `<div class="${wrapperForInnerTextClassName}">${arrayElement.inputedContent}</div>`;

    const resultHtmlNode = `<${tag} class="${finalSelectorForTag}">`
                            + groupForCheckboxAndButton
                            + innerWrapperForTextContent
                            + "<" + "/" + `${tag}>`;

    return resultHtmlNode;
}

function createPaginationLinks(pageCount, tag) {
    let paginationArrayNodeString = "";
    const newPageCountForDisplay = pageCount + 1;
    for(let pageNumber = 1; pageNumber < newPageCountForDisplay; pageNumber++) {
        paginationArrayNodeString += `<${tag} class="${paginationPageLinkClassName}">${pageNumber}` + "<" + "/" + `${tag}>`;
    }

    return paginationArrayNodeString;
}

function getCurrentPageNumber(array) {
   return Math.ceil(array.length / itemsOnOnePageCount);
}

function setActiveStateForPageNumber(pageNumber = defaultPageNumber) {
    const pageNodes = document.getElementsByClassName(paginationPageLinkClassName);
    for (let i = 0; i < pageNodes.length; i++) {
        if (pageNodes[i].hasAttribute("id")) {
            pageNodes[i].removeAttribute("id");
        }
        if (pageNodes[i].textContent === pageNumber.toString()) {
            pageNodes[i].setAttribute("id", currentPageId);
            console.log(pageNodes[i]);
        }
    }
    console.log(pageNodes);
}

function getArrayByObjectKeyWrapper(itemsArray, key, value) {
    return _.filter(itemsArray, (element) => {
        return element[key] === value;
    });
}

function getItemObjectsByCurrentStatus(itemsArray, statusToShow = defaultStatusForTasksToShow) {
    switch (statusToShow) {
        case doneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, "statusOfProgress", doneStatusForTasks);
            break;
        case undoneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, "statusOfProgress", defaultStatusForTasks);

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

function deleteAllElementsInArrayWithRemoveStatus() {
    itemListArray = _.filter(itemListArray, (element) => { return element.removeStatus !== toRemoveStatusForTask; });
}

function withdrawElements(itemList, itemListArray, itemsStatusToShowWithTabs) {
    const elementTaggedList = createItemsTagsGroupFromArray(itemListArray, tagTypeForItems, elementClassName, itemsStatusToShowWithTabs);
    itemList.innerHTML = elementTaggedList;
}

function getPartOfArrayForPagination(itemsArray, itemsOnePageCount, pageNumber) {
    let startIndex = itemsArray.length - (itemsArray.length - itemsOnePageCount * (pageNumber - 1));
    let endIndex = startIndex + (itemsArray.length - itemsOnePageCount * (pageNumber - 1));

    console.log(startIndex, endIndex);

    if (endIndex >= itemsArray.length) {
        endIndex = itemsArray.length;
    }

    console.log(startIndex, endIndex);
    const partOfArray = _.slice(itemsArray, startIndex, endIndex);
    return partOfArray;
}



function addElementToObjectsArray(array, inputField) {
    const inputedValue = inputField.value;
    if (inputedValue !== "") {
        // const foundedObject = _.findWhere(array, {inputedContent: inputedValue});
        const indexOfFoundedObject = _.findIndex(itemListArray, ["inputedContent", inputedValue]);

        if (indexOfFoundedObject) {
            // if (!foundedObject) {
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
    const indexOfFoundedObject = _.findIndex(itemListArray, ["inputedContent", chosenItemNode.textContent]);
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

function updateElement(oldValue, newValue) {
    const indexOfFoundedObject = _.findIndex(itemListArray, ["inputedContent", oldValue]);

    if (newValue !== "") {
        itemListArray[indexOfFoundedObject].inputedContent = newValue;
    } else {
        alert(emptyInputFieldMessage);
    }
}

function deleteAllObjectsFromArray(listItemsArray) {
    listItemsArray.length = 0; //or = [] // Array()
}

function getElementsCountByStatus(itemsArray, statusToShow) {
    switch (statusToShow) {
        case doneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, "statusOfProgress", doneStatusForTasks).length;
            break;
        case undoneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, "statusOfProgress", defaultStatusForTasks).length;
            break;
        case  defaultStatusForTasksToShow:
        default:
            return itemsArray.length;
            break;
    }
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
    return "." + plainSelector;
}

function withdrawPaginationPannel(itemListArray, activePage) {
    let currentPageNumber = 0;
    if (activePage === 0) { //without onclick by on pagination panel
        currentPageNumber = getCurrentPageNumber(itemListArray);
        const paginationLinksString = createPaginationLinks(currentPageNumber, tagTypeForItems);
        paginationPannel.html("");
        paginationPannel.append(paginationLinksString);
    } else {
        currentPageNumber = activePage;
    }

    setActiveStateForPageNumber(currentPageNumber);
    alert(currentPageNumber);
}

function showItemListWithPaginationDevision(array, itemStatus, activePage = 0) {
    withdrawElements(itemsListParentNode, array, itemStatus);
    withdrawPaginationPannel(array, activePage);

    updateElementsCountForStatus(itemStatus);
}

$(document).ready(() => {
    addKeyupEvenListenerForInput();

    addButton.click(() => {
        addElementToObjectsArray(itemListArray, inputField);
        inputField.value = "";

        showItemListWithPaginationDevision(itemListArray, defaultStatusForTasksToShow);
    });

    $(document).on("click", getJqueryFormatSelectorFrom(checkboxClassName), (e) => {
        const chosenItemNode = e.target.parentElement.parentElement.querySelector(getJqueryFormatSelectorFrom(wrapperForInnerTextClassName));
        let chosenStatus = "";

        if (e.target.checked) {
            chosenStatus = doneStatusForTasks;
        } else {
            chosenStatus = defaultStatusForTasks;
        }

        changeItemStateIfSelected(checkboxType, itemListArray, chosenItemNode, chosenStatus);
        updateElementsCountForStatus(defaultStatusForTasksToShow);
    });

    $(document).on("click", getJqueryFormatSelectorFrom(deleteItemButtonClassName), (e) => {
        const chosenItemNode = e.target.parentElement.parentElement.querySelector(getJqueryFormatSelectorFrom(wrapperForInnerTextClassName));
        let chosenStatus = toRemoveStatusForTask;

        changeItemStateIfSelected(buttonType, itemListArray, chosenItemNode, chosenStatus);
        deleteAllElementsInArrayWithRemoveStatus();
        showItemListWithPaginationDevision(itemListArray, defaultStatusForTasksToShow);
    });

    $(document).on("dblclick", getJqueryFormatSelectorFrom(wrapperForInnerTextClassName), function(event) {
        const chosenItemNode = event.target.parentElement.querySelector(getJqueryFormatSelectorFrom(wrapperForInnerTextClassName));
        let oldValue = chosenItemNode.innerText;
        // const oldValue = chosenItemNode.innerText;
        chosenItemNode.innerHTML = "";

        const ghostInputFieldNodeTag = `<input class="${itemGhostInputFieldClassName}" type="text" value="${oldValue}" />`;
        $(chosenItemNode).append(ghostInputFieldNodeTag);

        const ghostInput = event.target.parentElement.querySelector(getJqueryFormatSelectorFrom(itemGhostInputFieldClassName));
        ghostInput.focus();

        $(getJqueryFormatSelectorFrom(itemGhostInputFieldClassName)).focus(function(e) {
            oldValue = e.target.value;
        });

        // $(getJqueryFormatSelectorFrom(itemGhostInputFieldClassName)).blur(function(e) {
        //     $(getJqueryFormatSelectorFrom(itemGhostInputFieldClassName)).focus();
        //
        //     newValue = e.target.value;
        // });


        let newValue = "";

        $(getJqueryFormatSelectorFrom(itemGhostInputFieldClassName)).keyup(function(e) {
            if (e.which === enterKey) {
                newValue = e.target.value;
                updateElement(oldValue, newValue); //sometimes after blur event oldvalue === newvalue, FIX (if changed oldvalue = earlier got value)

                showItemListWithPaginationDevision(itemListArray, defaultStatusForTasksToShow);
            }
        });
    });

    deleteAllButton.click(() => {
        deleteAllObjectsFromArray(itemListArray);
        showItemListWithPaginationDevision(itemListArray, doneStatusForTasksToShow);  // It doesn't matter what status, the array will be empty anymore
    });

    chooseAllButton.click(() => {
        const currentButtonValue = chooseAllButton.text();
        const itemStatus = getStatusForAction(currentButtonValue);

        const itemNodeList = document.getElementsByClassName(elementClassName);
        for (let i = 0; i < itemNodeList.length; i++) {
            changeItemStateIfSelected(checkboxType, itemListArray, itemNodeList[i], itemStatus);
        }

        const newButtonName = oppositValueFor(currentButtonValue, selectAllStatusForSelectAllButton, deselectAllStatusForSelectAllButton);
        chooseAllButton.html(newButtonName);

        showItemListWithPaginationDevision(itemListArray, doneStatusForTasksToShow);
    });

    $(document).on("click", getJqueryFormatSelectorFrom(tabsSwitchClassName), (e) => {
        let itemStatus = "";
        switch (e.target.innerHTML) {
            case showCompletedTabName:
                itemStatus = doneStatusForTasksToShow;
                break;
            case showNotCompletedTabName:
                itemStatus = undoneStatusForTasksToShow;
                break;
            case showAllTabName:
            default:
                itemStatus = defaultStatusForTasksToShow;
                break;
        }

        showItemListWithPaginationDevision(itemListArray, itemStatus);
    });

    $(document).on("click", getJqueryFormatSelectorFrom(paginationPageLinkClassName), (e) => {
        const activePage = parseInt(e.target.innerHTML);
        showItemListWithPaginationDevision(itemListArray, defaultStatusForTasksToShow, activePage);
    })
});