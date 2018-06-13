const taskListUlNode = $("#task_list");
const inputField = $("#form_input");
const addButton = $("#add_button");
const deleteAllButton = $("#delete_all_button");
const chooseAllButton = $("#choose_all_button");
const counterLabelAll = $("#counter_label_all");
const counterLabelChecked = $("#counter_label_checked");
const counterLabelUnchecked = $("#counter_label_unchecked");
const paginationPannel = $("#pagination_panel");

const itemClassName = "tasks__item";
const defaultStatusClassName = "";
const doneStatusClassName = "content__text_done";
const labelForActionsClassName = "item__label";
const deleteItemButtonClassName = "item__delete";
const wrapperForInnerTextClassName = "item__textwrapper";
const checkboxClassName = "item__checkbox";
const itemGhostInputFieldClassName = "item__ghost";
const paginationPageLinkClassName = "pagination__link";
const tabsSwitchClassName = "tabs__link";
const counterValueClassName = "counter__value";
const contentTextClassName = "content__text";

const showCompletedTabName = "Completed";
const showNotCompletedTabName = "Not completed";

const currentPageId = "current_page";
const currentTabId = "current_tab";

const enterKey = 13;
const defaultPage = 1;
const itemsOnOnePageCount = 5;

let itemArray = Array();
let bufferedArray = Array();
let index = 0;

function getCurrentPage(array) {
   return Math.ceil(array.length / itemsOnOnePageCount);
}

function getCurrentPageByElementId(itemIndex = 0) {
    const currentPage = itemIndex ? (itemIndex + 1) / itemsOnOnePageCount : defaultPage;
    return Math.ceil(currentPage);
}

function setActiveStateForPage(pageNumber) {
    const pageNodes = $("."+paginationPageLinkClassName);
    for (const tabNode of pageNodes) {
        if (tabNode.hasAttribute("id")) {
            tabNode.removeAttribute("id");
        }
        if (tabNode.textContent === pageNumber.toString()) {
            tabNode.setAttribute("id", currentPageId);
        }
    }
}

