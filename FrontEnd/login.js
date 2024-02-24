const url = "http://localhost:5678/api/";

const postData = async (email, password) => {
  try {
    const response = await fetch(url + "users/login", {
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
      response.userId === undefined
        ? ((msgErrorElement.textContent = "Email ou mot de passe incorrect"),
          msgErrorElement.classList.add("error-msg"),
          ["email", "password"].forEach((id) =>
            document.getElementById(id).classList.add("form-error")
          ))
        : (localStorage.setItem("logged", "true"),
          localStorage.setItem("token", response.token),
          (window.location.href = "./index.html"));
    });
};

login();
