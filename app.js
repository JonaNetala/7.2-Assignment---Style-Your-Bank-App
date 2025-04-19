// Task #3
const routes = {
  "/login": { templateId: "login", title: "Login" },
  "/dashboard": { templateId: "dashboard", title: "Dashboard" },
};

// Task #2 (updated during Task #3)
function updateRoute() {
  const path = window.location.pathname;
  const route = routes[path] || routes["/login"];

  document.title = route.title;
  const template = document.getElementById(route.templateId);
  const view = template.content.cloneNode(true);
  const app = document.getElementById("app");
  app.innerHTML = "";
  app.appendChild(view);

  if (route.templateId === "login") setupLogin();
  if (route.templateId === "dashboard") setupDashboard();
}

// Task #4, part 1
function navigate(path) {
  window.history.pushState({}, path, path);
  updateRoute();
}

// Task 4, part 3
function onLinkClick(event) {
  event.preventDefault();
  navigate(event.target.href);
}

window.onpopstate = () => updateRoute();
updateRoute();

// 
// Customization: Setup login logic
//
function setupLogin() {
  const form = document.getElementById("loginForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const errorBox = document.getElementById("loginError");

    try {
      const response = await fetch(`http://localhost:5000/api/accounts/${username}`);
      if (!response.ok) throw new Error("Invalid user");

      const data = await response.json();
      sessionStorage.setItem("account", JSON.stringify(data));
      navigate("/dashboard");
    } catch (err) {
      if (errorBox) {
        errorBox.textContent = "❌ Login failed: " + err.message;
      }
    }
  });

  // Setup registration form
  const registerForm = document.getElementById("registerForm");
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = Object.fromEntries(new FormData(form));
    const errorBox = document.getElementById("registerError");
    errorBox.textContent = "";

    try {
      const response = await fetch("http://localhost:5000/api/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Unknown error");
      }

      errorBox.textContent = "✅ Registration successful!";
      form.reset();
    } catch (err) {
      errorBox.textContent = "❌ " + err.message;
    }
  });
}


// Customization: Setup dashboard display
//
function setupDashboard() {
  const logoutBtn = document.querySelector("button");
  logoutBtn.addEventListener("click", () => navigate("/login"));

  const account = JSON.parse(sessionStorage.getItem("account"));
  document.getElementById("balance").textContent = `${account.currency}${account.balance}`;

  const tbody = document.getElementById("transactions");
  account.transactions.forEach((tx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.object}</td>
      <td>${account.currency}${tx.amount}</td>
    `;
    tbody.appendChild(row);
  });
}