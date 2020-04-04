const Items = (function () {
    const Item = function (id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    };
    const allItems = {
        items: [],
        totalCalories: 0,
        currentItem: null
    };
    let { items, totalCalories, currentItem } = allItems;
    return {
        getItems: function () {
            return items;
        },
        getInputs: function (name, calories) {
            calories = parseFloat(calories);
            let ID;
            if (items.length > 0) {
                ID = items[items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            const newItem = new Item(ID, name, calories);
            items.push(newItem);
            return newItem;
        },
        totalCalories: function () {
            let total = 0;
            items.forEach(item => {
                total += parseInt(item.calories);
            });
            totalCalories = total;
            return totalCalories;
        },
        setCurrentItem: function (id) {
            items.forEach(item => {
                if (item.id == id) {
                    currentItem = item;
                }
            });
            return currentItem;
        },
        clearCurrentItem: function () {
            currentItem = null;
        },
        updateLi: function (name, calories) {
            items.forEach(item => {
                if (item.id === currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                }
            });
        },
        removeItem: function (id) {
            items = items.filter(item => item.id !== id);
        },
        removeAllItems: function () {
            return items = [];
        }
    };
})();

const StructureApp = (function () {
    const DOMElements = {
        ul: "#item-list",
        addBtn: ".add-btn",
        updateBtn: ".update-btn",
        deleteBtn: ".delete-btn",
        backBtn: ".back-btn",
        inputName: "#item-name",
        inputCalories: "#item-calories",
        caloriesSpan: ".total-calories",
        dellAllBtn: ".clear-btn"
    };
    return {
        displayItems: function (items) {
            let html = "";
            items.forEach(item => {
                html += `
                <li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil-alt"></i>
                </a>
                </li>
                `;
            });
            document.querySelector(DOMElements.ul).innerHTML = html;
        },
        getInputsValue: function () {
            return {
                name: document.querySelector(DOMElements.inputName).value,
                calories: document.querySelector(DOMElements.inputCalories).value,
            };
        },
        getDOMElements: function () {
            return DOMElements;
        },
        displayAddItem: function (item) {
            const li = document.createElement("li");
            li.classList.add("collection-item");
            li.id = `item-${item.id}`;
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil-alt"></i>
                </a>
            `;
            document.querySelector(DOMElements.ul).insertAdjacentElement('beforeend', li);
        },
        hideButtons: function () {
            document.querySelector(DOMElements.addBtn).style.display = "inline";
            document.querySelector(DOMElements.updateBtn).style.display = "none";
            document.querySelector(DOMElements.deleteBtn).style.display = "none";
            document.querySelector(DOMElements.backBtn).style.display = "none";
        },
        displayButtons: function () {
            document.querySelector(DOMElements.addBtn).style.display = "none";
            document.querySelector(DOMElements.updateBtn).style.display = "inline";
            document.querySelector(DOMElements.deleteBtn).style.display = "inline";
            document.querySelector(DOMElements.backBtn).style.display = "inline";
        },
        clearInputs: function () {
            document.querySelector(DOMElements.inputName).value = "";
            document.querySelector(DOMElements.inputCalories).value = "";
        },
        backToInput: function (item) {
            document.querySelector(DOMElements.inputName).value = item.name;
            document.querySelector(DOMElements.inputCalories).value = item.calories;
        },
        hideListUl: function () {
            document.querySelector(DOMElements.ul).style.display = "none";
        },
        disableEnterBtn: function () {
            document.addEventListener("keydown", function (e) {
                if (e.keyCode === 13) {
                    e.preventDefault();
                }
            });
        },
        displayCalories: function (calories) {
            document.querySelector(DOMElements.caloriesSpan).innerText = calories;
        }
    };
})();

const App = (function (Items, StructureApp) {
    const items = Items.getItems();
    const DOMElements = StructureApp.getDOMElements();

    const clickAddBtn = function (e) {
        e.preventDefault();
        const inputsValue = StructureApp.getInputsValue();
        if (inputsValue.name !== "" && inputsValue.calories !== "") {
            document.querySelector(DOMElements.ul).style.display = "block";
            const item = Items.getInputs(inputsValue.name, inputsValue.calories);
            StructureApp.displayAddItem(item);
            const calories = Items.totalCalories();
            StructureApp.displayCalories(calories);
            StructureApp.clearInputs();
        }
    };
    const updateItem = function (e) {
        if (e.target.classList.contains("edit-item")) {
            const itemId = e.target.parentNode.parentNode.id;
            const id = itemId.split("-")[1];
            const currentItem = Items.setCurrentItem(id);
            StructureApp.backToInput(currentItem);
            StructureApp.displayButtons();
            StructureApp.disableEnterBtn();
        }
    };
    const updateLiValue = function (e) {
        const item = StructureApp.getInputsValue();
        if (item.name === "" || item.calories === "") return;
        Items.updateLi(item.name, item.calories);
        StructureApp.displayItems(Items.getItems());
        StructureApp.clearInputs();
        const calories = Items.totalCalories();
        StructureApp.displayCalories(calories);
        StructureApp.hideButtons();
    };
    const clearInputsValue = function () {
        StructureApp.clearInputs();
    };
    const deleteLi = function (e) {
        e.preventDefault();
        const item = Items.setCurrentItem();
        const id = item.id;
        Items.removeItem(id);
        const calories = Items.totalCalories();
        StructureApp.displayCalories(calories);
        StructureApp.displayItems(Items.getItems());
        StructureApp.clearInputs();
        StructureApp.hideButtons();
    };
    const deleteAllItems = function () {
        const items = Items.removeAllItems();
        console.log(items);

        StructureApp.displayItems(items);
        const calories = Items.totalCalories();
        StructureApp.displayCalories(calories);
    };

    document.querySelector(DOMElements.ul).addEventListener("click", updateItem);
    document.querySelector(DOMElements.updateBtn).addEventListener("click", updateLiValue);
    document.querySelector(DOMElements.backBtn).addEventListener("click", clearInputsValue);
    document.querySelector(DOMElements.deleteBtn).addEventListener("click", deleteLi);
    document.querySelector(DOMElements.dellAllBtn).addEventListener("click", deleteAllItems);

    const addBtnListener = function () {
        document.querySelector(DOMElements.addBtn).addEventListener("click", clickAddBtn)
    }

    return {
        init: function () {
            StructureApp.displayItems(items);
            addBtnListener();
            StructureApp.hideButtons();
            StructureApp.hideListUl();
        }
    }
})(Items, StructureApp);

App.init();