import { pokemonDetails } from "./pokemonDetails.js";
import { allPokemons, feedbackText } from "./filterPokemon.js";
import { cardsList, createCard } from "./createCard.js";
import { stopAutoLoading } from "./loadMore.js";

// Inicializar localStorage
if (!localStorage.getItem("idsFavoritos")) {
  localStorage.setItem("idsFavoritos", JSON.stringify([]));
}

let favoritesList = JSON.parse(localStorage.getItem("idsFavoritos"));
let favCount = favoritesList.length;
let observerFav = null;

// tag com o contador quantidade de favoritos
const tagCounter = [
  document.getElementById("favorites-counter"),
  document.getElementById("favorites-counter-mobile"),
];

// botão desk e mobile "favoritos"
export const favPag = document.querySelectorAll(".favorites-page");

function saveLocal() {
  localStorage.setItem("idsFavoritos", JSON.stringify(favoritesList));
}

export function loadingLocalData() {
  const pokemons = [...document.querySelectorAll(".card-pokemon")];
  favoritesList = JSON.parse(localStorage.getItem("idsFavoritos"));

  tagCounter.forEach((tag) => {
    if (!tag) return;
    tag.dataset.status = favoritesList.length > 0 ? "active" : "inactive";
    tag.innerText = favoritesList.length;
  });

  if (favoritesList.length === 0) return;

  pokemons.forEach((pokemon) => {
    const pokemonTag = pokemon.querySelector(".tag-id p");
    if (!pokemonTag) return;

    let cardId = +pokemonTag.innerText.replace("#", "");

    if (favoritesList.includes(cardId)) {
      let btnFavorite = pokemon.querySelector(".btn-favorite");
      if (btnFavorite) {
        btnFavorite.dataset.favorite = "true";
        btnFavorite.style.background = "var(--color-white-primary-50)";
        btnFavorite.children[0].src = "icons/bg_red_favorited.svg";
      }
    }
  });

  // limpar filtros aplicados
  if (document.querySelector(".value-filter"))
    document.querySelector(".value-filter").remove();
  if (document.getElementsByClassName("mobile-feedback"))
    document.getElementsByClassName("mobile-feedback")[0].innerHTML = "";
}

export function favoritePokemon(cards, pokemonId) {
  let btnFav = cards;
  let idNums = [...pokemonId];
  const ids = idNums.map((e) => +e.innerText.replace("#", ""));

  btnFav.forEach((btns, i) => {
    btns.onclick = (btn) => {
      // identificar o botão clicado
      const heartBtn = btn.target.closest(".btn-favorite");
      if (!heartBtn) return;

      // pokémon add aos favoritos
      if (!heartBtn.dataset.favorite) {
        heartBtn.dataset.favorite = "true";
        heartBtn.style.background = "var(--color-white-primary-50)";
        heartBtn.children[0].src = "icons/bg_red_favorited.svg";

        favoritesList = [...new Set([...favoritesList, ids[i]])];
      } else {
        // pokémon removido dos favoritos
        heartBtn.dataset.favorite = "";
        heartBtn.style.background = "var(--color-white-primary-20)";
        heartBtn.children[0].src = "icons/white_favorite.svg";

        favoritesList = favoritesList.filter((id) => id !== ids[i]);
      }

      // atualizar contadores + tag no front
      favCount = favoritesList.length;
      tagCounter.forEach((tag) => {
        if (!tag) return;
        tag.dataset.status = favCount > 0 ? "active" : "inactive";
        tag.innerText = favCount;
      });

      saveLocal();
      pokemonDetails(false);
    };
  });
}

function favoritesPage() {
  // resetar scroll para o topo da página
  window.scrollTo(0, 0);

  // limpar filtros aplicados
  if (document.querySelector(".value-filter"))
    document.querySelector(".value-filter").remove();
  if (document.getElementsByClassName("mobile-feedback"))
    document.getElementsByClassName("mobile-feedback")[0].innerHTML = "";

  favPag.forEach((e) => (e.dataset.status = "active"));

  // ocultar tags de classe
  const carousel = document.querySelector(".carousel-class");
  if (carousel) carousel.innerHTML = "";

  //limpar template busca vazia
  let emptySearch = document.getElementById("empty-search");
  if (emptySearch) emptySearch.innerHTML = "";

  // paro o carregamento infinito dos cards + ocultar animação
  stopAutoLoading();
  const loadingAnim = document.querySelector("#loading-animation");
  if (loadingAnim) loadingAnim.innerHTML = "";

  cardsList.innerHTML = "";

  if (favoritesList.length > 0) {
    feedbackText.innerHTML = `
        <p class="h6"><span class="text-bold">Lista de favoritos</span></p>
        <p class="body-larger">Sua lista contém <span>${favoritesList.length}</span>${favoritesList.length > 1 ? " pokémons" : " pokémon"}</p>`;

    // filtrar e criar os cards
    const favorites = allPokemons.filter((pokemon) =>
      favoritesList.includes(pokemon.id),
    );

    createCard(favorites);
    // começo a monitorar mudanças depois de criar os cards
    liveFavorites();
  } else {
    // quando não há pokemons favoritados
    fetch("./partials/empty-favorite-list.html")
      .then((r) => r.text())
      .then((template) => {
        const container = document.getElementById("empty-search");
        if (!container) return;
        container.innerHTML = template;
        document.getElementById("filter-pokemons").innerHTML = "";
      });
  }
}

