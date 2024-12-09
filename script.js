function creaAnteprimaNotizia(notizia) {
  const article = document.createElement('article');
  let content = `
    <h2>${notizia.titolo}</h2>
  `;

  if (notizia.immagine && !notizia.video) {
    content += `<img src="${notizia.immagine}" alt="${notizia.titolo}">`;
  }

  if (notizia.video) {
    content += `<video controls><source src="${notizia.video}" type="video/mp4">Il tuo browser non supporta il tag video.</video>`;
  }

  article.innerHTML = content;

  // Aggiungi l'onclick all'article
  article.onclick = () => {
    window.location.href = `?id=${notizia.id}`; 
  };

  return article;
}

function visualizzaNotiziaCompleta(notizia) {
  var article = document.createElement('article');
  article.innerHTML = `
      <h2>${notizia.titolo}</h2>
      ${notizia.video ? 
          `<video controls><source src="${notizia.video}" type="video/mp4">Il tuo browser non supporta il tag video.</video>` 
          : 
          (notizia.immagine ? `<img src="${notizia.immagine}" alt="${notizia.titolo}">` : '')
      }
      <p>${notizia.contenuto}</p>
  `;

  // Crea il link per la condivisione
  const currentUrl = encodeURIComponent(window.location.href);
  const shareLink = `https://meme.terribile.space/preview?id=${encodeURIComponent(notizia.id)}`;

  // Crea il bottone di condivisione
  const shareButton = document.createElement('button');
  shareButton.textContent = 'share';
  shareButton.style = 'color:white;background-color:#000;border-radius:5px;margin-left:40%';
  shareButton.addEventListener('click', () => {
    // Crea un input con il link cliccabile
    const input = document.createElement('input');
    input.type = 'text';
    input.value = shareLink;
    input.readOnly = true;
    input.style.width = '100%'; // Imposta la larghezza dell'input al 100%

    // Crea un div per contenere l'input e centrarlo
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.justifyContent = 'center'; // Centra l'input orizzontalmente
    container.appendChild(input);

    // Mostra l'input all'utente (es. con un alert o un modal)
    alert("copiato negli appunti"); 

    // Seleziona il testo nell'input
    input.select();
    input.setSelectionRange(0, 99999); // Per supportare anche i dispositivi mobile

    // Copia il link negli appunti (se supportato dal browser)
    navigator.clipboard.writeText(shareLink)
      .then(() => {
        console.log('Link copiato negli appunti!');
      })
      .catch(err => {
        console.error('Errore durante la copia del link: ', err);
      });
  });

  // Aggiungi il bottone accanto al titolo
  const title = article.querySelector('h2');
  title.insertAdjacentElement('afterend', shareButton);

  document.querySelector('main').appendChild(article);

}

function caricaNotizie() {
  fetch('https://meme.terribile.space/api/notizie')
    .then(response => response.json())
    .then(notizie => {

      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      const category = urlParams.get('catergory');
      if (id) {
        caricaNotizieId(id);
      } else if (category) { 
        const categorieValide = ['random', 'geopolitics', 'niggameme', 'chiggameme', 'italy'];
        if (categorieValide.includes(category)) {
          const notizieFiltrate = notizie.filter(n => n.categoria === category);

          const main = document.querySelector('main');
          notizieFiltrate.forEach(notizia => {
            const anteprima = creaAnteprimaNotizia(notizia);
            main.insertBefore(anteprima, main.firstChild);
          });
        } else {
          // Handle invalid category (e.g., display an error message)
          console.error('Invalid category:', category);
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

function caricaNotizieId(id) {
  fetch('https://meme.terribile.space/api/notizie/'+ id)
    .then(response => response.json())
    .then(notizia => {
      visualizzaNotiziaCompleta(notizia[0]);
    });
}

// Carica le notizie al caricamento della pagina
caricaNotizie();