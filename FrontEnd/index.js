//Variables globales
const url = "http://localhost:5678/api/";
const token = localStorage.getItem("token");
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

// const submitWorkForm = () => {
//   const modalErrorElement = document.getElementById("modalError");
//   const addError = (errorElement, message) => {
//     errorElement.classList.add("form-error");
//     modalErrorElement.innerHTML = `<p>${message}</p>`;
//   };

//   const form = document.getElementById("modalNewWork-form");
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const titleElement = document.getElementById("title"); // Correction ici
//     const containerPhotoElement = document.getElementById("containerPhoto");

//     // Vérification de la taille et du type du fichier
//     const file = document.getElementById("file").files[0];
//     if (
//       !file ||
//       (file.type !== "image/jpeg" && file.type !== "image/png") ||
//       file.size > 4 * 1024 * 1024
//     ) {
//       addError(
//         containerPhotoElement,
//         "Erreur : Veuillez sélectionner une image JPEG ou PNG de taille inférieure à 4 Mo."
//       );
//       return;
//     }

//     // Vérification du titre
//     const title = titleElement.value; // Correction ici
//     if (!title || typeof title !== "string") {
//       addError(titleElement, "Erreur : Veuillez entrer un titre valide.");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       const token = localStorage.getItem("token");
//       const category = document.getElementById("categorie");
//       const categoryValue = +category.options[category.selectedIndex].value;

//       formData.set("image", file, file.name);
//       formData.set("title", title);
//       formData.set("category", categoryValue);

//       // Réinitialiser les erreurs spécifiques
//       modalErrorElement.innerHTML = "";
//       containerPhotoElement.classList.remove("form-error")
//       titleElement.classList.remove("form-error")

//       //
//       const response = await fetch("http://localhost:5678/api/works/", {
//         method: "POST",
//         headers: { Authorization: `Bearer ${token}` },
//         body: formData,
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log("Réponse du serveur :", data);
//       } else {
//         console.error("Erreur lors de la requête :", response.statusText);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   });
// };

// submitWorkForm();

const submitWorkForm = () => {
  const modalErrorElement = document.getElementById("modalError");
  const form = document.getElementById("modalNewWork-form");

  // Déclarer titleElement avant de l'utiliser
  const titleElement = document.getElementById("title");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Fonction pour afficher un message d'erreur
    const addError = (errorElement, message) => {
      errorElement.classList.add("form-error");
      modalErrorElement.innerHTML = `<p>${message}</p>`;
    };

    // Vérification de la taille et du type du fichier
    const file = document.getElementById("file").files[0];
    const containerPhotoElement = document.getElementById("containerPhoto");
    const fileError =
      !file ||
      (file.type !== "image/jpeg" && file.type !== "image/png") ||
      file.size > 4 * 1024 * 1024;

    fileError
      ? addError(
          containerPhotoElement,
          "Erreur : Veuillez sélectionner une image JPEG ou PNG de taille inférieure à 4 Mo."
        )
      : containerPhotoElement.classList.remove("form-error");

    // Vérification du titre
    const title = titleElement.value;
    const titleError = !title || typeof title !== "string";

    titleError
      ? addError(titleElement, "Erreur : Veuillez entrer un titre valide.")
      : titleElement.classList.remove("form-error");

    // arrête le code si une erreur est trouvée
    if (fileError || titleError) return;

    try {
      const formData = new FormData();
      const category = document.getElementById("categorie");
      const categoryValue = +category.options[category.selectedIndex].value;

      formData.set("image", file, file.name);
      formData.set("title", title);
      formData.set("category", categoryValue);

      // Réinitialiser le message d'erreur
      modalErrorElement.innerHTML = "";

      const response = await fetch("http://localhost:5678/api/works/", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Réponse du serveur :", data);
      } else {
        console.error("Erreur lors de la requête :", response.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  });
};

submitWorkForm();

// Désactiver ou activer modalNewWork-btn
document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("file");
  const titleInput = document.getElementById("title");
  const categoryInput = document.getElementById("categorie");
  const submitButton = document.getElementById("modalNewWork-btn");

  const updateSubmitButton = () => {
    const isButtonDisabled =
      !fileInput.value.trim() ||
      !titleInput.value.trim() ||
      !categoryInput.value;

    submitButton.disabled = isButtonDisabled;
    submitButton.classList.toggle(
      "modalNewWork-btn-activate",
      !isButtonDisabled
    );
    submitButton.classList.toggle(
      "modalNewWork-btn-disabled",
      isButtonDisabled
    );
  };

  fileInput.addEventListener("input", updateSubmitButton);
  titleInput.addEventListener("input", updateSubmitButton);
  categoryInput.addEventListener("change", updateSubmitButton);

  // Initial update
  updateSubmitButton();
});

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
