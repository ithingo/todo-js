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
// function findItemInArrayWithSameContent(htmlItemContent, itemsListArray) {
//     // let foundedElement = itemsListArray.indexOf(htmlItemContent);
//     let foundedElement = _.findWhere(itemsListArray, {inputedContent: htmlItemContent});
//     alert(foundedElement.inputedContent);
// }
//
// function isTaskDone(arrayElement) {
//     return arrayElement.statusOfProgress === doneStatusForTasks;
// }
//
// function changeItemStateIfSelected(itemList) {
//
// }

function listenToItemsForClicking(checkboxSelector) {
    const checkboxSelectorForJquery = '.' + checkboxSelector;
    $(checkboxSelectorForJquery).change(function() {
        if (this.checked) {
            let chosenItemNode = this.parentNode;
            // findItemInArrayWithSameContent(chosenItemNode.textContent, itemListArray);
        } else {
            alert('not');
        }
    });
}


$(document).ready(() => {
    addKeyupEvenListenerForInput(enterKey, keyEvent);

    addButton.click(() => {
        addElement(itemListArray, inputField);

        clearInputField(inputField);

        withdrawElements(itemsList, itemListArray);

        listenToItemsForClicking(checkboxClassName);
    });

});