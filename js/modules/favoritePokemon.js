import { pokemonDetails } from "./pokemonDetails.js";

localStorage.setItem("idsFavoritos", JSON.stringify([]));
// ids e quantidade de favoritos
let favoritesList = [];
var favCount = 0;
// tag contador nos botões desk e mobile
const tagCounter = [
  document.getElementById("favorites-counter"),
  document.getElementById("favorites-counter-mobile"),
];

export function loadingLocalData() {
  const pokemons = [...document.querySelectorAll(".card-pokemon")];

  // recuperar ids favoritos salvos localmente
  favoritesList = JSON.parse(localStorage.getItem("idsFavoritos"));

  if (favoritesList.length === 0) return;

  favCount += favoritesList.length;
  // controle do contador de favoritos
  tagCounter.forEach((tag) => {
    tag.dataset.status = "active";
    tag.innerText = favoritesList.length;
  });

  // pokemons favoritados (ref. dados locais)
  pokemons.forEach((pokemon) => {
    let cardId = +pokemon
      .querySelector(".card-pokemon .tag-id p")
      .innerText.replace("#", "");

    if (favoritesList.includes(cardId)) {
      let btnFavorite = pokemon.querySelector(".card-pokemon .btn-favorite");

      btnFavorite.dataset.favorite = "true";
      btnFavorite.style = "background: var(--color-white-primary-50)";
      btnFavorite.children[0].src = "icons/bg_red_favorited.svg";
    }
  });
}

function saveLocal() {
  localStorage.setItem("idsFavoritos", JSON.stringify(favoritesList));
}

export function favoritePokemon(cards, pokemonId) {
  // mapeamento dos cards visíveis na tela
  let btnFav = cards;
  let idNums = [...pokemonId];

  // apenas dos cards visíveis
  const ids = idNums.map((e) => +e.innerText.replace("#", ""));
  // const ids = idNums;

  // monitorar pokemons favoritados
  btnFav.forEach((btns, i) =>
    btns.addEventListener("click", (btn) => {
      // clique no botão favoritar e interação com contator de favoritos
      const heartBtn = btn.target.closest(".btn-favorite");

      if (!heartBtn.dataset.favorite) {
        // estilização
        heartBtn.dataset.favorite = "true";
        heartBtn.style = "background: var(--color-white-primary-50)";
        heartBtn.children[0].src = "icons/bg_red_favorited.svg";

        // incluir id na lista de favoritos
        favoritesList = [...new Set([...favoritesList, ids[i]])];

        // controle do contador header e barra navegação (mobile)
        favCount += 1;
        tagCounter.forEach((tag) => {
          tag.dataset.status = "active";
          tag.innerText = favCount;
        });
        saveLocal(); // atualizar dados local
      } else {
        // reverter a estilização
        heartBtn.dataset.favorite = "";
        heartBtn.style = "background: var(--color-white-primary-20)";
        heartBtn.children[0].src = "icons/white_favorite.svg";

        //  remover id na lista de favoritos
        favoritesList = favoritesList.filter((id) => id !== ids[i]);

        // controle do contador header e barra navegação (mobile)
        favCount -= 1;
        tagCounter.forEach((tag) => {
          favCount > 0 ? "" : (tag.dataset.status = "inactive");
          tag.innerText = favCount;
        });
        saveLocal(); // atualizar dados local
      }
      pokemonDetails(false); // impedir que o botão favoritar abra o popup
    }),
  );
}
