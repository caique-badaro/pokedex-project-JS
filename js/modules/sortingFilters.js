const overlayBG = document.querySelector(".bg--bottom-sheet-overlay");
const viewFilter = document.querySelector(".filter-mobile");

export function sortCards(cardList) {
  // todos os cards visíveis gerados pela função createCard()
  const cards = Array.from(cardList);
  const grid = document.getElementById("grid-cards");

  return;
  // em andamento
  // filtro abaixo

  // ordernar os cards Z - A
  cards.sort((a, b) => {
    const idA = parseInt(a.dataset.id);
    const idB = parseInt(b.dataset.id);
    return idB - idA;
  });

  grid.innerHTML = "";
  cards.forEach((card) => grid.appendChild(card));
}

// monitorar clique nos botões de ordenação dos cards
const sortingBtn = Array.from(
  document.querySelectorAll('[data-sorting="active"]'),
);

fetch("./partials/sorting-options.html")
  .then((r) => r.text())
  .then((template) => {
    // monitorar clique
    sortingBtn.forEach((btn) =>
      btn.addEventListener("click", (e) => {
        const btn =
          e.target.closest(".link-mobile") || e.target.closest(".link-desktop");

        // validação de segurança
        if (!btn) return;

        e.preventDefault();

        // identifiquei se o clique é em dispositivos mobile
        if (btn.classList.contains("link-mobile")) {
          // viewFilter.innerHTML = controls;
          overlayBG.dataset.status = "active";
          viewFilter.innerHTML = template;
        } else {
          // estilização botão filtros de ordenação somente desktop
          // mobile o bottom sheet sobrepoe a barra de navegação
          btn.dataset.status === "inactive"
            ? (btn.dataset.status = "active")
            : (btn.dataset.status = "inactive");

          btn
            .querySelector(".container")
            .insertAdjacentHTML("beforeend", template);

          const controls = Array.from(document.querySelectorAll(".btn-filter"));

          controls.forEach((btn) =>
            btn.addEventListener("click", (e) => {
              const btn = e.target.closest(".btn-filter");

              if (!btn) return;

              // continuar aqui, incluindo o comportamento de fechar / abrir o painel de filtros
            }),
          );

          console.log(controls);
        }
      }),
    );
  });
