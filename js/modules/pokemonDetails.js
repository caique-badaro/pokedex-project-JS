// (1) configuração para abrir e fechar o modal com todos os detalhes sobre o pokémon selecionado.
// (2) configuração para ativar o botão "surpreenda-me"
import { loadingAll } from "./filterPokemon.js";

const allPokemons = await loadingAll();

const controlsPopup = document.querySelector(".controls--bottom-sheet");
const popup = document.getElementById("modal-pokemon-details");

// construção objeto com todos os elementos do popup
const popupElements = {
  id: popup.querySelector("#popup-pokemon-id .body-larger"),
  bgHeader: popup.querySelector("#popup-bg-color"),
  name: popup.querySelector("#modal-pokemon-details .pokemon-name .h2"),
  tagClass: popup.querySelectorAll("#modal-pokemon-details .tag-class"),
  height: popup.querySelector("#modal-pokemon-height .h6"),
  weight: popup.querySelector("#modal-pokemon-weight .h6"),
  image: popup.querySelector("#modal-pokemon-image img"),
  skills: popup.querySelectorAll("#modal-pokemon-details .skill-modal"),
  specialSkills: popup.querySelector("#content-special-skill"),
  controls: [
    popup, // popup
    document.querySelector(".controls--bottom-sheet"), // controles
    document.getElementById("surprise-popup"), // random pokemon btn
    document.querySelector(".bg--bottom-sheet-overlay"), // overlay
  ],
};

console.log(
  allPokemons[87],
  popupElements.tagClass,
  popupElements.tagClass[0].children[0],
  // popupElements.specialSkills.children[1].querySelectorAll(".special-skill"),
);

// teste
// popupElements.id.innerText = `# ${allPokemons[2].id}`;

popupElements.skills[0].children[1].children[0].style = "width:90%";

export function pokemonDetails(idPokemon) {
  // pre-loading dados
  const pokemon = allPokemons[idPokemon - 1];
  // prevenir erro
  if (!pokemon) return;

  popupElements.controls.forEach((el) => {
    el.dataset.status = "inactive" ? "active" : "";
  });

  loadContent(pokemon);
}
pokemonDetails(88);

function loadContent(pokemon) {
  let data = popupElements;

  // id
  data.id.innerText = `# ${pokemon.id}`;
  // background modal
  data.bgHeader.className = "";
  data.bgHeader.classList.add("card--image-content", pokemon.types[0]);
  // name
  data.name.innerText = pokemon.name;
  // tag classe pokemon
  for (let i = 0; i <= pokemon.types.length; i++) {
    let el = data.tagClass[i];
    let type = pokemon.types[i];

    el.className = type ? type : (el.style = "display:none");

    if (pokemon.types.length > i) {
      el.classList.add("tag-class", type);
      el.children[i].src = `icons/white_${type}.svg`;
      el.children[i].alt = type;
      el.children[i].title = type;
      el.children[i + 1].innerText = type;
    }
  }
  // altura e peso
  data.height.innerText = `${pokemon.height} m`;
  data.weight.innerText = `${pokemon.weight} kg`;
  // imagem
  data.image.src = pokemon.img;
  data.image.alt = pokemon.name;
  data.image.title = pokemon.name;
}

// surprisePopup.addEventListener("click", (el) => {
//   el.preventDefault();
//   let max = allPokemons.length;
//   let min = 1;
//   let randomId = Math.floor(Math.random() * (max - min + 1) + min);

//   if (!(arrDetails[0].id == randomId)) {
//     pokemonDetails(randomId);
//     // console.log(randomId);
//   }

//   // console.log(randomId);
// });
