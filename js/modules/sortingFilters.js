const btnSorting = document.querySelector(".content-block .link-desktop");
const grid = document.getElementById("grid-cards");

// cards visíveis
let cards;

export function sortCards(cardList) {
  // todos os cards visíveis gerados pela função createCard()
  return (cards = Array.from(cardList));
}

function applySorting(orderValue) {
  if (!orderValue) return;

  function sortedCards(cards) {
    cards.forEach((card) => grid.appendChild(card));
  }

  // força: maior - menor
  if (orderValue === "strong" || orderValue === "weak") {
    const result = cards.toSorted((a, b) => {
      const powerA = parseInt(a.dataset.power) || 0;
      const powerB = parseInt(b.dataset.power) || 0;

      return orderValue === "strong" ? powerB - powerA : powerA - powerB;
    });
    sortedCards(result);
  }

  // nome: A-Z - Z-A
  if (orderValue === "A-Z" || orderValue === "Z-A") {
    const result = cards.toSorted((a, b) => {
      const nameA = a.dataset.name;
      const nameZ = b.dataset.name;

      return orderValue === "A-Z"
        ? nameA.localeCompare(nameZ)
        : nameZ.localeCompare(nameA);
    });
    sortedCards(result);
  }

  // id: maior - menor
  if (orderValue === "0-9" || orderValue === "9-0") {
    const result = cards.toSorted((a, b) => {
      const idA = parseInt(a.dataset.id) || 0;
      const idB = parseInt(b.dataset.id) || 0;

      return orderValue === "0-9" ? idA - idB : idB - idA;
    });
    sortedCards(result);
  }
}

// monitorar clique nos botões odernação (desktop e mobile)
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

        // validacao filtro existe?
        if (!document.querySelector(".sorting-options")) {
          // não existe
          btn.dataset.status = "active";
          btnSorting.insertAdjacentHTML("afterend", template);
        } else {
          // já existe
          let filterPanel = document.querySelector(".sorting-options");
          btn.dataset.status === "active" || btn.dataset.status === "hidden"
            ? ((filterPanel.style = "display: none"),
              (btn.dataset.status = "inactive"))
            : ((filterPanel.style = "display: flex"),
              (btn.dataset.status = "active"));
        }

        if (btn.classList.contains("link-mobile")) {
          let footer = document.querySelector("footer");

          if (!document.querySelector(".bg--filter-overlay")) {
            const overlay = document.createElement("div");
            overlay.classList.add("bg--filter-overlay");

            footer.insertAdjacentElement("beforebegin", overlay);
          }
        }

        // controle exibir/ocultar
        const controls = Array.from(document.querySelectorAll(".btn-filter"));
        const btnApply = controls[1];
        const popup = document.querySelector(".sorting-options");
        const filters = Array.from(
          document.querySelectorAll('[data-filter="enabled"]'),
        );
        const mobileFeedback = document.querySelector(".mobile-feedback");

        btnApply.addEventListener("click", () => {
          const spanValue = btnApply.querySelector("span");
          if (spanValue && spanValue.dataset.value) {
            const dataValue = spanValue.dataset.value;

            // spanValue.dataset.value definido na function activeChoice()
            applySorting(dataValue);
            clearChoices();

            if (document.querySelector(".value-filter")) {
              document.querySelector(".value-filter").remove();
            }

            if (btn.classList.contains("link-desktop")) {
              let feedback = `
                  <p class="body-larger value-filter">
                    ${spanValue.innerText.replace(/[()]/g, "")}
                    <img id="clearOrder" src="icons/red_close.svg" alt="Limpar" title="Limpar"/></p>`;

              // feedback escolha de filtro aplicado
              btn.insertAdjacentHTML("beforeend", feedback);
            } else if (btn.classList.contains("link-mobile")) {
              mobileFeedback.innerHTML = `
                <p class="body-small">Ordenado por:</p>
                  <p class="body-default value-filter">${spanValue.innerText.replace(/[()]/g, "")}<img id="clearOrder" src="icons/red_close.svg" alt="Limpar" title="Limpar" /></p>  
              `;
            }
            btnClearFilter();
          }
        });

        function btnClearFilter() {
          let btnClear = document.getElementById("clearOrder");

          btnClear.addEventListener("click", () => {
            document.querySelector(".value-filter").remove();
            if (mobileFeedback) mobileFeedback.innerHTML = "";
          });
        }

        function clearChoices() {
          popup.dataset.status = "hidden";
          popup.style.display = "none";

          let overlayFilter = document.querySelector(".bg--filter-overlay");

          if (overlayFilter) overlayFilter.remove();

          if (typeof btn !== "undefined") btn.dataset.status = "inactive";

          if (btnApply.dataset.status === "disabled") return;
          else {
            btnApply.dataset.status = "disabled";
            btnApply.innerHTML = "Aplicar";
            filters.forEach((el) => el.classList.remove("selected"));
          }
        }

        function activeChoice(dataValue, textOrder) {
          btnApply.dataset.status = "active";
          btnApply.innerHTML = `<p class="body-larger text-bold">Aplicar<span class="body-default text-regular" data-value="${dataValue}"> (${textOrder})</span></p>`;
        }

        filters.forEach((filterBtn) =>
          filterBtn.addEventListener("click", (choice) => {
            filters.forEach((el) => el.classList.remove("selected"));
            choice.currentTarget.classList.add("selected");

            let dataValue = choice.currentTarget.dataset.order;
            let textOrder = choice.currentTarget.innerText;

            activeChoice(dataValue, textOrder);
          }),
        );

        // fechar filtros btn cancelar
        controls.forEach((btnSorting) =>
          btnSorting.addEventListener("click", (e) => {
            const targetBtn = e.target.closest(".btn-filter");
            if (!targetBtn) return;

            if (targetBtn === controls[0]) {
              clearChoices();
            }
          }),
        );

        // monitorar clique fora do painel de filtros
        document.addEventListener("click", (event) => {
          if (
            popup &&
            !popup.contains(event.target) &&
            typeof btn !== "undefined" &&
            !btn.contains(event.target)
          ) {
            clearChoices();
          }
        });
      }),
    );
  });
