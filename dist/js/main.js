let changeDocumentTriggers = document.querySelector('.change-document-trigger');
DocViewerDocument.load('RFC2549').then((newDocument)=>{
    let sideBar = document.querySelector('#sidebar');
    sideBar.parentNode.insertBefore(newDocument.getElement(), sideBar.nextSibling);
});


/**================
 * Fonction helpers pour le bon fonctionnement du site
 =================*/
/**
 * Permet de charger un fichier via une XMLHTTP Request et une Promise
 * @param path
 */
function loadFileOnServer(path)
{
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function()
        {
            if (xhr.readyState === XMLHttpRequest.DONE) {
                if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                } else {
                    reject("Erreur lors de la récupération sur le serveur.");
                }
            }
        };
        xhr.open("GET", path, true);
        xhr.send();
    });
}
