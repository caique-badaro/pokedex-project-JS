import { createCard } from "./createCard.js";
import { allPokemons, feedbackText } from "./filterPokemon.js";

console.log(allPokemons);

const searchInput = document.getElementById("search-bar");
const searchbtn = document.getElementById("btn-search");

console.log(searchInput);

let timer;

searchInput.addEventListener("input", (event) => {
  clearTimeout(timer);

  timer = setTimeout(() => {
    let busca = event.target.value;

    let uniqueTerms = [
      ...new Set(
        busca
          .toLowerCase()
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .split(" ")
          .filter((item) => item !== ""),
      ),
    ];

    // validação array vazio
    if (uniqueTerms.length === 0) return;

    let feedbackTerms = uniqueTerms.join(" ");

    feedbackText.innerHTML = `
        <p class="body-larger">Você pesquisou por: <span class="text-bold">${feedbackTerms}</span></p>
        <p class="body-small">Foram localizados <span>14</span> pokémons</p>`;

    console.log(uniqueTerms, feedbackTerms);
  }, 2000);
});
