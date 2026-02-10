import { pokemonDetails } from "./pokemonDetails.js";

// favoritar pokemon

const favoritesList = {};
export function favoritePokemon() {
  const btnFav = [...document.querySelectorAll(".card-pokemon .btn-favorite")];
  const idNums = [
    ...document.querySelectorAll(".card-pokemon .tag-id .body-larger"),
  ];

  // apenas dos cards visíveis
  const ids = idNums.map((e) => +e.innerText.replace("#", ""));

  // monitorar pokemons favoritados
  btnFav.forEach((btns) =>
    btns.addEventListener("click", (btn) => {
      const teste = btn.target.closest(".btn-favorite");
      const idNum = btn.target.closest("#popup-pokemon-id .body-larger");
      // console.log(teste);
      teste.style = "background: #000";
      pokemonDetails(false);
    }),
  );

  // console.log(btnFav);
  // console.log(ids);
}
