import { pokeapi } from "./pokeapi.js";
import { createCard } from "./createCard.js";
import { stopAutoLoading } from "./loadMore.js";
import { favoritePokemon, loadingLocalData } from "./favoritePokemon.js";

// array global com todos os pokémons
export const allPokemons = await loadingAll();

// todos os pokémons
export async function loadingAll() {
  let loading = await pokeapi(0, 151);
  return loading;
}

const cardsList = document.getElementById("grid-cards");
const carouselTags = document.getElementById("classTag");
export const feedbackText = document.getElementById("search-resuls-filter");
let arrTags = [];

export function listTags(allPokemons) {
  allPokemons.forEach((el) => {
    let temp = [];
    el.types.forEach((el) => temp.push(el));

    for (let i = 0; i < temp.length; i++) {
      if (!arrTags.includes(temp[i])) {
        arrTags.push(temp[i]);
      }
    }
  });
  createTags(arrTags);
}
listTags(allPokemons);

export function createTags(tags) {
  tags.forEach((tag) => {
    const tagStructure = document.createElement("div");
    tagStructure.innerHTML = `
      <div class="tag-class ${tag}" data-filter-class="inactive">
        <img class="icon-class-pk" src="icons/white_${tag}.svg" alt="${tag}" title="${tag}"/>
        <p class="body-larger text-bold">${tag}</p>
      </div>
    `;

    carouselTags.appendChild(tagStructure);
  });
}

const tagList = document.querySelectorAll(".tag-class");
const emptySearch = document.getElementById("empty-search");

export function filterTag(elements) {
  elements.forEach((el) => {
    el.addEventListener("click", (e) => {
      // parar evento de loading infinito
      stopAutoLoading();
      document.querySelector("#loading-animation").innerHTML = "";

      const tag = e.target.closest(".tag-class");
      if (!tag) return;

      let filter = tag.innerText || tag.title;

      // feedback visual tags
      tagList.forEach((el) => {
        if (!(el.innerText === filter)) {
          el.dataset.filterClass = "inactive";
        } else {
          el.dataset.filterClass = "active";
        }
      });

      // comparo com o elemento clicado
      let tagFilterApplied = allPokemons.filter((el) =>
        el.types.some((type) => type === filter),
      );

      if (tagFilterApplied.length > 0) {
        // ajuste de ui
        emptySearch.innerHTML = "";
        cardsList.innerHTML = "";
        // criação dos cards
        createCard(tagFilterApplied);
        feedbackText.innerHTML = `
          <p class="body-larger">Você filtrou por
          <span class="text-bold">${filter}</span></p>
          <p class="body-small">Foram localizados <span>${tagFilterApplied.length}</span> pokémons</p>
        `;
        // identificar favoritos
        loadingLocalData();
      } else if (filter === "Todos") {
        // ajuste de ui
        emptySearch.innerHTML = "";
        cardsList.innerHTML = "";
        // criação dos cards
        createCard(allPokemons);
        feedbackText.innerHTML = `
          <p class="body-larger">Você filtrou por
          <span class="text-bold">${filter}</span></p>
          <p class="body-small">Foram localizados <span>${allPokemons.length}</span> pokémons</p>
        `;
        // identificar favoritos
        loadingLocalData();
      } else {
        // ajuste de ui
        emptySearch.innerHTML = "";
        feedbackText.innerHTML = `
          <p class="body-larger">Não localizamos nenhum pokémon para o filtro</p>
        `;
        // identificar favoritos
        loadingLocalData();
      }
    });
  });
}
filterTag(tagList);
