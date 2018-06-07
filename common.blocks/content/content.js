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
const tabsSwitchActiveStateClassName = "tabs__link_current";
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
const indexNotFound = -1;

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
        removeStatus: toKeepStatusForTask
    };
}

function getHtmlTag(arrayElement, tag, selector) {
    const partWithCheckbox = `<input type="checkbox" class="${checkboxClassName}">`;
    const partWithDeleteButton = `<button type="button" class="${deleteItemButtonClassName}" aria-label="Close"></button>`;

    const taskStatusSelector = arrayElement.statusOfProgress === defaultStatusForTasks ? defaultStatusClassName : doneStatusClassName;
    const finalSelectorForTag = selector + " " + taskStatusSelector;

    const groupForCheckboxAndButton = `<div class="${labelForActionsClassName}">${partWithDeleteButton + partWithCheckbox}</div>`;
    const innerWrapperForTextContent = `<div class="${wrapperForInnerTextClassName}">${arrayElement.inputedContent}</div>`;

    return `<${tag} class="${finalSelectorForTag}">` + groupForCheckboxAndButton + innerWrapperForTextContent + "<" + "/" + `${tag}>`;
}

function createPaginationLinks(pageCount, tag) {
    //Iterate through each generated page number and create pagination __tabs for them
    const paginationArrayNode = [...Array(pageCount).keys()].map(page => {
        return `<${tag} class="${paginationPageLinkClassName}">${page + 1}` + "<" + "/" + `${tag}>`;
    });
    return _.join(paginationArrayNode, "");
}

function getCurrentPageNumber(array) {
   return Math.ceil(array.length / itemsOnOnePageCount);
}

function setActiveStateForPageNumber(pageNumber) {
    const pageNodes = document.getElementsByClassName(paginationPageLinkClassName);
    for (const tabNode of pageNodes) {
        if (tabNode.hasAttribute("id")) {
            tabNode.removeAttribute("id");
        }
        if (tabNode.textContent === pageNumber.toString()) {
            tabNode.setAttribute("id", currentPageId);
        }
    }
}

// function setActiveStateForTabs(clickedTab) {
//     const switchingTabs = document.getElementsByClassName(tabsSwitchClassName);
//     for (let i = 0; i < switchingTabs.length; i++) {
//         if (switchingTabs[i].hasAttribute("class", tabsSwitchActiveStateClassName)) {
//             switchingTabs[i].removeAttribute("class", tabsSwitchActiveStateClassName);
//         }
//         if (switchingTabs[i].textContent === clickedTab.toString()) {
//             switchingTabs[i].setAttribute("id", currentPageId);
//         }
//     }
// }

function getArrayByObjectKeyWrapper(itemsArray, key, value) {
    return _.filter(itemsArray, element => { element[key] === value; });
}

function getItemObjectsByCurrentStatus(itemsArray, statusToShow = defaultStatusForTasksToShow) {
    switch (statusToShow) {
        case doneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, "statusOfProgress", doneStatusForTasks);
        case undoneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, "statusOfProgress", defaultStatusForTasks);
        case  defaultStatusForTasksToShow:
            return itemsArray;
        default:
            return itemsArray;
    }
}

function createItemsTagsGroupFromArray(array, tag, selector, statusToShow) {
    const newArray = getItemObjectsByCurrentStatus(array, statusToShow);
    const itemsTaggedArray = _.map(newArray, element => {
        if (element.removeStatus !== toRemoveStatusForTask) {
            return getHtmlTag(element, tag, selector);
        }
    });
    return _.join(itemsTaggedArray, "");
}

function deleteAllElementsInArrayWithRemoveStatus() {
    itemListArray = _.filter(itemListArray, (element) => { return element.removeStatus !== toRemoveStatusForTask; });
}

function withdrawElements(itemList, itemListArray, itemsStatusToShowWithTabs) {
    itemList.innerHTML = createItemsTagsGroupFromArray(itemListArray, tagTypeForItems, elementClassName, itemsStatusToShowWithTabs);
}

