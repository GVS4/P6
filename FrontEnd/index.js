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

// If user is loged :
const loginElement = document.getElementById("login");

if (localStorage.getItem("logged") === "true") {
  loginElement.textContent = "Logout";
  loginElement.addEventListener("click", () => {
    localStorage.setItem("logged", "false");
  });
}
