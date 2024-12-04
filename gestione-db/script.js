var indice = 0;
function caricaNotizie() {
fetch('https://notizie.terribile.space/api/notizie')
  .then(response => response.json())
  .then(notizie => {
    const tabella = document.getElementById('notizie-table').getElementsByTagName('tbody')[0];

    notizie.forEach(notizia => {
      const riga = tabella.insertRow();

      // Titolo
      const cellaTitolo = riga.insertCell();
      const inputTitolo = document.createElement('input');
      inputTitolo.type = 'text';
      inputTitolo.id = notizia.doc_id + '-titolo';
      inputTitolo.value = notizia.titolo;
      cellaTitolo.appendChild(inputTitolo);

      // Contenuto
      const cellaContenuto = riga.insertCell();
      const inputContenuto = document.createElement('input');
      inputContenuto.type = 'text';
      inputContenuto.id = notizia.doc_id + '-contenuto';
      inputContenuto.value = notizia.contenuto;
      cellaContenuto.appendChild(inputContenuto);

      // Contenuto
      const buttonCrea = document.createElement('button');
      buttonCrea.textContent = 'Crea';
      buttonCrea.onclick = () => creaContenuto(notizia.doc_id + '-contenuto');
      cellaContenuto.appendChild(buttonCrea);

       // Video
      const cellaVideo = riga.insertCell();
      const inputVideo = document.createElement('input');
      inputVideo.type = 'url';
      inputVideo.id = notizia.doc_id + '-video';
      inputVideo.value = notizia.video;
      cellaVideo.appendChild(inputVideo);
      // Aggiungi pulsante per aprire il video
      const buttonVideo = document.createElement('button');
      buttonVideo.textContent = 'Apri video';
      buttonVideo.onclick = () => window.open(notizia.video, '_blank');
      cellaVideo.appendChild(buttonVideo);

      // Immagine
      const cellaImmagini = riga.insertCell();
      const inputImmagine = document.createElement('input');
      inputImmagine.type = 'url';
      inputImmagine.id = notizia.doc_id + '-immagine';
      inputImmagine.value = notizia.immagine;
      cellaImmagini.appendChild(inputImmagine);
      // Aggiungi pulsante per aprire l'immagine
      const buttonImmagine = document.createElement('button');
      buttonImmagine.textContent = 'Apri immagine';
      buttonImmagine.onclick = () => window.open(notizia.immagine, '_blank');
      cellaImmagini.appendChild(buttonImmagine);

      // Azioni
      const cellaAzioni = riga.insertCell();
      const buttonModifica = document.createElement('button');
      buttonModifica.textContent = 'Modifica';
      buttonModifica.onclick = () => modificaNotizia(notizia);
      cellaAzioni.appendChild(buttonModifica);

      const buttonElimina = document.createElement('button');
      buttonElimina.textContent = 'Elimina';
      buttonElimina.onclick = () => eliminaNotizia(notizia.doc_id);
      cellaAzioni.appendChild(buttonElimina);

      indice = notizia.doc_id;

    });

    const riga = tabella.insertRow();

    indice++;

    // Titolo
    const cellaTitolo = riga.insertCell();
    const inputTitolo = document.createElement('input');
    inputTitolo.type = 'text';
    inputTitolo.id = indice + '-titolo';
    inputTitolo.value = "";
    cellaTitolo.appendChild(inputTitolo);

    // Contenuto
    const cellaContenuto = riga.insertCell();
    const inputContenuto = document.createElement('input');
    inputContenuto.type = 'text';
    inputContenuto.id = indice + '-contenuto';
    inputContenuto.value = "";
    cellaContenuto.appendChild(inputContenuto);

    // Contenuto
    const buttonCrea = document.createElement('button');
    buttonCrea.textContent = 'Crea';
    buttonCrea.onclick = () => creaContenuto(indice + '-contenuto');
    cellaContenuto.appendChild(buttonCrea);


     // Video
    const cellaVideo = riga.insertCell();
    const inputVideo = document.createElement('input');
    inputVideo.id = indice + '-video';
    inputVideo.type = 'url';
    inputVideo.value = "";
    cellaVideo.appendChild(inputVideo);

    // Immagine
    const cellaImmagini = riga.insertCell();
    const inputImmagine = document.createElement('input');
    inputImmagine.id = indice + '-immagine';
    inputImmagine.type = 'url';
    inputImmagine.value = "";
    cellaImmagini.appendChild(inputImmagine);

    // Azioni
    const cellaAzioni = riga.insertCell();
    const buttonInserisci = document.createElement('button');
    buttonInserisci.textContent = 'Inserisci';
    buttonInserisci.onclick = () => inserisciNotizia(indice);
    cellaAzioni.appendChild(buttonInserisci);
  });
}

