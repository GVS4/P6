// Fetches works data from the API
const fetchData = async (param) => {
  try {
    const response = await fetch(`http://localhost:5678/api/${param}`);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};
const arrayAllWorks = fetchData("works").then((result) => result);
const arrayAllCategories = fetchData("categories").then((result) => result);

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

  localStorage.getItem("logged") === "true" &&
    ((loginElement.textContent = "Logout"),
    // Add mode édition
    document
      .querySelector("header")
      .insertAdjacentHTML(
        "beforebegin",
        '    <div id="edition-mode">\n  <div><a href="#"><i class="fa-regular fa-pen-to-square" style="color: #ffffff;"></i> Mode édition</a></div>\n</div>'
      ),
    // Add Modifier
    document
      .querySelector("#portfolio h2")
      .insertAdjacentHTML(
        "beforeend",
        '<a><i class="fa-regular fa-pen-to-square" style="color: black"></i> Modifier</a>'
      ),
    // Disconnect: Clicking logout
    loginElement.addEventListener("click", () =>
      localStorage.setItem("logged", "false")
    ));
};

ifLogged();

// --MODAL
const setModalDisplay = (displayValue) => {
  document.getElementById("containerModal").style.display = displayValue;
};

const displayModal = () => {
  // Mode édition
  document.querySelector("#edition-mode a").addEventListener("click", () => {
    setModalDisplay("flex");
  });

  // Modifier
  document.querySelector("#portfolio a").addEventListener("click", () => {
    setModalDisplay("flex");
  });

  // Leave when clicked on X
  document
    .querySelector("#containerModal .fa-x")
    .addEventListener("click", () => {
      setModalDisplay("none");
    });

  // Leave when clicked on container
  document.getElementById("containerModal").addEventListener("click", (e) => {
    e.target.id === "containerModal" && setModalDisplay("none");
  });
};

displayModal();

// KYRA //
// async function displayModalWorks() {
//   const modalworkElement = document.querySelector(
//     "#containerModal .modal-work"
//   );
//   modalworkElement.innerHTML = "";
//   array = await arrayAllWorks;
//   array.forEach((e) => {
//     const figure = document.createElement("figure");
//     const img = document.createElement("img");
//     const span = document.createElement("span");
//     const trash = document.createElement("i");
//     trash.classList.add("fa-solid", "fa-trash-can");
//     trash.id = e.id;
//     img.src = e.imageUrl;
//     span.appendChild(trash);
//     figure.appendChild(span);
//     figure.appendChild(img);
//     modalworkElement.appendChild(figure);
//   });
//   deleteWork();
// }
// displayModalWorks();

// Probleme de , //

// const insertWorkInHtmlModal = async () => {
//   array = await arrayAllWorks
//   document.querySelector("#containerModal .modal-work").innerHTML =
//     array
//       .map(
//         (e) => `<figure>
//                 <span>
//                   <i class="fa-solid fa-trash-can" id="${e.id}"></i>
//                 </span>
//                 <img src="${e.imageUrl}" alt="${e.title}">
//                 </figure>
//               `
//       ).join();
// };
// insertWorkInHtmlModal();

const insertWorkInHtmlModal = async () => {
  const array = await arrayAllWorks;

  document.querySelector("#containerModal .modal-work").innerHTML = array
    .filter((e) => e.imageUrl && e.title && e.id) // Exclut les éléments avec des valeurs indéfinies (bug ",")
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
};
insertWorkInHtmlModal();


// function deleteWork() {
//   const allTrash = document.querySelectorAll(".fa-trash-can");
//   const token = localStorage.getItem("1")
//   console.log(token);

//   allTrash.forEach((e) => {
//     e.addEventListener("click", (trash) => {
//       const id = trash.id;
//       const init = {
//         method: "DELETE",
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       };

//       fetch("http://localhost:5678/api/works/" + id, init)
//         .then(response => {
//           if (!response.ok) {
//             console.log("le DELETE n'as pas marché");
//           }
//           console.log(response);
//         })
//         .then(data => {
//           console.log("le detele à réussi voici la data !", data);
//           displayModalWorks();
//           displayWorks();
//           console.log(response);
//         });
//     });
//   });
// }






// function deleteWork() {  
//   // Récupérer le token du Local Storage
//   const token = localStorage.getItem("token");

//   const handleDelete = async (e) => {
//     try {
//       const id = e.id;
//       const init = {
//         method: "DELETE",
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       };

//       const response = await fetch(`http://localhost:5678/api/${id}`, init);

//       // Vérifiez si la requête a réussi
//       if (!response.ok) {
//         console.log("La suppression n'a pas réussi");
//         return;
//       }
//       // Récupérez les données de la réponse JSON
//       const data = await response.json();

//       // Affichez un message de succès et mettez à jour l'affichage
//       console.log("La suppression a réussi. Données :", data);
//       displayModalWorks();
//       displayWorks();
//     } catch (error) {
//       console.error(
//         "Une erreur s'est produite lors de la suppression :",
//         error
//       );
//     }
//   };

//   // Ajoutez un écouteur d'événement pour chaque élément de la corbeille
//   document.querySelectorAll(".fa-trash-can").forEach((e) => {
//     e.addEventListener("click", (e) => {
//       handleDelete(e);
//     });
//   });
// }




// const postData = async (email, password) => {
//   try {
//     const response = await fetch("http://localhost:5678/api/users/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password }),
//     });
//     return await response.json();
//   } catch (error) {
//     console.error(error);
//     return { message: "Erreur côté serveur" };
//   }
// };