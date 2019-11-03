const ALL_DOCUMENTS_AVAILABLE = ['RFC1149','RFC2549','RFC6214'];
let currentDocumentLoaded = ALL_DOCUMENTS_AVAILABLE[0];//On charge un document aléatoire
let currentDocument = null;
/*
On va venir jouer avec un spinner lors des chargements dynamiques du spinner et les promises pour une meilleure expérience utilisateur.
Toutefois, c'est tellement rapide qu'on ne risque de même pas le voir visuellement.
On ne sait jamais ce qui peut se passer avec les temps de réponse, donc cette fonctionnalité est quand même opérationnelle, ce qui
est plus user-friendly.
 */
let spinner = document.querySelector('#spinner');

/*
Utilisation de la searchbar, en lien avec les tags associés aux différents documents.
*/
let searchForm = document.querySelector('#search-form');
let searchEngineResults = document.querySelector('#search-engine-results');
console.log('searchEngineResults',searchEngineResults);
searchForm.addEventListener("submit", function(evt) {
    evt.preventDefault();
    //On vide la barre de recherche
    while (searchEngineResults.firstChild) {
        searchEngineResults.removeChild(searchEngineResults.firstChild);
    }
    let searchBar = document.querySelector('#search-tags');
    let resultCounter = 0;
    let promiseDocumentSearchArr = [];
    console.log("User validated search with value : ",searchBar.value);
    for(let i = 0; i < ALL_DOCUMENTS_AVAILABLE.length; ++i){
        let docID = ALL_DOCUMENTS_AVAILABLE[i];
        promiseDocumentSearchArr[i] = DocViewerDocument.load(docID);
    }
    Promise.all(promiseDocumentSearchArr).then((documentsLoaded)=>{
        for(let documentLoaded of documentsLoaded){
            //Si la valeur commence par '#', on cherche uniquement dans les tags. Sinon c'est une recherche globale.
            if(searchBar.value.startsWith("#")){
                if(deepFind(documentLoaded.tags,searchBar.value.replace(/[#]+/g,''))){
                    searchEngineResults
                        .appendChild(createElementFromHTML(`<li class="uk-modal-close"><a data-document_source_json_name="RFC${documentLoaded.id}" class="change-document-trigger"><span class="uk-text-primary">RFC${documentLoaded.id}</span> - ${documentLoaded.title}</a></li>`));
                    ++resultCounter;
                }
            }
            else {
                if(deepFind(documentLoaded,searchBar.value)){
                    searchEngineResults
                        .appendChild(createElementFromHTML(`<li class="uk-modal-close"><a data-document_source_json_name="RFC${documentLoaded.id}" class="change-document-trigger"><span class="uk-text-primary">RFC${documentLoaded.id}</span> - ${documentLoaded.title}</a></li>`));
                    ++resultCounter;
                }
            }
        }
        if(resultCounter===0){
            UIkit.notification({
                message: 'No results were found for the research : "'+searchBar.value   +'"',
                status: 'danger',
                pos: 'top-center',
                timeout: 5000
            });
        }
        else {
            initHandlers();
        }
    });
}, true);

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
function _changeDocumentHandler(e) {
    spinner.removeAttribute('hidden');
    let self = e.target;
    let sideBar = document.querySelector('#sidebar');
    let documentToLoadID = self.dataset.document_source_json_name;
    console.log("Trying to load document n°",documentToLoadID);

    //On va venir supprimer le corps du document et mettre un spinner le temps de charger l'élément.
    let currentDocumentElement = document.querySelector('main');
    if(!currentDocumentElement){
        console.error("No 'main' element has been found.");
        return;
    }

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
            currentDocument = newDocument;
            initHandlers();
        })
        //Si ça s'est mal passé, on a juste a rendre l'ancien document visible à nouveau.
        .catch(()=>{
            currentDocumentElement.style.display = '';
        })
        //Quoiqu'il arrive, on enlève le spinner.
        .finally(()=>{spinner.setAttribute('hidden','');});
}

function initHandlers() {
    console.log("Initializing handlers");
    //On vient activer les clicks handlers pour changer de document
    let changeDocumentTriggers = document.getElementsByClassName('change-document-trigger');
    for (let elementTriggered of changeDocumentTriggers) {
        elementTriggered.removeEventListener('click',_changeDocumentHandler,true);
        elementTriggered.addEventListener('click',_changeDocumentHandler,true);
    }
}

/**
 * Fonction wrapper qui permet de savoir si on a trouvé une valeur dans un objet JSON (parcours profond).
 * @param documentAnalysed
 * @param valueToSearch
 * @see deepFind
 */
function _deepFind(documentAnalysed,valueToSearch) {
    let foundException = {};
    if(documentAnalysed !== null && typeof documentAnalysed == "object") {
        Object.entries(documentAnalysed).forEach(([key, value]) => {
            return _deepFind(value,valueToSearch);
        });
    }
    else {
        if(typeof documentAnalysed == "string"){
            if(documentAnalysed.includes(valueToSearch)){
                throw foundException;
            }
        }
    }
    return false;
}

function deepFind(documentAnalysed, valueToSearch) {
    try{
        _deepFind(documentAnalysed,valueToSearch);
        return false;
    }
    catch (e) {
        return true;
    }
}

function createElementFromHTML(htmlString) {
    let div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}
