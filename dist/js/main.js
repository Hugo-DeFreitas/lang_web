/*
On va venir jouer avec un spinner lors des chargements dynamiques du spinner et les promises pour une meilleure expérience utilisateur.
Toutefois, c'est tellement rapide qu'on ne risque de même pas le voir visuellement.
On ne sait jamais ce qui peut se passer avec les temps de réponse, donc cette fonctionnalité est quand même opérationnelle, ce qui
est plus user-friendly.
 */
let spinner = document.querySelector('#spinner');
let currentDocumentLoaded = 'RFC2549';

/*
Si l'utilisateur souhaite télécharger la source du document actuel au format JSON
 */
let downloadDocumentButton = document.querySelector('#download-current-document-as-json');
downloadDocumentButton.addEventListener('click',()=>{
    console.log("User downloaded source");
    downloadSourceFileInBrowserForUser();
});

//On charge le document avec l'ID correct pour l'initialisation de la page.
spinner.removeAttribute('hidden');

DocViewerDocument.load(currentDocumentLoaded).then((newDocument)=>{
    spinner.setAttribute('hidden','');
    let sideBar = document.querySelector('#sidebar');
    sideBar.parentNode.insertBefore(newDocument.getElement(), sideBar.nextSibling);
    initHandlers();
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

function downloadSourceFileInBrowserForUser() {
    loadFileOnServer('src/json/'+currentDocumentLoaded+'.json').then((result)=>{
        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(JSON.stringify(result)));
        element.setAttribute('download', currentDocumentLoaded+'.json');
        element.setAttribute('hidden','');
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    });
}

function initHandlers() {
    console.log("Initializing handlers");
    //On vient activer les clicks handlers pour changer de document
    let changeDocumentTriggers = document.getElementsByClassName('change-document-trigger');
    for (let elementTriggered of changeDocumentTriggers) {
        elementTriggered.addEventListener('click',function(e){
            spinner.removeAttribute('hidden');
            let self = e.target;
            let sideBar = document.querySelector('#sidebar');
            let documentToLoadID = self.dataset.document_source_json_name;

            //On va venir supprimer le corps du document et mettre un spinner le temps de charger l'élément.
            let currentDocumentElement = document.querySelector('main');
            //Pour économiser des allers-retours avec le serveur, on va dans un premier temps uniquement cacher le document actuel.
            //Si on aura réussi toute la procédure de chargement du prochain document, alors on pourra réellement venir supprimer du dom cet élément
            currentDocumentElement.style.display = 'none';

            //On vient récupérer le prochain JSON sur le serveur.
            DocViewerDocument.load(documentToLoadID)
            //Si la promise renvoit un résultat positif
                .then((newDocument)=>{
                    currentDocumentElement.parentNode.removeChild(currentDocumentElement);
                    sideBar.parentNode.insertBefore(newDocument.getElement(), sideBar.nextSibling);
                    currentDocumentLoaded = 'RFC'+newDocument.id;
                    initHandlers();
                })
                //Si ça s'est mal passé, on a juste a rendre l'ancien document visible à nouveau.
                .catch(()=>{
                    currentDocumentElement.style.display = '';
                })
                //Quoiqu'il arrive, on enlève le spinner.
                .finally(()=>{spinner.setAttribute('hidden','');});
        });
    }
}