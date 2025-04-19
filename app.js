// Task #1: Setup routing
const app = document.getElementById("app");
const loginTemplate = document.getElementById("login");
const dashboardTemplate = document.getElementById("dashboard");

// Task #2: Initialize
function showLogin() {
  const clone = loginTemplate.content.cloneNode(true);
  app.innerHTML = "";
  app.appendChild(clone);

  // Attach form listeners
  document.getElementById("loginForm").addEventListener("submit", handleLogin);
}

// Task #3: Fetch login info via GET
async function handleLogin(e) {
  e.preventDefault();
  const username = document.getElementById("username").value.trim();
  const loginError = document.getElementById("loginError");
  loginError.textContent = "";

  if (!username) return loginError.textContent = "Username required.";

  try {
    const response = await fetch(`http://localhost:5000/api/accounts/${username}`);
    if (!response.ok) throw new Error("User not found");
    const data = await response.json();
    showDashboard(data);
  } catch (err) {
    loginError.textContent = err.message;
  }
}

// Task #4: Show dashboard with account info
function showDashboard(account) {
  const clone = dashboardTemplate.content.cloneNode(true);
  app.innerHTML = "";
  app.appendChild(clone);

  document.getElementById("balanceDisplay").textContent = `${account.currency}${account.balance}`;

  const tbody = document.getElementById("transactionsBody");
  account.transactions.forEach((tx) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${tx.date}</td>
      <td>${tx.object}</td>
      <td>${tx.amount}</td>
    `;
    tbody.appendChild(row);
  });

  document.getElementById("logoutBtn").addEventListener("click", showLogin);
}

// Task #5: Register new account via POST
async function register() {
  const form = document.getElementById("registerForm");
  const registerError = document.getElementById("registerError");
  registerError.textContent = "";

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  data.balance = parseFloat(data.balance) || 0;

  try {
    const response = await fetch("http://localhost:5000/api/accounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Registration failed");
    }

    console.log("Account created!", result);
    alert("Account successfully created!");
    form.reset();
  } catch (err) {
    registerError.textContent = err.message;
  }
}

// Load login screen on start
showLogin();