export async function pokeapi(offset = 0, limit = 20) {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`,
  );
  const data = await response.json();

  const includeData = await Promise.all(
    data.results.map(async (pokemon) => {
      const r = await fetch(pokemon.url);
      const info = await r.json();

      return {
        id: info.id,
        name: info.name,
        img: info.sprites.other.dream_world.front_default,
        gifFront: info.sprites.other.showdown.front_default,
        gifBack: info.sprites.other.showdown.back_default,
        ability: info.abilities.map((a) => a.ability.name),
        height: info.height / 10,
        weight: info.weight / 10,
        power: info.stats
          .map((a) => a.base_stat)
          .reduce((acc, value) => acc + value, 0),
        skills: info.stats.map((a) => ({
          [a.stat.name]: a.base_stat,
        })),
        types: info.types.map((a) => a.type.name),
      };
    }),
  );
  return includeData;
}
