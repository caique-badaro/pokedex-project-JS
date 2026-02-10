export const cardsList = document.getElementById("grid-cards");

export async function createCard(pokemonsInfo) {
  // percorrer array para gerar cards
  pokemonsInfo.forEach((pokemon) => {
    const card = document.createElement("div");
    card.classList.add("card-pokemon");

    // conteúdo card
    card.innerHTML = `
        <div class="card--image-id-fav ${pokemon.types[0]}">
          <div class="card-header">
            <div class="tag-id">
              <p class="body-larger text-bold">#${pokemon.id}</p>
            </div>
            <button class="btn-favorite">
              <img class="favorite" src="icons/white_favorite.svg" alt="Favoritar" />
            </button>
          </div>
          <div class="pokemon-image">
            <img src="${pokemon.img}" alt="${pokemon.name}" title="${pokemon.name}" />
          </div>
        </div>
        <div class="content">
          <div class="name-type">
            <div class="pokemon-name">
              <h6 class="h6 text-bold">${pokemon.name}</h6>
            </div>
            <div class="pokemon-class">
              ${
                pokemon.types[0]
                  ? `
              <div class="tag-class ${pokemon.types[0]}">
                <img
                  class="icon-class-pk"
                  src="${"icons/white_" + pokemon.types[0] + ".svg"}"
                  alt="${pokemon.types[0]}" />
                <p class="body-larger text-bold">${pokemon.types[0]}</p>
              </div>`
                  : ""
              }
              ${
                pokemon.types[1]
                  ? `
              <div class="tag-class ${pokemon.types[1]}">
                <img
                  class="icon-class-pk"
                  src="${"icons/white_" + pokemon.types[1] + ".svg"}"
                  alt="${pokemon.types[1]}" />
                <p class="body-larger text-bold">${pokemon.types[1]}</p>
              </div>`
                  : ""
              }
            </div>
          </div>
          <div class="pokemon-skills">
            <div class="skill">
              <img src="icons/gray_vital_signs.svg" alt="${Object.keys(pokemon.skills[0])}" />
              <p class="body-default">HP</p>
              <p class="body-default">${pokemon.skills[0].hp}</p>
            </div>
            <div class="skill">
              <img src="icons/gray_swords.svg" alt="${Object.keys(pokemon.skills[1])}" />
              <p class="body-default">ATK</p>
              <p class="body-default">${pokemon.skills[1].attack}</p>
            </div>
            <div class="skill">
              <img src="icons/gray_shield.svg" alt="${Object.keys(pokemon.skills[2])}" />
              <p class="body-default">DEF</p>
              <p class="body-default">${pokemon.skills[2].defense}</p>
            </div>
          </div>
          <div class="pokemon-power">
            <div class="power">
              <p class="body-larger text-bold">Poder total</p>
              <p class="body-larger text-bold">${pokemon.power}</p>
            </div>
            <div class="power-bar">
              <div style="width: ${(pokemon.power / 680) * 100 + "%"}" class="value ${pokemon.types[0]}"></div>
            </div>
          </div>
        </div>
    `;

    // adiciona o card dentro do grid
    cardsList.appendChild(card);
  });
}
