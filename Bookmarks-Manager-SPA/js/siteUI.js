//Marc-Antoine Bouchard Groupe:02

let contentScrollPosition = 0;
Init_UI();

function Init_UI() {
    renderBookmarks();
    $('#createBookmark').on("click", async function () {
        saveContentScrollPosition();
        renderCreateBookmarkForm();
    });
    $('#abort').on("click", async function () {
        renderBookmarks();
    });
    $('#aboutCmd').on("click", function () {
        renderAbout();
    });
}

function renderAbout() {
    saveContentScrollPosition();
    eraseContent();
    $("#createBookmark").hide();
    $("#abort").show();
    $("#actionTitle").text("À propos...");
    $("#content").append(
        $(`
            <div class="aboutContainer">
                <h2>Gestionnaire de favoris</h2>
                <hr>
                <p>
                    Application de gestion de favoris
                </p>
                <p>
                    Auteur: Marc-Antoine Bouchard et Nicolas Chourot
                </p>
                <p>
                    Collège Lionel-Groulx, automne 2024
                </p>
            </div>
        `))
}

//La fonction renderBookmarks permet d'afficher les informations de tous les favoris à l'utilisateur
async function renderBookmarks() {
    showWaitingGif();
    $("#actionTitle").text("Liste des favoris");        //Gestion de l'affichage
    $("#createBookmark").show();                        //Gestion de l'affichage
    $("#abort").hide();                                 //Gestion de l'affichage
    let bookmarks = await API_GetBookmarks();   

    eraseContent();
    if (bookmarks !== null) {
        let categories = [];
        bookmarks.forEach(bookmark => {
            if (bookmark.Category === selectedCategory || selectedCategory === "")
                $("#content").append(renderBookmark(bookmark));
            if (!categories.includes(bookmark.Category))
                categories.push(bookmark.Category);
        });
        updateDropDownMenu(categories);
        restoreContentScrollPosition();
        // Attached click events on command icons
        $(".editCmd").on("click", function () {
            saveContentScrollPosition();
            renderEditBookmarkForm(parseInt($(this).attr("editBookmarkId")));
        });
        $(".deleteCmd").on("click", function () {
            saveContentScrollPosition();
            renderDeleteBookmarkForm(parseInt($(this).attr("deleteBookmarkId")));
        });
        $(".bookmarkRow").on("click", function (e) { e.preventDefault(); })
    } else {
        renderError("Service introuvable");
    }
}
function showWaitingGif() { //Permet d'afficher le gif d'attente
    $("#content").empty();
    $("#content").append($("<div class='waitingGifcontainer'><img class='waitingGif' src='Loading_icon.gif' /></div>'"));
}
//La fonction eraseContent permet de supprimer le contenu du div ayant le id content.
function eraseContent() {
    $("#content").empty();
}
//La fonction saveContentScrollPosition permet de sauvegarder la position du scroll pour le div ayant le id "content"
function saveContentScrollPosition() {
    contentScrollPosition = $("#content")[0].scrollTop;
}
//La fonction restoreContentScrollPosition permet d'ajuster le scroll vertical du div ayant le id "content"
function restoreContentScrollPosition() {
    $("#content")[0].scrollTop = contentScrollPosition;
}
//La fonction renderError permet de gérer l'affichage d'un message d'erreur
function renderError(message) {
    eraseContent();
    $("#content").append(
        $(`
            <div class="errorContainer">
                ${message}
            </div>
        `)
    );
}
//La fonction renderCreateBookmarkForm permet d'afficher un formulaire de création de favoris à l'utilisateur.
function renderCreateBookmarkForm() {
    renderBookmarkForm();
}
//La fonction renderEditBookmarkForm permet de gérer l'affichage du formulaire de modification d'un favori.
async function renderEditBookmarkForm(id) {
    showWaitingGif();
    let bookmark = await API_GetBookmark(id);
    if (bookmark !== null)
        renderBookmarkForm(bookmark);
    else
        renderError("Favori introuvable!");
}
async function renderDeleteBookmarkForm(id) {
    showWaitingGif();
    $("#createBookmark").hide(); //On cache l'icon pour ajouter un favori
    $("#abort").show(); //On affiche l'icon pour annuler l'action courante et retourner à la page d'accueil
    $("#actionTitle").text("Retrait");
    let bookmark = await API_GetBookmark(id); //Obtenir les informations sur le favori que l'on veut effacer
    eraseContent();
    if (bookmark !== null) { 
        $("#content").append(`
        <div class="bookmarkdeleteForm">
            <h4>Effacer le favori suivant?</h4>
            <br>
            <div class="bookmarkRow" bookmark_id=${bookmark.Id}">
                <div class="bookmarkContainer">
                    <div class="bookmarkLayout">
                        <div>${GetFavicon(bookmark.Url, "favicon")}</div>
                        <div class="bookmarkTitle">${bookmark.Title}</div>
                        <div class="bookmarkCategory">${bookmark.Category}</div>
                    </div>
                </div>  
            </div>   
            <br>
            <input type="button" value="Effacer" id="deleteBookmark" class="btn btn-primary">
            <input type="button" value="Annuler" id="cancel" class="btn btn-secondary">
        </div>    
        `);
        $('#deleteBookmark').on("click", async function () {
            showWaitingGif();
            let result = await API_DeleteBookmark(bookmark.Id);
            if (result)            
                renderBookmarks();            
            else
                renderError("Une erreur est survenue!");
        });
        $('#cancel').on("click", function () {
            renderBookmarks();
        });
    } else {
        renderError("Favori introuvable!");
    }
}

