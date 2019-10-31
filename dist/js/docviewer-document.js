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
<main class="uk-align-center uk-align-center uk-width-5-6@s uk-width-2-3@l" >
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

    <section class="uk-section">
        <div class="uk-container">
            <h1>Overview and Rational</h1>
            <p>
                Avian carriers can provide high delay, low throughput, and low altitude service.
                The connection topology is limited to a single point-to-point path for each carrier, used with standard carriers,
                but many carriers can be used without significant interference with each other, outside of early spring.  This is because of
                the 3D ether space available to the carriers, in contrast to the 1D ether used by <a href="">IEEE802.3</a>.
                The carriers have an intrinsic collision avoidance system, which increases availability. Unlike some network technologies, such
                as packet radio, communication is not limited to line-of-sight distance. Connection oriented service is available in some cities,
                usually based upon a central hub topology.
            </p>
        </div>
    </section>

    <hr>

    <section class="uk-section">
        <div class="uk-container">
            <h1>Frame Format</h1>
            <p>
                The IP datagram is printed, on a small scroll of paper, in hexadecimal, with each octet separated by whitestuff and blackstuff.
                The scroll of paper is wrapped around one leg of the avian carrier. A band of duct tape is used to secure the datagram's edges. The bandwidth is limited to the leg length.
                The <abbr title="Maximum Transfer Unit">MTU</abbr> is variable, and paradoxically, generally increases with increased carrier age. A typical MTU is 256 milligrams.
                Some datagram padding may be needed.
            </p>
            <p>
                Upon receipt, the duct tape is removed and the paper copy of the datagram is optically scanned into a electronically transmittable form.
            </p>
        </div>
    </section>

    <section class="uk-section">
        <div class="uk-container">
            <h1>Discussion</h1>
            <p>
                Multiple types of service can be provided with a prioritized pecking order. An additional property is built-in worm detection and
                eradication.  Because IP only guarantees best effort delivery, loss of a carrier can be tolerated.  With time, the carriers are self-regenerating.
                While broadcasting is not specified, storms can cause data loss. There is persistent delivery retry, until the carrier drops.  Audit trails are
                automatically generated, and can often be found on logs and xcable trays.
            </p>
        </div>
    </section>

    <section class="uk-section uk-section-default">
        <div class="uk-container">
            <h1>Security Considerations</h1>
            <p>
                Security is not generally a problem in normal operation, but special measures must be taken (such as data encryption) when avian carriers
                are used in a tactical environment.
            </p>
        </div>
    </section>

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
                    <dd id="date"><time datetime="1990-04-01">1 April 1990</time></dd>
                    <!--            Mis à jour par-->
                    <dt id="updatedBy-label">Updated by</dt>
                    <dd id="updatedBy">2549, 6214</dd>
                </dl>
            </div>

            <!--            Informations propres à l'auteur de la fiche-->
            <div class="uk-width-1-2@l">
                <h1 id="rfc-author-informations-heading" class="uk-text-large">Author</h1>
                ${Object.keys(this.author).map((authorObject,i)=>`
                <dl aria-labelledby="rfc-author-informations-heading">
                    <!--            Prénom-->
                    <dt id="author-name-label">Name</dt>
                    <dd id="author-name"><span id="author-firstName">${this.author[i].firstName}</span> <span id="author-lastName">${this.author[i].lastName}</span></dd>
                    <!--            Labo-->
                    <dt id="author-laboratory-label">Laboratory</dt>
                    <dd id="author-laboratory">${this.author[i].laboratory}</dd>
                    <!--            Société-->
                    <dt id="author-company-label">Company</dt>
                    <dd id="author-company"><abbr title="BBN Systems and Technologies Corporation">${this.author[i].company}</abbr></dd>
                    <!--            Addresse-->
                    <dt id="author-address-label">Adresse</dt>
                    <dd id="author-address">${this.author[i].address}</dd>
                    <!--            Téléphone-->
                    <dt id="author-phone-label">Phone number</dt>
                    <dd id="author-phone"><span property="telephone">${this.author[i].phone}</span></dd>
                    <!--            Email-->
                    <dt id="author-email-label">Email</dt>
                    <dd id="author-email"><a href="mailto:dwaitzman@BBN.COM">${this.author[i].email}</a></dd>
                </dl>
                `).join("")}
            </div>
        </div>
    </section>
</main>`;
        return finalString;
    }
}