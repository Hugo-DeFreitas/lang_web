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
<main data-document_id="${this.id}" class="uk-align-center uk-align-center uk-width-5-6@s uk-width-2-3@l" >
    <h1>${this.title}</h1>
    <details class="uk-card uk-card-secondary uk-card-hover uk-card-body" open>
        <summary id="rfc-summary-heading" class="uk-h3">Status of this Memo</summary>
        <div id="rfc-summary-content" aria-labelledby="rfc-summary-heading">
            <p>
                This memo describes an experimental method for the encapsulation of <abbr title="Internet Protocol">IP</abbr> datagrams in avian carriers.<br>
                This specification is primarily useful in Metropolitan Area Networks.
            </p>
            <hr class="uk-divider-small">
            <p>
                This is an experimental, not recommended standard.  Distribution of this memo is unlimited.<br>
            </p>
        </div>
    </details>

    <!--    Pour chaque 'content.parts' du document, on créé une nouvelle section-->
    ${Object.keys(this.content.parts).map((part,i)=>`
    <section class="uk-section">
        <div class="uk-container">
            <h1>${this.content.parts[i].partTitle}</h1>
            <p>${this.content.parts[i].content}</p>
        </div>
    </section>
    ${(i+1) === this.content.parts.length ? '' : '<hr class="uk-divider-small">'}
    `)}
    
    <hr>

    <section id="rfc-informations" aria-labelledby="rfc-informations-heading">
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
                    <dd id="updatedBy">${Object.keys(this.informations.updatedBy)
                        .map((value,i)=>`<a>${this.informations.updatedBy[i]}</a>${this.informations.updatedBy.length !== (i+1) ? `,` : ``}`)}</dd>
                    <!--            Mets à jour-->
                    <dt id="updates-label">Updates</dt>
                    <dd id="updates">${this.informations.updates ? this.informations.updates : '{{UNKNOWN}}'}</dd>
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
                    <dd id="author-company_${this.author[i].firstName}_${this.author[i].lastName}"><abbr title="BBN Systems and Technologies Corporation">${this.author[i].company}</abbr></dd>
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
                `).join("")}
            </div>
        </div>
    </section>
</main>`;
        return finalString.replace(/{{UNKNOWN}}/g, 'Not defined');
    }
}