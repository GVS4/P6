// Return works
async function getWorks() {
  return (await fetch("http://localhost:5678/api/works")).json();
}
getWorks();


// Affichage des works
async function displayWorks() {
  const arrayWorks = await getWorks();
  const galleryElement = document.querySelector(".gallery");
  galleryElement.innerHTML = '';
  arrayWorks.forEach((work) => {
    // Création des balises
    const figureElement = document.createElement("figure");
    const imgElement = document.createElement("img");
    const figcaptionElement = document.createElement("figcaption");
    imgElement.src = work.imageUrl;
    figcaptionElement.textContent = work.title;

    // Rattachement
    figureElement.appendChild(imgElement);
    figureElement.appendChild(figcaptionElement);
    galleryElement.appendChild(figureElement);
  });
}

displayWorks();
