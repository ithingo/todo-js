const enterKey = 13;
const defaultPage = 1;
const itemsOnOnePageCount = 5;
let itemArray = Array();
let index = 0;

$(function() {
    const formInput = $("#form_input");
    formInput.focus();

    function addTodo() {
        const text = formInput.val().trim();
        if (text) {
            const newObject = {
                id: index,
                text: text,
                checked: false,
            };
            itemArray.push(newObject);
            index += 1;
            formInput.val("");
            render("last");
        }
    }

    function getFilteredArray() {
        const currentTabValue = $(".tabs__link.active").attr("id");

        if (currentTabValue === "all") {
            return itemArray;
        } else {
            const checked = (currentTabValue === "completed") ? true : false;
            return itemArray.filter((item) => { return item.checked === checked;});
        }
    }

    function repaintPagination(activePage, array = itemArray) {
        const pages = Math.ceil(array.length / itemsOnOnePageCount);
        let currentPage = defaultPage;
        if (activePage) {
            currentPage = (activePage === "last") ? pages : activePage;
        } else {
            currentPage = +$(".pagination__link.pagination__link_active").attr("id");
        }

        if (currentPage > pages) {
            currentPage = pages;
        }

        let paginationTags = "";
        for (let page = 1; page <= pages; page++) {
            const className = (page === currentPage) ? "pagination__link pagination__link_active" : "pagination__link"
            paginationTags += `<li class="${className}" id="${page}">${page}</li>`;
        }

        $("#pagination_panel").html(paginationTags);
        return currentPage;
    }

    function getPartOfArrayForPagination(pageNumber, array = itemArray) {
        const startIndex = array.length - (array.length - itemsOnOnePageCount * (pageNumber - 1));
        let endIndex = startIndex + itemsOnOnePageCount;

        if (endIndex >= array.length) {
            endIndex = array.length;
        }
        return _.slice(array, startIndex, endIndex);
    }

    function repaintTags(array = itemArray) {
        let htmlTags = "";

        array.forEach(function(item) {
            const { id: itemIndex, text: itemText, checked: itemChecked } = item;

            const taskStatusClass = itemChecked ? "content__text_done" : "";
            const checkedStatus = itemChecked ? "checked" : "";

            const template = `<li id="${itemIndex}" class="${"tasks__item" + " "  + " mb-3"}">
                                <div class="${"item__label" + " input-group-prepend"}">
                                    <button type="button" class="${"item__delete" + " btn btn-danger"}">Delete</button>
                                    <input type="checkbox" class="item__checkbox" ${checkedStatus}>
                                </div>
                                <div class="${"content__text" + " " + taskStatusClass}">
                                    <div class="item__textwrapper">${itemText}</div>
                                </div>
                            </li>`;

            htmlTags += template;
        });
        const taskList = $("#task_list");
        taskList.html("");
        taskList.append(htmlTags);
    }

    function updateCounters() {
        const checkedTasks = _.filter(itemArray, item => { return item.checked; }).length;
        const allTasks = itemArray.length;
        const uncheckedTasks = allTasks - checkedTasks;

        const counterLabelAll = $("#counter_label_all");
        const counterLabelChecked = $("#counter_label_checked");
        const counterLabelUnchecked = $("#counter_label_unchecked");

        counterLabelAll.siblings(".counter__value").attr("id", allTasks);
        counterLabelChecked.siblings(".counter__value").attr("id", checkedTasks);
        counterLabelUnchecked.siblings(".counter__value").attr("id", uncheckedTasks);

        counterLabelAll.siblings(".counter__value").text(allTasks);
        counterLabelChecked.siblings(".counter__value").text(checkedTasks);
        counterLabelUnchecked.siblings(".counter__value").text(uncheckedTasks);

        const checked = !!(checkedTasks && checkedTasks === allTasks);
        $("#select_all").prop("checked", checked);

    }

    function render(page) {
        let currentArray = getFilteredArray();
        const currentPage = repaintPagination(page, currentArray);
        currentArray = getPartOfArrayForPagination(currentPage, currentArray);
        repaintTags(currentArray);
        updateCounters();
    }

    function updateItemIndexes() {
        itemArray.forEach(function(item, index) {
            item.id = index;
        });
    }

    function getSelectedItemIndex(e) {
        const chosenItemTag = e.target.parentElement.parentElement;
        return parseInt(chosenItemTag.id);
    }

    function checkboxEventHandler(e) {
        const chosenItemIndex = getSelectedItemIndex(e);
        const foundedItem = _.find(itemArray, { id: chosenItemIndex });
        foundedItem.checked = !foundedItem.checked;

        render();
    }

    function changeItemsState(state) {
        itemArray.forEach(function(item) {
            item.checked = state;
        });
    }

    function selectAllEventHandler(e) {
        const itemsStatus = e.target.checked;
        changeItemsState(itemsStatus);

        render();
    }

    function deleteChoseItemByIndex(chosenItemIndex) {
        const foundedItem = _.find(itemArray, { id: chosenItemIndex });
        _.pull(itemArray, foundedItem);
    }

    function deleteItemEventHandler(e) {
        const chosenItemIndex = getSelectedItemIndex(e);

        deleteChoseItemByIndex(chosenItemIndex);
        updateItemIndexes();

        render();
    }

    function deleteAllEventHandler() {
        const checkedItems = _.filter(itemArray, item => { return item.checked; });
        itemArray = _.differenceWith(itemArray, checkedItems, _.isEqual);

        render();
    }

    function doubleClickEventHandler(e) {
        const chosenItemTag = e.target.parentElement;
        const oldValue = e.target.innerText;

        $(chosenItemTag).html(`<input class="item__ghost" type="text" value="${oldValue}" />`);
        $(".item__ghost").focus();
    }

    function updateWithGhostInput(e) {
        const chosenItemIndex = getSelectedItemIndex(e);
        const foundedItem = _.find(itemArray, { id: chosenItemIndex });

        const oldValue = foundedItem.text;
        const newValue = $(".item__ghost").val().trim();
        foundedItem.text = newValue ? newValue : oldValue;

        render();
    }

    function switchBetweenTabs(e) {
        $(".tabs__link.active").removeClass("active");
        $(this).addClass("active");

        render(1);
    }

    function paginationSwitcher() {
        $(".pagination__link.pagination__link_active").removeClass("pagination__link_active");
        $(this).addClass("pagination__link_active");

        render();
    }

    $("#add_button").click(function() {
        addTodo();
    });

    $("#form_input").keypress(function(e) {
        if (e.which === enterKey) {
            addTodo();
        }
    });

    $("#select_all").change(function(e) {
        selectAllEventHandler(e);
    });

    $("#delete_all_button").click(deleteAllEventHandler);

    $(document).on("change", ".item__checkbox", function(e) {
        checkboxEventHandler(e);
    });

    $(document).on("click", ".item__delete", function(e) {
        deleteItemEventHandler(e);
    });

    $(document).on("dblclick", ".item__textwrapper", function(e) {
       doubleClickEventHandler(e);
    });

    $(document).on("keyup", ".item__ghost", function(e) {
        if (e.which === enterKey) {
            updateWithGhostInput(e);
        }
    });

    $(document).on("blur", ".item__ghost", function(e) {
        updateWithGhostInput(e);
    });

    $(document).on("click", ".tabs__link", switchBetweenTabs);

    $(document).on("click", `.pagination__link`, paginationSwitcher);
});