favPag.forEach((e) => {
  e.addEventListener("click", (event) => {
    event.preventDefault();
    favoritesPage();
    loadingLocalData();
  });
});

export function liveFavorites() {
  const icons = document.querySelectorAll(".btn-favorite");
  if (icons.length === 0) return;

  if (observerFav) observerFav.disconnect();

  observerFav = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // pokémon removido dos favoritos
      if (
        mutation.attributeName === "data-favorite" &&
        !mutation.target.dataset.favorite
      ) {
        const totalFavoritos = feedbackText.querySelector(".body-larger span");
        const currentVal = parseInt(totalFavoritos.innerText);

        if (totalFavoritos && currentVal === 1) {
          // cria template de lista vazia
          fetch("./partials/empty-favorite-list.html")
            .then((r) => r.text())
            .then((template) => {
              const container = document.getElementById("empty-search");
              if (!container) return;
              feedbackText.innerHTML = "";
              container.innerHTML = template;
              let limpar = document.getElementById("filter-pokemons");
              limpar.innerHTML = "";
            });
        } else if (totalFavoritos && currentVal > 1) {
          // ajusta o título + feedback quantidade
          feedbackText.innerHTML = `
        <p class="h6"><span class="text-bold">Lista de favoritos</span></p>
        <p class="body-larger">Sua lista contém <span>${currentVal - 1}</span>${currentVal === 1 ? " pokémon" : " pokémons"}</p>`;
        }
        // ocultar card removido dos favoritos
        const card = mutation.target.closest(".card-pokemon");
        card.style.display = "none";
      }
    });
  });

  icons.forEach((icon) => {
    observerFav.observe(icon, {
      attributes: true,
      attributeFilter: ["data-favorite"],
    });
  });
}

const popupFavBtn = document.querySelector(
  '[data-button-favorite="available"]',
);

export function popupFavoritePokemon(id) {
  // validação id + reset estilização
  if (!id) return;
  popupFavBtn.dataset.favorite = "";
  popupFavBtn.style.background = "var(--color-white-primary-20)";
  popupFavBtn.children[0].src = "icons/white_favorite.svg";

  // consulta se o pokemon consta na lista de favoritos
  favoritesList.forEach((el) => {
    if (el === id) {
      // se estiver:
      popupFavBtn.dataset.favorite = "true";
      popupFavBtn.style.background = "var(--color-white-primary-50)";
      popupFavBtn.children[0].src = "icons/bg_red_favorited.svg";
    }
  });
  popupAddFav(id);
}

// adicionar ou remover favorito via popup
let favController;

function popupAddFav(id) {
  if (favController) favController.abort();

  favController = new AbortController();
  const { signal } = favController;

  popupFavBtn.addEventListener(
    "click",
    (el) => {
      const btnFav = el.target.closest('[data-button-favorite="available"]');
      if (!btnFav) return;
      el.preventDefault();

      // identificando o id do pokemon no popup
      let currentCard = document
        .querySelector(".body-larger[data-id-pokemon]")
        .innerText.replace("# ", "");

      // variavel com o card exibido no popup
      let card = document.querySelector(
        `.card-pokemon[data-id="${currentCard}"]`,
      );

      // não está na lista de favoritos (adicionar)
      if (!popupFavBtn.dataset.favorite) {
        popupFavBtn.dataset.favorite = "true";
        popupFavBtn.style.background = "var(--color-white-primary-50)";
        popupFavBtn.children[0].src = "icons/bg_red_favorited.svg";

        //atualizar card em segundo plano
        let btnFav = card.querySelector(".btn-favorite");

        btnFav.dataset.favorite = "true";
        btnFav.style.background = "var(--color-white-primary-50)";
        btnFav.children[0].src = "icons/bg_red_favorited.svg";

        // atualizar dados salvos localmente
        favoritesList = [...new Set([...favoritesList, id])];
      } else {
        popupFavBtn.dataset.favorite = "";
        popupFavBtn.style.background = "var(--color-white-primary-20)";
        popupFavBtn.children[0].src = "icons/white_favorite.svg";

        //atualizar card em segundo plano
        let btnFav = card.querySelector(".btn-favorite");

        btnFav.dataset.favorite = "";
        btnFav.style.background = "var(--color-white-primary-20)";
        btnFav.children[0].src = "icons/white_favorite.svg";

        // removi da lista de favoritos
        favoritesList = favoritesList.filter((idLocal) => idLocal !== id);
      }
      saveLocal();
    },
    { signal },
  );
}
