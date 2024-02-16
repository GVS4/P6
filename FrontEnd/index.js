//Variables globales
const url = "http://localhost:5678/api/";
// export { url };

// Fetches works data from the API
const fetchData = async (param) => {
  try {
    const response = await fetch(url + param);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

// Inserts works into the HTML gallery
const insertWorkInHtml = async (array) => {
  document.getElementById("gallery").innerHTML = array
    .map(
      (e) =>
        `<figure>
          <img src="${e.imageUrl}" alt="${e.title}"/>
          <figcaption>${e.title}</figcaption>
        </figure>`
    )
    .join("");
};

const arrayAllWorks = fetchData("works").then((result) => result);
const arrayAllCategories = fetchData("categories").then((result) => result);

// Displays all works in the HTML gallery
const displayWorks = async () => insertWorkInHtml(await arrayAllWorks);
displayWorks();

// Displays category buttons and adds "Tous" as the first option
const DisplayBtnCategories = async () => {
  const array = await arrayAllCategories;
  array.unshift({ id: 0, name: "Tous" });

  document.getElementById("filter").innerHTML = array
    .map((e) => `<button class="button" id="${e.id}">${e.name}</button>`)
    .join("");
};

// filters works based on buttons
async function filterWorks() {
  await DisplayBtnCategories();
  const array = await arrayAllWorks;
  const arrayBtn = Array.from(document.querySelectorAll("#filter button"));
  arrayBtn.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const btnId = +btn.id;
      btn.classList.add("btn-selected");
      arrayBtn
        .filter((otherBtn) => otherBtn !== btn)
        .forEach((otherBtn) => otherBtn.classList.remove("btn-selected"));

      const worksFiltered =
        btnId === 0 ? array : array.filter((e) => btnId === e.categoryId);
      insertWorkInHtml(worksFiltered);
    });
  });
}
filterWorks();

// --IF USER IS LOGGED :
const ifLogged = () => {
  const loginElement = document.getElementById("login");

  if (localStorage.getItem("logged") === "true") {
    loginElement.textContent = "Logout";

    // Add mode édition
    document
      .querySelector("header")
      .insertAdjacentHTML(
        "beforebegin",
        '<div id="edition-mode"><div><a href="#"><i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i> Mode édition</a></div></div>'
      );

    // Add Modifier
    document
      .querySelector("#portfolio h2")
      .insertAdjacentHTML(
        "beforeend",
        '<a><i class="fa-regular fa-pen-to-square" style="color: black"></i> Modifier</a>'
      );

    // Disconnect: Clicking logout
    loginElement.addEventListener("click", () => {
      localStorage.setItem("logged", "false");
      localStorage.removeItem("token");
    });
  }
};
ifLogged();

const setModalDisplay = (elementListenTo, elementModified, displayValue) => {
  if (elementListenTo) {
    elementListenTo.addEventListener(
      "click",
      () => (elementModified.style.display = displayValue)
    );
  }
};

const displayModal = () => {
  const containerModalElement = document.getElementById("containerModal");
  const modeEditionElement = document.querySelector("#edition-mode a");
  const modifierElement = document.querySelector("#portfolio a");
  const modalGalleryElement = document.getElementById("modalGallery");
  const modalNewWorkElement = document.getElementById("modalNewWork");
  const x = document.getElementById("x");
  const x2 = document.getElementById("x2");
  const btnModalGallery = document.getElementById("modalGallery-btn");
  const leftArrowElement = document.querySelector(".fa-arrow-left");
  // DisplayValue
  const flex = "flex";
  const none = "none";

  // Mode édition
  setModalDisplay(modeEditionElement, containerModalElement, flex);
  // Modifier
  setModalDisplay(modifierElement, containerModalElement, flex);

  // Leave when clicked on X
  setModalDisplay(x, containerModalElement, none);
  setModalDisplay(x2, containerModalElement, none);

  // Leave when clicked on container
  containerModalElement.addEventListener(
    "click",
    (e) =>
      e.target.id === "containerModal" &&
      (containerModalElement.style.display = none)
  );

  // Go to modalAddWork
  setModalDisplay(btnModalGallery, modalGalleryElement, none);
  setModalDisplay(btnModalGallery, modalNewWorkElement, flex);
  setModalDisplay(btnModalGallery, leftArrowElement, flex);

  // Left Arrow (back to modalGallery)
  setModalDisplay(leftArrowElement, modalGalleryElement, flex);
  setModalDisplay(leftArrowElement, modalNewWorkElement, none);
  setModalDisplay(leftArrowElement, leftArrowElement, none);
};

displayModal();

// Inserts works into the HTML MODAL (3.2)
const insertWorkInHtmlModal = async () => {
  const array = await arrayAllWorks;

  const modalWorkElement = document.querySelector(
    "#containerModal .modal-work"
  );

  if (modalWorkElement) {
    modalWorkElement.innerHTML = array
      .filter((e) => e.imageUrl && e.title && e.id)
      .map(
        (e) => `<figure>
                  <span>
                    <i class="fa-solid fa-trash-can" id="${e.id}"></i>
                  </span>
                  <img src="${e.imageUrl}" alt="${e.title}">
                </figure>`
      )
      .join("");
    deleteWork();
  }
};

// delete work
function deleteWork() {
  const allTrash = document.querySelectorAll(".fa-trash-can");
  const token = localStorage.getItem("token");

  allTrash.forEach((e) => {
    e.addEventListener("click", (trash) => {
      const id = trash.target.id;
      console.log("trash ID: ", id);

      const init = {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      fetch(url + "works/" + id, init)
        .then((response) => {
          if (!response.ok) {
            console.log("DELETE -> error");
          }
          console.log(response);
        })
        .then(() => {
          console.log("DELETE -> succed");
          displayWorks();
          insertWorkInHtmlModal();
        });
    });
  });
}

// Modal addPhoto 3.3
const form = document.getElementById("modalNewWork-form");
const token = localStorage.getItem("token");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  for (item of formData) {
    console.log(item[0], item[1]);
  }

  const init = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  };

  fetch(url + "works", init)
    .then((res) => {
      if (!res.ok) {
        throw new Error(`Erreur HTTP ${res.status}`);
      }
      return res.json();
    })
    .then((res) => console.log(res))
    .catch((error) => console.error("Erreur lors de la requête POST :", error));
});

//

// 3.4

// const displayCategoriesList = async () => {
//   const array = await arrayAllCategories;
//   document.getElementById("categorie").innerHTML = array
//     .map((e) => `<option>${e.name}</option>`)
//     .join("");
// };
// displayCategoriesList()

// const displayCategoriesList = async () => {
//   const array = await arrayAllCategories;
//   const categorieElement = document.getElementById("categorie");

//   if (categorieElement) {
//     categorieElement.innerHTML = array
//       .map((e) => `<option>${e.name}</option>`)
//       .join("");
//   }
// };

// // Assurez-vous d'appeler la fonction après le chargement complet du document
// document.addEventListener("DOMContentLoaded", () => {
//   displayCategoriesList();
// });
