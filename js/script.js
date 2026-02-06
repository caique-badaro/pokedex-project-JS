import { pokeapi } from "./modules/pokeapi.js";
import { loadMore } from "./modules/loadMore.js";
import { filterTag, createTags, listTags } from "./modules/filterPokemon.js";
import { pokemonDetails } from "./modules/pokemonDetails.js";

pokeapi();
await loadMore();
// await pokemonDetails(76);
