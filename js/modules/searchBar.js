import { cardsList, createCard } from "./createCard.js";
import { allPokemons, feedbackText } from "./filterPokemon.js";

console.log(allPokemons);

const searchInput = document.getElementById("search-bar");
const searchbtn = document.getElementById("btn-search");

console.log(searchInput);

let timer;

searchInput.addEventListener("input", (event) => {
  clearTimeout(timer);

  function searchRender(result, terms) {
    const feedback = terms.join(", ");
    const pokemons = result;

    if (pokemons.length === 0) {
      feedbackText.innerHTML = `
        <p class="body-larger">Ops, não localizamos pokémons para o termo: <span class="text-bold">${feedback}</span></p>
        <p class="body-small">Tente novamente com outra palavra-chave</p>`;
    } else {
      feedbackText.innerHTML = `
        <p class="body-larger">Você pesquisou por: <span class="text-bold">${feedback}</span></p>
        <p class="body-small">Foram localizados <span>${pokemons.length}</span> pokémons</p>`;

      // limpar cards
      cardsList.innerHTML = "";
      createCard(pokemons);
    }
  }

  // construção do array com os resultados da busca por nome
  timer = setTimeout(() => {
    let busca = event.target.value;

    const uniqueTerms = [
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

    const searchResults = allPokemons.filter((pokemon) => {
      // dados de referência
      const listName = pokemon.name.toLowerCase();
      const id = pokemon.id.toString();
      const types = pokemon.types;

      return uniqueTerms.some((keyword) => {
        return (
          listName.startsWith(keyword) ||
          id === keyword ||
          types.some((t) => t.startsWith(keyword))
        );
      });
    });
    searchRender(searchResults, uniqueTerms);
  }, 2000);
});
