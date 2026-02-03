export function pokeapi() {
  fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then((r) => r.json())
    .then((data) => {
      const arr = data.results.map((pokemon, index) => ({
        id: index + 1,
        nome: pokemon.name,
        url: pokemon.url,
      }));

      return Promise.all(
        arr.map((pokemon) =>
          fetch(pokemon.url)
            .then((r) => r.json())
            .then((info) => ({
              ...pokemon,
              img: info.sprites.other.dream_world.front_default,
            })),
        ),
      );
    })
    .then((pokemonsComImagem) => {
      console.log(pokemonsComImagem);
    });
}
