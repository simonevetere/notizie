function creaAnteprimaNotizia(notizia) {
  const article = document.createElement('article');
  article.innerHTML = `
      <h2>${notizia.titolo}</h2>
      ${notizia.immagine ? `<img src="${notizia.immagine}" alt="${notizia.titolo}">` : ''}
  `;

  // Aggiungi l'onclick all'article
  article.onclick = () => {
    window.location.href = `?id=${notizia.doc_id}`; 
  };

  return article;
}

function visualizzaNotiziaCompleta(notizia) {
  const article = document.createElement('article');
  article.innerHTML = `
    <h2>${notizia.titolo}</h2>
    ${notizia.immagine ? `<img src="${notizia.immagine}" alt="${notizia.titolo}">` : ''}
    ${notizia.contenuto}
    ${notizia.video ? `<video width="640" height="360" controls><source src="${notizia.video}" type="video/mp4">Il tuo browser non supporta il tag video.</video>` : ''}
  `;
  document.querySelector('main').appendChild(article);
}

function caricaNotizie() {
  fetch('https://notizie.terribile.space/api/notizie')
    .then(response => response.json())
    .then(notizie => {

      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      if (id) {
        const notizia = notizie.find(n => n.doc_id === parseInt(id));
        if (notizia) {
          visualizzaNotiziaCompleta(notizia); // Chiama la nuova funzione
        }
      } else {
        const main = document.querySelector('main');
        notizie.forEach(notizia => {
          const anteprima = creaAnteprimaNotizia(notizia);
          main.appendChild(anteprima);
        });
      }

    });
}

// Carica le notizie al caricamento della pagina
caricaNotizie();