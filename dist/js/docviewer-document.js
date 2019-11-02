class DocViewerDocument {
    constructor(serverJSON){
        Object.assign(this,serverJSON);
    }

    static load(fileID){
        return new Promise((resolve, reject) => {
            loadFileOnServer('src/json/'+fileID+'.json').then((result)=>{
                resolve(new DocViewerDocument(result));
            })
        }).catch((reason)=>{
            console.error(reason);
        });
    }

    getElement(){
        let div = document.createElement('div');
        div.innerHTML = this.toHTML().trim();
        return div.firstChild;
    }

    toHTML(){
        let finalString = `
<main role="main" data-document_id="${this.id}" class="uk-align-center uk-align-center uk-width-5-6@s uk-width-4-5@l">
    <section>
        <!--    Bouton pour ouvrir la modal qui contient les informations annexes de la documentation technique (status, copyright, ...)-->
        <div class="uk-margin-medium uk-text-center">
            <span class="uk-heading-xlarge uk-text-primary">RFC${this.id}</span>
            <a aria-label="Complements for the current document" aria-controls="modal-informations_${this.id}" 
                data-uk-toggle="target: #modal-informations_${this.id}" data-uk-icon="icon: plus; ratio: 2"
                class="uk-text-top"></a>
                <a aria-label="Summary of the document" aria-controls="modal-summary_${this.id}" 
                data-uk-toggle="target: #modal-summary_${this.id}" data-uk-icon="icon: list; ratio: 2"
                class="uk-text-top"></a>
        </div>
        
        <h1 class="uk-text-center uk-text-light">"${this.title}"</h1>
        <section id="modal-informations_${this.id}" class="uk-modal-full" data-uk-modal>
            <div class="uk-modal-dialog">
                <button class="uk-modal-close-full uk-close-large" type="button" data-uk-close></button>
                 <div class="uk-grid-collapse uk-child-width-1-2@s uk-flex-middle" data-uk-grid>
                    <div class="uk-background-cover custom-developing-background" data-uk-height-viewport></div>
                    <div class="uk-padding-large">
                        <h1>Complement for <span class="uk-text-primary">RFC${this.id}</span></h1>
                        <section>
                            <details open>
                                <summary id="rfc-summary-heading" class="uk-h3">Status of this memo</summary>
                                <div id="rfc-summary-content" aria-labelledby="rfc-summary-heading">
                                    ${this.content.errata.exists ? `
                                        <div class="uk-alert-warning" data-uk-alert><a class="uk-alert-close" data-uk-close></a>
                                            <p><a href="${this.content.errata.link}">An errata exists for this memo.</a></p>
                                        </div>
                                    `: ''}
                                    <!--Status of the memo-->
                                    <p>
                                        ${this.content.status}
                                    </p>
                                    <hr class="uk-divider-small">
                                    <!--Meta text for the memo-->
                                    <p class="uk-text-meta">
                                        ${this.content.statusMeta ? this.content.statusMeta : '{{UNKNOWN}}'}<br>
                                    </p>
                                    <!--Copyright infos-->
                                    <h1 class="uk-h3">Copyright</h1>
                                    <p>
                                        ${this.content.copyrightNotice ? this.content.copyrightNotice : '{{UNKNOWN}}'}<br>
                                    </p>
                                    <!--Asbtract-->
                                    <h1 class="uk-h3">Abstract</h1>
                                    <p>
                                        ${this.content.abstract ? this.content.abstract : '{{UNKNOWN}}'}<br>
                                    </p>
                                </div>
                            </details>
                        </section>
                    </div>
                </div>
            </div>
        </section>
        
        <!--    Pour chaque 'content.parts' du document, on vient construire dynamiquement les liens-->
        
        <div id="modal-summary_${this.id}" class="uk-modal-full" data-uk-modal>
            <button class="uk-modal-close-full uk-close-large" type="button" data-uk-close></button>
            <div class="uk-modal-dialog">
                <div class="uk-container">
                    <h1>Document's summary</h1>
                    <nav class="uk-align-center uk-text-small">
                        <ul role="menu" class="uk-list uk-list-large uk-list-divider">
                            ${Object.keys(this.content.parts).map((part,i)=>`
                            <li class="uk-modal-close"><a href="#section-content-${i}" data-uk-scroll>${this.content.parts[i].partTitle}</a></li>
                            `).join('')}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    
        <!--    Pour chaque 'content.parts' du document, on créé une nouvelle section-->
        ${Object.keys(this.content.parts).map((part,i)=>`
        <section aria-labelledby="heading-section-${i}" id="section-content-${i}" class="uk-section uk-container mono-font">
            <h1 id="heading-section-${i}" class="uk-h2">${this.content.parts[i].partTitle}&nbsp;<a role="scrollbar" aria-label="Go to the top of the page" data-uk-totop data-uk-scroll></a></h1>
            ${this.content.parts[i].content}
        </section>
        ${(i+1) === this.content.parts.length ? '' : '<hr class="uk-divider-small">'}
        `).join('')}
        
        <hr>
    
        <section id="rfc-informations" class="uk-section uk-container" aria-labelledby="rfc-informations-heading">
            <h1 id="rfc-informations-heading">Document's information</h1>
            <div class="uk-grid">
                <!--            Informations générales-->
                <div class="uk-margin-medium-bottom uk-width-1-2@l">
                    <h1 id="rfc-general-informations-heading" class="uk-text-large">General informations</h1>
                    <dl aria-labelledby="rfc-general-informations-heading">
                        <!--            Emetteur-->
                        <dt class="uk-display-inline" id="submitter-label">Sender</dt>
                        <dd id="submitter">Network Working Group</dd>
                        <!--            Date de parution-->
                        <dt id="date-label">Publication date</dt>
                        <dd id="date"><time datetime="${this.informations.date.datetime}">${this.informations.date.text}</time></dd>
                        <!--            Mis à jour par-->
                        <dt id="updatedBy-label">Updated by</dt>
                        <dd id="updatedBy">
                        ${this.informations.updatedBy ? `
                        ${Object.keys(this.informations.updatedBy).map((value,i)=>
            `
                        <a data-document_source_json_name="RFC${this.informations.updatedBy[i]}" class="change-document-trigger">
                            ${this.informations.updatedBy[i]}
                        </a>${this.informations.updatedBy.length === i+1 ? '' : ', '}
                        `).join('')}
                        ` : '{{UNKNOWN}}'}
                        </dd>
                        <!--            Mets à jour-->
                        <dt id="updates-label">Updates</dt>
                        <dd id="updates">${this.informations.updates ? `<a data-document_source_json_name="RFC${this.informations.updates}" class="change-document-trigger">${this.informations.updates}</a>` : '{{UNKNOWN}}'}</dd>
                    </dl>
                </div>
    
                <!--            Informations propres à l'auteur de la fiche-->
                <div class="uk-width-1-2@l">
                    <h1 id="rfc-author-informations-heading" class="uk-text-large">Author${this.author.length > 1 ? 's' : ''}</h1>
                    ${Object.keys(this.author).map((authorObject,i)=>`
                    <dl aria-labelledby="rfc-author-informations-heading">
                        <!--            Prénom-->
                        <dt id="author-name-label_${this.author[i].firstName}_${this.author[i].lastName}">Name</dt>
                        <dd id="author-name_${this.author[i].firstName}_${this.author[i].lastName}"><span id="author-firstName_${this.author[i].firstName}_${this.author[i].lastName}">${this.author[i].firstName}</span> <span id="author-lastName_${this.author[i].firstName}_${this.author[i].lastName}">${this.author[i].lastName}</span></dd>
                        <!--            Labo-->
                        <dt id="author-laboratory-label_${this.author[i].firstName}_${this.author[i].lastName}">Laboratory</dt>
                        <dd id="author-laboratory_${this.author[i].firstName}_${this.author[i].lastName}">
                            ${this.author[i].laboratory ? this.author[i].laboratory : '{{UNKNOWN}}'}
                        </dd>
                        <!--            Société-->
                        <dt id="author-company-label_${this.author[i].firstName}_${this.author[i].lastName}">Company</dt>
                        <dd id="author-company_${this.author[i].firstName}_${this.author[i].lastName}">${this.author[i].company}</dd>
                        <!--            Addresse-->
                        <dt id="author-address-label_${this.author[i].firstName}_${this.author[i].lastName}">Adresse</dt>
                        <dd id="author-address_${this.author[i].firstName}_${this.author[i].lastName}">${this.author[i].address}</dd>
                        <!--            Téléphone-->
                        <dt id="author-phone-label_${this.author[i].firstName}_${this.author[i].lastName}">Phone number</dt>
                        <dd id="author-phone_${this.author[i].firstName}_${this.author[i].lastName}">
                        <span property="telephone">${this.author[i].phone ? this.author[i].phone : '{{UNKNOWN}}'}</span>
                        </dd>
                        <!--            Email-->
                        <dt id="author-email-label_${this.author[i].firstName}_${this.author[i].lastName}">Email</dt>
                        <dd id="author-email_${this.author[i].firstName}_${this.author[i].lastName}"><a href="mailto:dwaitzman@BBN.COM">${this.author[i].email}</a></dd>
                    </dl>
                   ${this.author.length > 1 && (i+1) !== this.author.length ? '<hr class="uk-divider-small">' : ''}
                    `).join('')}
                </div>
            </div>
        </section>
    </div>
</main>`;
        return finalString.replace(/{{UNKNOWN}}/g, 'Not defined');
    }
}