function getPartOfArrayForPagination(itemsArray, itemsOnePageCount, pageNumber) {
    let startIndex = itemsArray.length - (itemsArray.length - itemsOnePageCount * (pageNumber - 1));
    let endIndex = startIndex + itemsOnePageCount;

    if (endIndex >= itemsArray.length) {
        endIndex = itemsArray.length;
    }
    return _.slice(itemsArray, startIndex, endIndex);
}

function addElementToObjectsArray(array, inputField) {
    const inputedValue = inputField.value;
    if (inputedValue !== "") {
        const indexOfFoundedObject = _.findIndex(array, ["inputedContent", inputedValue]);

        if (indexOfFoundedObject === indexNotFound) {
            const newElement = createObjectFromNewValue(inputedValue);
            array.push(newElement);
        } else {
            alert(duplicateMessage);
        }
    }
}

function oppositValue(selector, firstAlternative, secondAlternative) {
    return selector === firstAlternative ? secondAlternative : firstAlternative;
}

function changeItemStateIfSelected(elementType, listItemArray, chosenItemNode, chosenStatus) {
    const indexOfFoundedObject = _.findIndex(itemListArray, ["inputedContent", chosenItemNode.textContent]);
    switch (elementType) {
        case buttonType:
            listItemArray[indexOfFoundedObject].removeStatus = chosenStatus;
            break;
        case checkboxType:
            listItemArray[indexOfFoundedObject].statusOfProgress = chosenStatus;
            const repaintClassName = chosenStatus === defaultStatusForTasks ? defaultStatusClassName : doneStatusClassName;
            changeStatusForNode(chosenItemNode, repaintClassName);
            break;
        default:
            alert(unknownActionMessage);
    }
}

function changeStatusForNode(currentNode, newStatus) {
    const newClassName = newStatus === defaultStatusForTasks ? defaultStatusClassName : doneStatusClassName;
    if (!(currentNode.classList.contains(newClassName))) {
        currentNode.classList.remove(oppositValue(newClassName));
        currentNode.classList.add(newClassName);
    } else {
        currentNode.classList.remove(newClassName);
        currentNode.classList.add(oppositValue(newClassName));
    }
}

function updateElement(oldValue, newValue) {
    const indexOfFoundedObject = _.findIndex(itemListArray, ["inputedContent", oldValue]);

    if (newValue !== "") {
        itemListArray[indexOfFoundedObject].inputedContent = newValue;
    } else {
        alert(emptyInputFieldMessage);
    }
}

function deleteAllObjectsFromArray() {
    itemListArray = _.drop(itemListArray, itemListArray.length);
}

function getElementsCountByStatus(itemsArray, statusToShow) {
    switch (statusToShow) {
        case doneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, "statusOfProgress", doneStatusForTasks).length;
        case undoneStatusForTasksToShow:
            return getArrayByObjectKeyWrapper(itemsArray, "statusOfProgress", defaultStatusForTasks).length;
        case  defaultStatusForTasksToShow:
            return itemsArray.length;
        default:
            return itemsArray.length;
    }
}

function getStatusForAction(currentButtonValueString) {
    return currentButtonValueString === selectAllStatusForSelectAllButton ? doneStatusForTasks : defaultStatusForTasks;
}

function updateElementsCountForStatus(statusToShow) {
    const counterForElementsByStatus = getElementsCountByStatus(itemListArray, statusToShow);
    counterLabelForElementsArraySize.text(counterForElementsByStatus);
}

function getJqueryFormatSelectorFrom(plainSelector) {
    return "." + plainSelector;
}

function withdrawPaginationPannel(itemListArray, activePageNumber) {
    const lastPageNumber = getCurrentPageNumber(itemListArray);
    const paginationLinksString = createPaginationLinks(lastPageNumber, tagTypeForItems);
    paginationPannel.html("");
    paginationPannel.append(paginationLinksString);

    setActiveStateForPageNumber(activePageNumber);
}

function showItemListWithPaginationDevision(array, itemStatus, activePageNumber, allElementsInArraySelection = false) {
    const currentPageItemArray =  allElementsInArraySelection ? array : getPartOfArrayForPagination(array, itemsOnOnePageCount, activePageNumber);

    withdrawElements(itemsListParentNode, currentPageItemArray, itemStatus);
    withdrawPaginationPannel(itemListArray, activePageNumber);

    updateElementsCountForStatus(itemStatus);
}

