const overlayBG = document.querySelector(".bg--bottom-sheet-overlay");
const viewFilter = document.querySelector(".filter-mobile");
const btnSorting = document.querySelector(".link-desktop:nth-last-child(1)");

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
        e.stopPropagation();
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
          // estilização botão filtros de ordenação desktop
          // mobile o bottom sheet sobrepoe a barra de navegação
          if (!document.querySelector(".sorting-options")) {
            btn.dataset.status = "active";
            btnSorting.insertAdjacentHTML("afterend", template);
          } else {
            let filterPanel = document.querySelector(".sorting-options");
            btn.dataset.status === "active"
              ? ((filterPanel.style = "display: none"),
                (btn.dataset.status = "inactive"))
              : ((filterPanel.style = "display: flex"),
                (btn.dataset.status = "active"));
          }

          // controle exibir/ocultar
          const controls = Array.from(document.querySelectorAll(".btn-filter"));
          const popup = document.querySelector(".sorting-options");

          if (popup.dataset.status === "hidden") {
            popup.style = "display: flex";
            popup.dataset.status = "visible";
          }

          controls.forEach((btnSorting) =>
            btnSorting.addEventListener("click", (e) => {
              const btnSorting = e.target.closest(".btn-filter");

              if (!btnSorting) return;

              // config fechar filtros 'Cancelar'
              if (btnSorting === controls[0]) {
                popup.dataset.status = "hidden";
                popup.style = "display: none";
                btn.dataset.status = "inactive";

                console.log("funcionou", popup.dataset.status);
              }
            }),
          );

          // monitorar clique fora do painel de filtros
          document.addEventListener("click", (event) => {
            if (!popup.contains(event.target)) {
              popup.dataset.status = "hidden";
              popup.style = "display: none";
              btn.dataset.status = "inactive";
            }
          });

          // andamento....... capturar cliques nos filtros + monitorar cliques fora do painel de filtros

          // console.log(controls);
        }
      }),
    );
  });
