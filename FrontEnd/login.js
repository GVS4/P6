// Variables globales pour le login
// const emailElement = document.getElementById("email");
// const pwdElement = document.getElementById("password");
// const formElement = document.getElementById("connexion-form");
// const msgErrorElement = document.getElementById("connexion-error");

const postData = async (email, password) => {
  try {
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    return { message: "Erreur côté serveur" };
  }
};

const login = async () => {
  document
    .getElementById("connexion-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const { value: useremail } = document.getElementById("email");
      const { value: userpwd } = document.getElementById("password");
      const msgErrorElement = document.getElementById("connexion-error");

      const response = await postData(useremail, userpwd);
      if (response.userId === undefined) {
        // error
        msgErrorElement.textContent = "Email ou mot de passe incorrect";
        ["email", "password"].forEach((id) =>
          document.getElementById(id).classList.add("form-error")
        );
      } else {
        localStorage.setItem("logged", "true");
        localStorage.setItem(response.userId, response.token);
        window.location.href = "./index.html";
      }
    });
};

login();
