import { loadingAll, allPokemons } from "./filterPokemon.js";
import { popupFavoritePokemon, popupAddFav } from "./favoritePokemon.js";

// estrutura do modal
const popup = document.getElementById("modal-pokemon-details");
export const overlay = document.querySelector(".bg--bottom-sheet-overlay");

// random pokemon btn
const surprisePokemon = [
  document.getElementById("surprise-popup"), // random pokemon btn popup
  document.getElementById("surprise-header-desktop"), // random pokemon header desktop
  document.getElementById("surprise-header-mobile"), // random pokemon navbar mobile
];

// construção objeto com todos os elementos do popup
export const popupElements = {
  id: popup.querySelector("#popup-pokemon-id .body-larger"),
  bgHeader: popup.querySelector("#popup-bg-color"),
  name: popup.querySelector("#modal-pokemon-details .pokemon-name .h2"),
  tagClass: popup.querySelectorAll("#modal-pokemon-details .tag-class"),
  height: popup.querySelector("#modal-pokemon-height .h6"),
  weight: popup.querySelector("#modal-pokemon-weight .h6"),
  image: popup.querySelector("#modal-pokemon-image img"),
  skills: popup.querySelectorAll("#modal-pokemon-details .skill-modal"),
  specialSkills: popup.querySelector("#content-special-skill"),
  controls: [popup, document.querySelector(".controls--bottom-sheet"), overlay],
};

// fechar modal
const closeModal = [document.getElementById("modal-btn-close"), overlay];

export function pokemonDetails(idPokemon) {
  // pre-loading dados
  const pokemon = allPokemons[idPokemon - 1];
  // prevenir erro
  if (!pokemon) return;

  popupElements.controls.forEach((el) => {
    el.dataset.status = "active";
  });
  overlay.dataset.status = "active";
  loadContent(pokemon);
}

// carregar conteúdo
function loadContent(pokemon) {
  let data = popupElements;

  try {
    // id
    data.id.innerText = `# ${pokemon.id}`;
    data.id.dataset.idPokemon = pokemon.id;

    // background modal
    data.bgHeader.className = "";
    data.bgHeader.classList.add("card--image-content", pokemon.types[0]);

    // name
    data.name.innerText = pokemon.name;

    // tag classe pokemon
    data.tagClass.forEach((el, index) => {
      const type = pokemon.types[index];
      const child = el.children;

      if (pokemon.types.length === 2) {
        el.className = "";
        el.classList.add("tag-class", type);
        child[0].src = `icons/white_${type}.svg`;
        child[0].alt = type;
        child[0].title = type;
        child[1].innerText = type;

        data.tagClass[1].style = "display:flex";
      } else if (pokemon.types.length === 1) {
        data.tagClass[1].style = "display:none";

        el.className = "";
        el.classList.add("tag-class", type);
        child[0].src = type
          ? `icons/white_${type}.svg`
          : `icons/white_swords.svg`;
        child[0].alt = type;
        child[0].title = type;
        child[1].innerText = type;
        return;
      }
    });

    // altura e peso
    data.height.innerText = `${pokemon.height} m`;
    data.weight.innerText = `${pokemon.weight} kg`;

    // imagem
    data.image.src = pokemon.img;
    data.image.alt = pokemon.name;
    data.image.title = pokemon.name;

    // imagem gif
    let animateImg =
      data.specialSkills.children[2].querySelectorAll(".img-gif");
    let img = [pokemon.gifFront, pokemon.gifBack];

    for (let i = 0; i < animateImg.length; i++) {
      animateImg[i].src = img[i];
      animateImg[i].alt = pokemon.name;
      animateImg[i].title = pokemon.name;
    }

    // habilidades especiais
    let skillName =
      data.specialSkills.children[1].querySelectorAll(".text-bold");

    skillName.forEach((skillSpecial, index) => {
      skillSpecial.innerText = pokemon.ability[index];
    });

    // skills pokemon
    pokemon.skills.forEach((skill, index) => {
      let value = Object.values(skill)[0];
      let name = Object.keys(skill)[0];
      let key = name.replace(/-/gi, " ");

      let local = data.skills[index].children[0].children;
      let powerBar = data.skills[index].children[1].children[0];

      // nome e valor da skill
      local[0].alt = key;
      local[0].title = key;
      local[2].innerText = value;
      // // barra de poder e valor total
      powerBar.style = `width: ${(value / 160) * 100 + "%"}`;
      powerBar.className = "";
      powerBar.classList.add("value", pokemon.types[0]);
    });

    // poder total
    let power = data.specialSkills.children[3].querySelector(".h6");
    power.innerText = pokemon.power;

    // verifica se o pokemon está na lista de favoritos
    popupFavoritePokemon(Number(data.id.dataset.idPokemon));
  } catch (error) {
    console.error("Falha no carregamento dos dados", error);
  }
}

// random pokémon
surprisePokemon.forEach((btnSurprise) => {
  btnSurprise.addEventListener("click", (e) => {
    const btn =
      e.target.closest("#surprise-popup") ||
      e.target.closest("#surprise-header-desktop") ||
      e.target.closest("#surprise-header-mobile");

    if (!btn) return;

    e.preventDefault();
    let max = allPokemons.length;
    let min = 1;
    let randomId = Math.floor(Math.random() * (max - min + 1) + min);

    pokemonDetails(randomId);
    popupFavoritePokemon(randomId);
  });
});

function fecharModal() {
  // controle para abrir e fechar modal
  closeModal.forEach((el) => {
    el.addEventListener("click", (element) => {
      const localClick =
        element.target.closest("#modal-btn-close") ||
        element.target.closest('[data-type="overlay-bg"]');

      if (!localClick) return;

      element.preventDefault();

      popupElements.controls.forEach((el) => {
        el.dataset.status = "inactive";
      });
      overlay.dataset.status = "inactive";
    });
  });
}

// abrir detalhes do card
document.addEventListener("click", (e) => {
  // valida se o clique foi em favoritar (card)
  if (e.target.classList.value === "favorite") return;

  const click = e.target.closest(".card-pokemon");
  if (!click) return;

  let idText = click.children[0].children[0].children[0].children[0].innerText;
  let pokemonId = idText.replace(/\D+/, "");

  pokemonDetails(pokemonId);
});
fecharModal();
