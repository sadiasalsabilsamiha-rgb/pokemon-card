const form = document.getElementById("search-form");
const input = document.getElementById("pokemon-input");
const statusEl = document.getElementById("status");
const cardContainer = document.getElementById("card-container");
const quickButtons = document.querySelectorAll(".quick-btn");
const API_BASE = "https://pokeapi.co/api/v2/pokemon/";
function showLoading() {
  statusEl.textContent = "Loading...";
  statusEl.className = "status loading";
  cardContainer.innerHTML = "";
}
function showError(message) {
  statusEl.textContent = message;
  statusEl.className = "status error";
  cardContainer.innerHTML = "";
}
function clearStatus() {
  statusEl.textContent = "";
  statusEl.className = "status";
}
async function fetchPokemon(name) {
  const cleanName = name.trim().toLowerCase();
 
  if (!cleanName) {
    showError("Please type a Pokémon name.");
    return;
  }
  showLoading();
  try {
    const response = await fetch(`${API_BASE}${cleanName}`);
 
    // 2 & 4. Check response.ok before parsing
    if (!response.ok) {
      throw new Error(`"${cleanName}" was not found. Check the spelling.`);
    }
    const data = await response.json();
    clearStatus();
    renderCard(data);
  } catch (err) {
    showError(err.message || "Something went wrong. Please try again.");
  }
}
function renderCard(data) {
  // name + id
  const name = data.name;
  const id = data.id;
  const artwork =
    data.sprites?.other?.["official-artwork"]?.front_default ||
    data.sprites?.front_default ||
    "";
  const types = data.types.map((t) => t.type.name);
  const primaryType = types[0] || "normal";
  const heightM = (data.height / 10).toFixed(1);
  const weightKg = (data.weight / 10).toFixed(1);
  const stats = data.stats.map((s) => ({
    name: s.stat.name.replace("-", " "),
    value: s.base_stat,
  }));
  const abilities = data.abilities.map((a) => a.ability.name.replace("-", " "));
  const typeBadges = types
    .map((t) => `<span class="type-badge">${t}</span>`)
    .join("");
  const statRows = stats
    .map(
      (s) =>
        `<div class="stat-row"><span>${s.name}</span><span>${s.value}</span></div>`
    )
    .join("");
  const abilityTags = abilities
    .map((a) => `<span>${a}</span>`)
    .join("");
  cardContainer.innerHTML = `
    <div class="poke-card type-${primaryType}">
      <div class="poke-card__header">
        <span class="poke-card__name">${name}</span>
        <span class="poke-card__id">#${id}</span>
      </div>
      <img class="poke-card__image" src="${artwork}" alt="${name}" />
      <div class="poke-card__types">${typeBadges}</div>
      <div class="poke-card__meta">
        <span>Height: ${heightM} m</span>
        <span>Weight: ${weightKg} kg</span>
      </div>
      <div class="poke-card__stats">
        ${statRows}
      </div>
      <div class="poke-card__abilities">
        ${abilityTags}
      </div>
    </div>
  `;
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchPokemon(input.value);
});
quickButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    input.value = name;
    fetchPokemon(name);
  });
});
window.addEventListener("DOMContentLoaded", () => {
  input.value = "pikachu";
  fetchPokemon("pikachu");
});
 