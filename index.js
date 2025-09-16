document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("github-form");
  const userList = document.getElementById("user-list");
  const reposList = document.getElementById("repos-list");

  const BASE_URL = "https://api.github.com";

  // Add headers required by GitHub API v3
  const headers = {
    Accept: "application/vnd.github.v3+json"
  };

  // -----------------------
  // Handle Form Submit
  // -----------------------
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = document.getElementById("search").value.trim();

    if (query === "") return;

    // Clear previous results
    userList.innerHTML = "";
    reposList.innerHTML = "";

    fetch(`${BASE_URL}/search/users?q=${query}`, { headers })
      .then((resp) => resp.json())
      .then((data) => {
        data.items.forEach((user) => renderUser(user));
      })
      .catch((err) => console.error("Error fetching users:", err));
  });

  // -----------------------
  // Render User Info
  // -----------------------
  function renderUser(user) {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" width="50">
      <a href="${user.html_url}" target="_blank">${user.login}</a>
      <button data-username="${user.login}">Show Repos</button>
    `;

    // Add click handler for repos
    li.querySelector("button").addEventListener("click", () => {
      fetchRepos(user.login);
    });

    userList.appendChild(li);
  }

  // -----------------------
  // Fetch and Display Repos
  // -----------------------
  function fetchRepos(username) {
    reposList.innerHTML = `<li>Loading repos for ${username}...</li>`;

    fetch(`${BASE_URL}/users/${username}/repos`, { headers })
      .then((resp) => resp.json())
      .then((repos) => {
        reposList.innerHTML = "";
        repos.forEach((repo) => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
          reposList.appendChild(li);
        });
      })
      .catch((err) => console.error("Error fetching repos:", err));
  }
  let searchType = "user"; // or "repo"

document.getElementById("toggle-search").addEventListener("click", () => {
  searchType = searchType === "user" ? "repo" : "user";
  alert(`Switched to ${searchType} search`);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = document.getElementById("search").value.trim();

  if (searchType === "user") {
    fetch(`${BASE_URL}/search/users?q=${query}`, { headers })
      .then((resp) => resp.json())
      .then((data) => data.items.forEach(renderUser));
  } else {
    fetch(`${BASE_URL}/search/repositories?q=${query}`, { headers })
      .then((resp) => resp.json())
      .then((data) => {
        reposList.innerHTML = "";
        data.items.forEach((repo) => {
          const li = document.createElement("li");
          li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.full_name}</a>`;
          reposList.appendChild(li);
        });
      });
  }
});

});