//La fonction newBookmark crée un objet favori vide.
function newBookmark() {
    bookmark = {};
    bookmark.Id = 0;
    bookmark.Title = "";
    bookmark.Url = "";
    bookmark.Category = "";
    return bookmark;
}

//La fonction renderBookmarkForm permet d'afficher un formulaire de modification ou de création de favoris.
function renderBookmarkForm(bookmark = null) {
    $("#createBookmark").hide();
    $("#abort").show();
    eraseContent();
    let create = bookmark == null; //Si bookmark est null ont crée un nouveau favori
    let favicon = "";
    if (create) {
        bookmark = newBookmark();
        favicon ='<img src="bookmark-star-logo.svg" class="appLogo" alt="Favicon">';
    }
    else {
        favicon = GetFavicon(bookmark.Url, "favicon_CreateUpdate", true); 
    }
    $("#actionTitle").text(create ? "Création" : "Modification");
    $("#content").append(`
        <form class="form" id="bookmarkForm">
            <input type="hidden" name="Id" value="${bookmark.Id}"/>
            <span id="showFavicon" class="spanFavicon_CreateUpdate">${favicon}</span>
            <label for="Title" class="form-label">Titre </label>
            <input 
                class="form-control Alpha"
                name="Title" 
                id="Title" 
                placeholder="Titre"
                required
                RequireMessage="Veuillez entrer un titre"
                InvalidMessage="Le titre comporte un caractère illégal" 
                value="${bookmark.Title}"
            />
            <label for="Url" class="form-label">Url </label>
            <input
                class="form-control URL"
                name="Url"
                id="Url"
                placeholder="Url"
                required
                RequireMessage="Veuillez entrer un url" 
                InvalidMessage="Veuillez entrer un url valide"
                value="${bookmark.Url}" 
            />
            <label for="Category" class="form-label">Catégorie </label>
            <input 
                class="form-control Alpha"
                name="Category"
                id="Category"
                placeholder="Catégorie"
                required
                RequireMessage="Veuillez entrer une catégorie" 
                InvalidMessage="La catégorie comporte un caractère illégal"
                value="${bookmark.Category}"
            />
            <hr>
            <input type="submit" value="Enregistrer" id="saveBookmark" class="btn btn-primary">
            <input type="button" value="Annuler" id="cancel" class="btn btn-secondary">
        </form>
    `);
    initFormValidation();
    $('#bookmarkForm').on("submit", async function (event) {
        event.preventDefault();
        let bookmark = getFormData($("#bookmarkForm"));
        bookmark.Id = parseInt(bookmark.Id); //On remet le id en int (quand on est allé chercher les informations du formulaire, le id était alors un string)
        showWaitingGif();
        let result = await API_SaveBookmark(bookmark, create);
        if (result)        
            renderBookmarks();        
        else
            renderError("Une erreur est survenue!");
    });
    $('#cancel').on("click", function () {
        renderBookmarks();
    });
    $('#Url').change(function() {
        let valInput = $('#Url').val();
        if (valInput !== "")
            $('#showFavicon').html(GetFavicon(valInput, "favicon_CreateUpdate", false));
        else
            $('#showFavicon').html('<img src="bookmark-star-logo.svg" class="appLogo" alt="Favicon">');
    });
}

function getFormData($form) {
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    return jsonObject;
}

//La fonction renderBookmark permet de retourner un div affichant les informations d'un favori.
function renderBookmark(bookmark) { 
    return $(`
     <div class="bookmarkRow" bookmark_id=${bookmark.Id}">
        <div class="bookmarkContainer noselect">
            <div class="bookmarkLayout">
                <div>${GetFavicon(bookmark.Url, "favicon", false)}</div>
                <span class="bookmarkTitle">${bookmark.Title}</span>
                <span class="bookmarkCategory">${bookmark.Category}</span>
            </div>
            <div class="bookmarkCommandPanel">
                <span class="editCmd cmdIcon fa fa-pencil" editBookmarkId="${bookmark.Id}" title="Modifier ${bookmark.Title}"></span>
                <span class="deleteCmd cmdIcon fa fa-trash" deleteBookmarkId="${bookmark.Id}" title="Effacer ${bookmark.Title}"></span>
            </div>
        </div>
    </div>           
    `);
}