function getPartOfArrayForPagination(pageNumber) {
    const startIndex = itemArray.length - (itemArray.length - itemsOnOnePageCount * (pageNumber - 1));
    let endIndex = startIndex + itemsOnOnePageCount;

    if (endIndex >= itemArray.length) {
        endIndex = itemArray.length;
    }
    return _.slice(itemArray, startIndex, endIndex);
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
            const finalSelectorForTag = itemClassName + " "  + " mb-3";
            const template = `<li id="${itemIndex}" class="${finalSelectorForTag}">
                                <div class="${labelForActionsClassName + " input-group-prepend"}">
                                    <button type="button" class="${deleteItemButtonClassName + " btn btn-danger"}">Delete</button>
                                    <input type="checkbox" class="${checkboxClassName}" ${checkedStatus}>
                                </div>
                                <div class="${contentTextClassName + " " + taskStatusSelector}">
                                    <div class="${wrapperForInnerTextClassName}">${itemText}</div>
                                </div>
                            </li>`;
            htmlTags += template;
        }
        taskListUlNode.html("");
        taskListUlNode.append(htmlTags);
    }

    function repaintPagination(array = itemArray, activePage = 0) {
        if (!activePage) {   //falsy value, current page isn't set 
            activePage = getCurrentPage(array);
        }
        let paginationTags = "";
        for (let page = 0; page < activePage; page++) {
            const template = `<li class="${paginationPageLinkClassName}">${page + 1}</li>`;
            paginationTags += template;
        }
        paginationPannel.html(paginationTags);
        setActiveStateForPage(activePage);
    }

    function updateCounters() {
        const checkedTasks = _.filter(itemArray, item => { return item.checked; });
        const uncheckedTasks = _.filter(itemArray, item => { return !item.checked; });

        counterLabelAll.children("."+counterValueClassName).text(itemArray.length);
        counterLabelChecked.children("."+counterValueClassName).text(checkedTasks.length);
        counterLabelUnchecked.children("."+counterValueClassName).text(uncheckedTasks.length);
    }

    addButton.click(function() {
        addTodo();
        const activePage = getCurrentPage(itemArray);
        bufferedArray = getPartOfArrayForPagination(activePage);

        repaintTags(bufferedArray);
        repaintPagination(itemArray, 0);
        updateCounters();
        return false;
    });

    inputField.keypress(function(e) {
        if (e.which === enterKey) {
            addTodo();
            const activePage = getCurrentPage(itemArray);
            bufferedArray = getPartOfArrayForPagination(activePage);

            repaintTags(bufferedArray);
            repaintPagination(itemArray, 0);
            updateCounters();
        }
    });

    $(document).on("change", "."+checkboxClassName, function(e) {
        const chosenItemTag = e.target.parentElement.parentElement;
        const chosenItemIndex = parseInt(chosenItemTag.id);
        const foundedItem = _.find(itemArray, { id: chosenItemIndex });
        // foundedItem.checked = foundedItem.checked? false : true;
        foundedItem.checked = !foundedItem.checked;

        const activePage = getCurrentPageByElementId(chosenItemIndex);
        bufferedArray = getPartOfArrayForPagination(activePage);

        repaintTags(bufferedArray);
        repaintPagination(itemArray, 0);
        updateCounters();
    });

    chooseAllButton.click(function() {
        for (let index = 0; index < itemArray.length; index++) {
            itemArray[index].checked = true;
        }
        const activePage = getCurrentPage(itemArray);
        bufferedArray = getPartOfArrayForPagination(activePage);

        repaintTags(bufferedArray);
        repaintPagination(itemArray, 0);
        updateCounters();
    });

    function deleteWithIndexUpdating(chosenItemIndex) {
        const foundedItem = _.find(itemArray, { id: chosenItemIndex });
        _.pull(itemArray, foundedItem);
        for (let index = 0; index < itemArray.length; index++) {
            itemArray[index].id = index;
        }
    }

    $(document).on("click", "."+deleteItemButtonClassName, function(e) {
        const chosenItemTag = e.target.parentElement.parentElement;
        console.log(chosenItemTag);
        const chosenItemIndex = parseInt(chosenItemTag.id);
        console.log(itemArray);
        deleteWithIndexUpdating(chosenItemIndex);
        console.log(itemArray);

        const activePage = getCurrentPageByElementId(chosenItemIndex);
        bufferedArray = getPartOfArrayForPagination(activePage);
        console.log(bufferedArray);

        repaintTags(bufferedArray);
        repaintPagination(itemArray, 0);
        updateCounters();
    });

    deleteAllButton.click(function() {
        itemArray = [];

        repaintTags();
        repaintPagination();
        updateCounters();
    });

    $(document).on("dblclick", "."+wrapperForInnerTextClassName, function(e) {
        const chosenItemTag = e.target.parentElement;
        const oldValue = e.target.innerText;
        const ghostInputFieldNodeTag = `<input class="${itemGhostInputFieldClassName}" type="text" value="${oldValue}" />`;
        $(chosenItemTag).html(ghostInputFieldNodeTag);

        $("."+itemGhostInputFieldClassName).focus();
    });

    $(document).on("keyup", "."+itemGhostInputFieldClassName, function(e) {
        if (e.which === enterKey) {
            const chosenItemTag = e.target.parentElement.parentElement;
            const chosenItemIndex = parseInt(chosenItemTag.id);
            const newValue = $("."+itemGhostInputFieldClassName).val();
            const foundedItem = _.find(itemArray, { id: chosenItemIndex });
            foundedItem.text = newValue;

            const activePage = getCurrentPageByElementId(chosenItemIndex);
            bufferedArray = getPartOfArrayForPagination(activePage);

            repaintTags(bufferedArray);
            repaintPagination(itemArray, 0);
            updateCounters();
        }
    });

    $(document).on("click", "."+tabsSwitchClassName, function(e) {
        const currentTab = e.target;
        const currentTabValue = currentTab.innerHTML;
        if (currentTabValue === showCompletedTabName) {
            bufferedArray = _.filter(itemArray, item => { return item.checked; });
        } else if (currentTabValue === showNotCompletedTabName) {
            bufferedArray = _.filter(itemArray, item => { return !item.checked; });
        } else {
            bufferedArray = itemArray;
        }

        const activePage = getCurrentPage(bufferedArray);
        const arrayForTabs = getPartOfArrayForPagination(activePage);

        const activeTab = $("#"+currentTabId);
        if (currentTabValue !== activeTab.innerHTML) {
            activeTab.removeAttr("id");
            currentTab.setAttribute("id", currentTabId);
        }

        repaintTags(arrayForTabs);
        repaintPagination(itemArray, 0);
        updateCounters();
    });

    $(document).on("click", "."+paginationPageLinkClassName, function(e) {
        const currentTab = e.target.innerHTML;
        const activePage = parseInt(currentTab);
        const arrayForTabs = getPartOfArrayForPagination(activePage);

        repaintTags(arrayForTabs);
        repaintPagination(itemArray, 0);
        setActiveStateForPage(activePage);
        updateCounters();
    });


});