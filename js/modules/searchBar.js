import { cardsList, createCard } from "./createCard.js";
import { allPokemons, feedbackText } from "./filterPokemon.js";
import { stopAutoLoading } from "./loadMore.js";
import { loadingLocalData } from "./favoritePokemon.js";
import { pokemonDetails } from "./pokemonDetails.js";

const searchInput = document.getElementById("search-bar");
const searchbtn = document.getElementById("btn-search");

let timer;

searchInput.addEventListener("input", (event) => {
  clearTimeout(timer);
  let busca = event.target.value;

  function searchRender(result, terms) {
    const feedback = terms.join(", ");
    const pokemons = result;

    stopAutoLoading();
    document.querySelector("#loading-animation").innerHTML = "";
    const tagList = document.querySelectorAll(".tag-class");

    if (pokemons.length === 0) {
      // limpar resultado
      cardsList.innerHTML = "";
      feedbackText.innerHTML = "";

      // importar trecho html busca vazia
      fetch("./partials/empty-search.html")
        .then((r) => r.text())
        .then((template) => {
          document.getElementById("empty-search").innerHTML = template;
          document.querySelector("#empty-search .content .h6 span").innerText =
            feedback;

          let surprise = document.getElementById("surprise-empty-search");

          surprise.addEventListener("click", (event) => {
            if (event.target.closest("surprise-empty-search")) return;
            event.preventDefault();
            let max = allPokemons.length;
            let min = 1;
            let randomId = Math.floor(Math.random() * (max - min + 1) + min);

            pokemonDetails(randomId);
          });
        });
      document.getElementById("search-bar").value = "";
      // ajuste na estilização da tag todos
      tagList.forEach((tag) => (tag.dataset.filterClass = "inactive"));
      loadingLocalData();
    } else {
      feedbackText.innerHTML = `
        <p class="body-larger">Você pesquisou por: <span class="text-bold">${feedback}</span></p>
        <p class="body-small">${pokemons.length > 1 ? `Foram localizados ` : `Foi localizado `}<span>${pokemons.length}</span>${pokemons.length > 1 ? ` pokémons` : ` pokémon`}</p>`;

      // limpar cards
      cardsList.innerHTML = "";
      document.getElementById("search-bar").value = "";
      createCard(pokemons);
      // ajuste na estilização de todas as tags
      tagList.forEach((tag) => (tag.dataset.filterClass = "inactive"));
      loadingLocalData();
    }
  }

  // construção do array com os resultados da busca por nome
  timer = setTimeout(() => {
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
          listName.includes(keyword) ||
          id === keyword ||
          types.some((t) => t.startsWith(keyword))
        );
      });
    });
    searchRender(searchResults, uniqueTerms);
  }, 2000);
});
