import { pokeapi } from "./modules/pokeapi.js";
import { loadMore } from "./modules/loadMore.js";
import { filterTag, createTags, listTags } from "./modules/filterPokemon.js";
import { pokemonDetails } from "./modules/pokemonDetails.js";
import {} from "./modules/searchBar.js";
import {
  favoritePokemon,
  loadingLocalData,
} from "./modules/favoritePokemon.js";
import { sortCards } from "./modules/sortingFilters.js";
import { backToTop } from "./modules/back-to-top.js";

pokeapi();
await loadMore();
loadingLocalData();
backToTop();