async function modificaNotizia(notizia) {
    inserisciNotizia(notizia.doc_id);
    eliminaNotizia(notizia.doc_id);
}

async function eliminaNotizia(id) {
fetch(`https://notizie.terribile.space/api/notizie/${id}`, { method: 'DELETE' })
  .then(response => {
    if (response.ok) {
        window.location = window.location;
    } else {
      console.error('Errore durante l\'eliminazione della notizia');
    }
  });
}

async function inserisciNotizia(indice) {

  const titolo = document.getElementById(indice + "-titolo").value;
  const contenuto = document.getElementById(indice + "-contenuto").value;
  const immagine = document.getElementById(indice + "-immagine").value;
  const video = document.getElementById(indice + "-video").value;
  const doc_id = indice;

  fetch('https://notizie.terribile.space/api/notizie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ titolo, contenuto, immagine, video }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Success:', data);
    setTimeout(() => window.location = window.location, 2000);
  })
  .catch((error) => {
    console.error('Error:', error);
    // Mostra un messaggio di errore all'utente
  });
};

function generaIdConTimestamp() {
  return Date.now().toString(36); 
}

function creaContenuto(htmlid) {
  // Crea un elemento div per il popup
  const popup = document.createElement('div');
  popup.style.position = 'fixed';
  popup.style.top = '50%';
  popup.style.left = '50%';
  popup.style.transform = 'translate(-50%, -50%)';
  popup.style.backgroundColor = 'white';
  popup.style.padding = '20px';
  popup.style.border = '1px solid black';
  popup.style.zIndex = '1000';
  popup.style.width = '80%'; // Larghezza del popup
  console.log(htmlid);
  var text = document.getElementById(htmlid).value;
  console.log(text);

  // Crea l'editor TinyMCE
  popup.innerHTML = `
    <textarea id="editor">`+text+`</textarea>
    <button onclick="salvaContenuto(`+htmlid+`)">Salva</button>
    <button onclick="chiudiPopup()">Annulla</button>
  `;

  // Aggiungi il popup al body
  document.body.appendChild(popup);

  // Inizializza TinyMCE
  tinymce.init({
    selector: 'textarea',
    plugins: [
      // Core editing features
      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
      // Your account includes a free trial of TinyMCE premium features
      // Try the most popular premium features until Dec 18, 2024:
      'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
      // Early access to document converters
      'importword', 'exportword', 'exportpdf'
    ],
    toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
    tinycomments_mode: 'embedded',
    tinycomments_author: 'Author name',
    mergetags_list: [
      { value: 'First.Name', title: 'First Name' },
      { value: 'Email', title: 'Email' },
    ],
    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
  });
}

function salvaContenuto(htmlid) {
  const contenutoHtml = tinymce.get('editor').getContent();
  document.getElementById(htmlid).value = contenutoHtml;
  // Invia `contenutoHtml` al server con una richiesta POST
  // ...

  // Chiudi il popup
  chiudiPopup();
}

function chiudiPopup() {
  const popup = document.querySelector('div[style*="z-index: 1000"]');
  if (popup) {
    document.body.removeChild(popup);
  }
}

caricaNotizie();