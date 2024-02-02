// -------------------------------CODE DE SAGOUIN---------------------------------


// Return works
// async function getWorks() {
//   return (await fetch("http://localhost:5678/api/works")).json();
// }

// Affichage des works
// async function displayWorks() {
//   const arrayWorks = await getWorks();
//   const galleryElement = document.querySelector(".gallery");
//   galleryElement.innerHTML = "";
//   arrayWorks.forEach((work) => {

//     const figureElement = document.createElement("figure");
//     const imgElement = document.createElement("img");
//     const figcaptionElement = document.createElement("figcaption");
//     imgElement.src = work.imageUrl;
//     figcaptionElement.textContent = work.title;

//     galleryElement.appendChild(figureElement);
//       figureElement.appendChild(imgElement);
//       figureElement.appendChild(figcaptionElement);
//   });
// }
// displayWorks();


// async function getCategorys(params) {
//   const response = await fetch("http://localhost:5678/api/categories");
//   return await response.json();
// }

// async function displayCategorysButtons() {
//   const categorys = await getCategorys();
//   categorys.forEach(category => {
//     const btn = document.createElement("button")
//     btn.textContent = category.name;
//     btn.id = category.id
//     btn.classList.add("button")
//     const filterElement = document.getElementById("filter")
//     filterElement.appendChild(btn)
//   });
// }
// displayCategorysButtons()

// -------------------------------CODE Propre ---------------------------------


// request HTTP
const getWorks = async () =>
  (await fetch("http://localhost:5678/api/works")).json();

// Display works
async function displayWorks() {
  const arrayWorks = await getWorks();
  document.querySelector(".gallery").innerHTML = arrayWorks
    .map(
      (e) =>
        `<figure>
          <img src="${e.imageUrl}" alt="${e.title}"/>
          <figcaption>${e.title}</figcaption>
        </figure>`
    )
    .join("");
}
displayWorks();

// Request HTTP
const getCategories = async () =>
  (await fetch("http://localhost:5678/api/categories")).json();

// DisplayBtnCategories
const DisplayBtnCategories = async () => {
  const ArraysCategories = await getCategories();
  ArraysCategories.unshift({ id: 0, name: "Tous" });
  document.getElementById("filter").innerHTML = ArraysCategories.map(
    (e) => `<button class="button" id ="${e.id}">${e.name}</button>`
  ).join("");
};
DisplayBtnCategories();
