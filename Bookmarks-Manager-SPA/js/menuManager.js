let selectedCategory = "";

function updateDropDownMenu(categories) {
    let DDMenu = $("#DDMenu");
    let selectClass = selectedCategory === "" ? "fa-check" : "fa-fw";
    DDMenu.empty();
    DDMenu.append($(`
        <div class="dropdown-item menuItemLayout" id="allCatCmd">
        <i class="menuIcon fa ${selectClass} mx-2"></i> Toutes les catégories
        </div>
    `));
    DDMenu.append($(`<div class="dropdown-divider"></div>`));
    categories.forEach(category => {
        selectClass = selectedCategory === category ? "fa-check" : "fa-fw";
        DDMenu.append($(`
            <div class="dropdown-item menuItemLayout category" id="allCatCmd">
            <i class="menuIcon fa ${selectClass} mx-2"></i> ${category}
            </div>
        `));
    })
    DDMenu.append($(`<div class="dropdown-divider"></div> `));
    DDMenu.append($(`
        <div class="dropdown-item menuItemLayout" id="aboutCmd">
        <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
        </div>
    `));
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });
    $('#allCatCmd').on("click", function () {
        selectedCategory = "";
        renderBookmarks();
    });
    $('.category').on("click", function () {
        selectedCategory = $(this).text().trim();
        renderBookmarks();
    });
}

function manageSelectedCategory(bookmarks) {
    if (!verifyIfSelectedCategoryExist(bookmarks))
        selectedCategory = "";
}

function verifyIfSelectedCategoryExist(bookmarks) {
    if (selectedCategory === "")
        return true;

    for (let i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].Category === selectedCategory)        
            return true;
    }
    return false;
}