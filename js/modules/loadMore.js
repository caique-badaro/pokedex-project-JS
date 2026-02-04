import { createCard } from "./createCard.js";
import { pokeapi } from "./pokeapi.js";

// controle para definir o final da lista de pokémons
let offset = 0;
const LIMIT = 20;

export async function loadMore() {
  if (offset < 140) {
    const pokemons = await pokeapi(offset, LIMIT);
    createCard(pokemons);
    offset += LIMIT;
  } else if (offset + LIMIT > 151 && offset === 140) {
    const pokemons = await pokeapi(offset, 11);
    createCard(pokemons);
    offset = 151;
  } else {
    console.log(offset);
  }
}
