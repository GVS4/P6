// Fetches works data from the API
const fetchData = async param => {
  try {
    const response = await fetch(`http://localhost:5678/api/${param}`);
    const result = await response.json();
    return result;
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

// Displays all works in the HTML gallery
const displayWorks = async () => insertWorkInHtml(await fetchData("works"));
displayWorks();

// Displays category buttons and adds "All" as the first option
const DisplayBtnCategories = async () => {
  const dataArray = await fetchData("categories");
  dataArray.unshift({ id: 0, name: "Tous" });
  document.getElementById("filter").innerHTML = dataArray
    .map((e) => `<button class="button" id ="${e.id}">${e.name}</button>`)
    .join("");
};
DisplayBtnCategories();

// Filters works with a click on btn and updates the HTML gallery
async function filterWorks() {
  const dataArray = await fetchData("works");
  const arrayBtn = Array.from(document.querySelectorAll("#filter button"));

  arrayBtn.forEach((btn) =>
    btn.addEventListener("click", async () => {
      const btnId = +btn.id;
      const workFiltered = btnId === 0 ? dataArray : dataArray.filter((e) => btnId === e.categoryId);
      insertWorkInHtml(workFiltered);
    })
  );
}
filterWorks();