function getCurrentPageByElementContentSearch(itemsArray, elementTextContent) {
    const index = _.findIndex(itemsArray, ["inputedContent", elementTextContent]);
    const currentPage = index ? (index + 1) / itemsOnOnePageCount : defaultPageNumber;
    return Math.ceil(currentPage);
}

//Short expression for $(document).ready(function(){...})
$(function () {
    addKeyupEvenListenerForInput();

    addButton.click(() => {
        addElementToObjectsArray(itemListArray, inputField);
        inputField.value = "";

        const currentPageNumber = getCurrentPageNumber(itemListArray);
        showItemListWithPaginationDevision(itemListArray, defaultStatusForTasksToShow, currentPageNumber);

        return false;
    });

    $(document).on("click", getJqueryFormatSelectorFrom(checkboxClassName), (e) => {
        const chosenItemNode = e.target.parentElement.parentElement.querySelector(getJqueryFormatSelectorFrom(wrapperForInnerTextClassName));
        const chosenStatus = e.target.checked ? doneStatusForTasks : defaultStatusForTasks;

        changeItemStateIfSelected(checkboxType, itemListArray, chosenItemNode, chosenStatus);
        updateElementsCountForStatus(defaultStatusForTasksToShow);

        return false;
    });

    $(document).on("click", getJqueryFormatSelectorFrom(deleteItemButtonClassName), (e) => {
        const chosenItemNode = e.target.parentElement.parentElement.querySelector(getJqueryFormatSelectorFrom(wrapperForInnerTextClassName));
        const chosenStatus = toRemoveStatusForTask;
        const currentPageNumber = getCurrentPageByElementContentSearch(itemListArray, chosenItemNode.textContent);

        changeItemStateIfSelected(buttonType, itemListArray, chosenItemNode, chosenStatus);
        deleteAllElementsInArrayWithRemoveStatus();
        showItemListWithPaginationDevision(itemListArray, defaultStatusForTasksToShow, currentPageNumber);

        return false;
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

            return false;
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

                const currentPageNumber = getCurrentPageByElementContentSearch(itemListArray, newValue);
                showItemListWithPaginationDevision(itemListArray, defaultStatusForTasksToShow, currentPageNumber);

                return false;
            }
        });
    });

    deleteAllButton.click(() => {
        deleteAllObjectsFromArray();
        const activePage = defaultPageNumber;
        showItemListWithPaginationDevision(itemListArray, doneStatusForTasksToShow, activePage);  // It doesn't matter what status, the array will be empty anymore

        return false;
    });

    chooseAllButton.click(() => {
        const currentButtonValue = chooseAllButton.text();
        const itemStatus = getStatusForAction(currentButtonValue);

        const itemNodeList = document.getElementsByClassName(elementClassName);
        for (const itemNode of itemNodeList) {
            changeItemStateIfSelected(checkboxType, itemListArray, itemNode, itemStatus);
        }

        const newButtonName = oppositValue(currentButtonValue, selectAllStatusForSelectAllButton, deselectAllStatusForSelectAllButton);
        chooseAllButton.html(newButtonName);

        const activePage = defaultPageNumber;
        const allElementsInArraySelection = true;
        showItemListWithPaginationDevision(itemListArray, doneStatusForTasksToShow, activePage,  allElementsInArraySelection);

        return false;
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
                itemStatus = defaultStatusForTasksToShow;
                break;
            default:
                itemStatus = defaultStatusForTasksToShow;
                break;
        }
        const activePage = defaultPageNumber;

        showItemListWithPaginationDevision(itemListArray, itemStatus, activePage);

        return false;
    });

    $(document).on("click", getJqueryFormatSelectorFrom(paginationPageLinkClassName), (e) => {
        const activePage = parseInt(e.target.innerHTML);
        showItemListWithPaginationDevision(itemListArray, defaultStatusForTasksToShow, activePage);

        return false;
    });
});