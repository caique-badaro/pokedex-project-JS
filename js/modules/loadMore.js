import { cardsList, createCard } from "./createCard.js";
import { pokeapi } from "./pokeapi.js";
import { loadingLocalData } from "./favoritePokemon.js";

// controle para definir o final da lista de pokémons
let offset = 0;
const LIMIT = 20;

export async function loadMore() {
  if (offset < 140) {
    const pokemons = await pokeapi(offset, LIMIT);
    offset += LIMIT;
    createCard(pokemons);
    loadingLocalData();
    autoLoading();
  } else if (offset + LIMIT > 151 && offset === 140) {
    const pokemons = await pokeapi(offset, 11);
    offset = 151;
    createCard(pokemons);
    loadingLocalData();
  } else {
  }
}

// controle do evento de observação
let observer = null;

export function stopAutoLoading() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
}

function autoLoading() {
  const anchor = document.querySelector("#loading-animation");

  if (!anchor) return;
  stopAutoLoading();

  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && offset < 151) {
          loadMore();
        } else if (offset === 151) {
          observer.disconnect();
          anchor.innerHTML = "";
        }
      });
    },
    { threshold: 0.8 },
  );
  observer.observe(anchor);
}

document.getElementById("logo-home").addEventListener("click", () => {
  cardsList.innerHTML = "";
  offset = 0;
});
