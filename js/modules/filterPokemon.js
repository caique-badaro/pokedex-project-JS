import { pokeapi } from "./pokeapi.js";
import { createCard } from "./createCard.js";

let allPokemons = await pokeapi(0, 151);

const cardsList = document.getElementById("grid-cards");
const carouselTags = document.getElementById("classTag");
const feedbackText = document.getElementById("search-resuls-filter");
let arrTags = [];

function listTags(allPokemons) {
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

function createTags(tags) {
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

const tagList = await document.querySelectorAll(".tag-class");

function filterTag(elements) {
  elements.forEach((el) => {
    el.addEventListener("click", (e) => {
      let filter = e.target.innerText || e.target.title;

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
        cardsList.innerHTML = "";
        createCard(tagFilterApplied);
        feedbackText.innerHTML = `
          <p class="body-larger">Você filtrou por
          <span class="text-bold">${filter}</span></p>
          <p class="body-small"><span>${tagFilterApplied.length}</span> resultados</p>
        `;
      } else if (filter === "Todos") {
        createCard(allPokemons);
        feedbackText.innerHTML = `
          <p class="body-larger">Você filtrou por
          <span class="text-bold">${filter}</span></p>
          <p class="body-small"><span>${allPokemons.length}</span> resultados</p>
        `;
      } else {
        feedbackText.innerHTML = `
          <p class="body-larger">Não localizamos nenhum pokémon para o filtro</p>
        `;
      }
    });
  });
}
filterTag(tagList);
