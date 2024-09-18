//Marc-Antoine Bouchard Groupe:02

function GetFavicon(url, nameClass, isContainLink = true) {

    if (isContainLink)
        return $(`
                <span><a href="${url}" target="_blank"><img class="${nameClass}" src="http://www.google.com/s2/favicons?sz=64&domain=${url}" alt="favicon"></a></span> 
        `).html();
    else
        return $(`
                <span><img class="${nameClass}" src="http://www.google.com/s2/favicons?sz=64&domain=${url}" alt="favicon"></span> 
        `).html();    
}