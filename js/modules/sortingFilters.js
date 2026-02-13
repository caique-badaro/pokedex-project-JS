export function sortCards(cardList) {
  // todos os cards visíveis gerados pela função createCard()
  const cards = Array.from(cardList);
  const grid = document.getElementById("grid-cards");

  // console.log(grid, cards);

  return;
  // em andamento

  // ordernar os cards Z - A
  cards.sort((a, b) => {
    const idA = parseInt(a.dataset.id);
    const idB = parseInt(b.dataset.id);
    return idB - idA;
  });

  grid.innerHTML = "";
  cards.forEach((card) => grid.appendChild(card));
}
