const taskListUlNode = $("#task_list");
const inputField = $("#form_input");
const addButton = $("#add_button");
const deleteAllButton = $("#delete_all_button");
const chooseAllButton = $("#choose_all_button");
const counterLabelAll = $("counter_label_all");
const counterLabelChecked = $("counter_label_checked");
const counterLabelUnchecked = $("counter_label_unchecked");
const paginationPannel = $("#pagination_panel");

const itemClassName = "tasks__item";
const defaultStatusClassName = "tasks__item_default";
const doneStatusClassName = "tasks__item_done";
const labelForActionsClassName = "item__label";
const deleteItemButtonClassName = "item__delete";
const wrapperForInnerTextClassName = "item__textwrapper";
const checkboxClassName = "item__checkbox";
const itemGhostInputFieldClassName = "item__ghost";
const paginationPageLinkClassName = "pagination__link";
const paginationActivePageClassName = "pagination__link_current";
const tabsSwitchClassName = "tabs__link";
const tabsSwitchActiveStateClassName = "tabs__link_current";

const showAllTabName = "All";
const showCompletedTabName = "Completed";
const showNotCompletedTabName = "Not completed";

const currentPageId = "current_page";

const enterKey = 13;
const defaultPage = 1;
const itemsOnOnePageCount = 5;

let itemArray = Array();
let bufferedArray = Array();
let index = 0;

function getCurrentPageNumber(array) {
   return Math.ceil(array.length / itemsOnOnePageCount);
}

function setActiveStateForPage(pageNumber) {
    const pageNodes = $("."+paginationPageLinkClassName);
    for (const tabNode of pageNodes) {
        if (tabNode.hasAttribute("id")) {
            tabNode.removeAttribute("id");
            tabNode.removeAttribute("class", paginationActivePageClassName);
        }
        if (tabNode.textContent === pageNumber.toString()) {
            tabNode.setAttribute("id", currentPageId);
            tabNode.setAttribute("class", paginationActivePageClassName);
        }
    }
}

$(function() {
    inputField.focus();

    function addTodo() {
        const text = inputField.val().trim();

        if (text) {
            const newObject = {
                id: index,
                text: text,
                checked: false,
            };

            itemArray.push(newObject);
            index += 1;

            inputField.val("");
        }
    }

    function repaintTags(array = itemArray) {
        let htmlTags = "";

        for (const item of array) {
            const { id: itemIndex, text: itemText, checked: itemChecked } = item;

            const taskStatusSelector = itemChecked ? doneStatusClassName : defaultStatusClassName;
            const checkedStatus = itemChecked ? "checked" : "";
            const finalSelectorForTag = itemClassName + " " + taskStatusSelector;

            const template = `<li id="${itemIndex}" class="${finalSelectorForTag}">
                                <div class="${labelForActionsClassName}">
                                    <button type="button" class="${deleteItemButtonClassName + ' ' + 'btn close'}" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                                    <input type="checkbox" class="${checkboxClassName}" ${checkedStatus}>
                                </div>
                                <div class="${wrapperForInnerTextClassName}">${itemText}</div>
                            </li>`;
            htmlTags += template;
        }

        taskListUlNode.html("");
        taskListUlNode.append(htmlTags);
    }

    function repaintPagination(array = itemArray, activePage = 0) {
        if (!activePage) {   //falsy value, current page isn't set 
            activePage = getCurrentPageNumber(array);
        }

        let paginationTags = "";
        for (let page = 0; page < activePage; page++) {
            const template = `<li class="${paginationPageLinkClassName}">${page + 1}</li>`;
            paginationTags += template;
        }
 
        paginationPannel.html(paginationTags);
        setActiveStateForPage(activePage);
    }

    // !!!!!!!!!!!!!!!
    // function updateCounters() {
    //     const checkedTasks = _.filter(itemArray, item => { return item.checked });
    //     const uncheckedTasks = _.filter(itemArray, item => { return !item.checked});

    //     counterLabelAll.text(itemArray.length);
    //     counterLabelChecked.text(checkedTasks.length);
    //     counterLabelUnchecked.text(uncheckedTasks.length);
    // }

    addButton.click(function() {
        addTodo();
        repaintTags();
        repaintPagination();
        // updateCounters();
        return false;
    });

    inputField.keypress(function(e) {
        if (e.which === enterKey) {
            addTodo();
            repaintTags();
            repaintPagination();

            // updateCounters();
        }
    });

    $(document).on("change", '.'+checkboxClassName, function(e) {
        const chosenItemTag = e.target.parentElement.parentElement;
        const chosenItemIndex = parseInt(chosenItemTag.id);
        const foundedItem = _.find(itemArray, { id: chosenItemIndex });
        foundedItem.checked = foundedItem.checked? false : true;

        repaintTags();
        repaintPagination();
        // updateCounters();
    });

    chooseAllButton.click(function() {
        for (let index = 0; index < itemArray.length; index++) {
            itemArray[index].checked = true;
        }
        console.log(itemArray);

        repaintTags();
        repaintPagination();
        // updateCounters();
    });

    function deleteWithIndexUpdating(chosenItemIndex) {
        const foundedItem = _.find(itemArray, { id: chosenItemIndex });
        _.pull(itemArray, foundedItem);

        for (let index = 0; index < itemArray.length; index++) {
            itemArray[index].id = index;
        }
    }

    $(document).on("click", "."+deleteItemButtonClassName, function(e) {
        const chosenItemTag = e.target.parentElement.parentElement.parentElement;
        const chosenItemIndex = parseInt(chosenItemTag.id);

        deleteWithIndexUpdating(chosenItemIndex);

        repaintTags();
        repaintPagination();
        // updateCounters();
    });

    deleteAllButton.click(function() {
        itemArray = [];

        repaintTags();
        repaintPagination();
        // updateCounters();
    });

    $(document).on("dblclick", "."+wrapperForInnerTextClassName, function(e) {
        const chosenItemTag = e.target.parentElement;
        const chosenItemIndex = parseInt(chosenItemTag.id);
        const oldValue = e.target.innerText;
        
        const ghostInputFieldNodeTag = `<input class="${itemGhostInputFieldClassName}" type="text" value="${oldValue}" />`;
        $(chosenItemTag).html(ghostInputFieldNodeTag);

        $("."+itemGhostInputFieldClassName).focus();
    });

    $(document).on("keyup", "."+itemGhostInputFieldClassName, function(e) {
        if (e.which === enterKey) {
            const chosenItemTag = e.target.parentElement;
            const chosenItemIndex = parseInt(chosenItemTag.id);
            const newValue = $('.'+itemGhostInputFieldClassName).val();

            const foundedItem = _.find(itemArray, { id: chosenItemIndex });
            foundedItem.text = newValue;

            repaintTags();
            repaintPagination();
            // updateCounters();
        }
    });

    $(document).on("click", "."+tabsSwitchClassName, function(e) {
        const currentTab = e.target.innerHTML;

        if (currentTab === showCompletedTabName) {
            bufferedArray = _.filter(itemArray, item => { return item.checked });

        } else if (currentTab === showNotCompletedTabName) {
            bufferedArray = _.filter(itemArray, item => { return !item.checked });
        } else {
            bufferedArray = itemArray;
        }

        repaintTags(bufferedArray);
        repaintPagination(array = bufferedArray);
        // updateCounters();
    })

});