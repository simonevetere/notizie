function creaAnteprimaNotizia(notizia) {
  const article = document.createElement('article');
  let content = `
    <h2>${notizia.titolo}</h2>
  `;

  if (notizia.immagine) {
    if (notizia.immagine.includes('drive.google.com')) {
      // Use iframe for Google Drive links
      content += `<iframe src="${notizia.immagine}" allow="autoplay"></iframe>`;
    } else {
      // Use img tag for other image links
      content += `<img src="${notizia.immagine}" alt="${notizia.titolo}">`;
    }
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
    ${notizia.contenuto.replaceAll("\\", " ")}
    ${notizia.video ? `<iframe src="${notizia.video}" allow="autoplay"></iframe>` : ''}
  `;

  
  if (notizia.immagine) {
    if (notizia.immagine.includes('drive.google.com')) {
      // Use iframe for Google Drive links
      article.innerHTML += `<iframe src="${notizia.immagine}" allow="autoplay"></iframe>`;
    } else {
      // Use img tag for other image links
      article.innerHTML += `<img src="${notizia.immagine}" alt="${notizia.titolo}">`;
    }
  }

  // Aggiungi i meta tag Open Graph
  var head = document.getElementsByTagName('head')[0];

  if (notizia.video) {
    // Se è un video, usa i meta tag per i video
    head.innerHTML += `
      <meta property="og:title" content="${notizia.titolo}" />
      <meta property="og:description" content="${notizia.contenuto.substring(0, 100)}..." />
      <meta property="og:type" content="video.other" />
      <meta property="og:video" content="${notizia.video}" />
      <meta property="og:video:secure_url" content="${notizia.video}" />
      <meta property="og:video:type" content="application/x-shockwave-flash" /> 
      <meta property="og:url" content="${window.location.href}" />
    `;
  } else {
    // Se non è un video, usa i meta tag standard
    head.innerHTML += `
      <meta property="og:title" content="${notizia.titolo}" />
      <meta property="og:description" content="${notizia.contenuto.substring(0, 100)}..." />
      <meta property="og:image" content="${notizia.immagine}" />
      <meta property="og:url" content="${window.location.href}" />
    `;
  }
  
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
            main.appendChild(anteprima);
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