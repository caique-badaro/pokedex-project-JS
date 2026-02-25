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

function applySorting(el) {
  console.log(el);

  // construir aplicação da ordenação
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

        // identifiquei se o clique é em dispositivos mobile
        if (btn.classList.contains("link-mobile")) {
          // viewFilter.innerHTML = controls;
          overlayBG.dataset.status = "active";
          viewFilter.innerHTML = template;
        } else {
          // estilização + comportamento desktop
          // importante: mobile o popup sobrepoe a barra de navegação
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
          const filters = Array.from(
            document.querySelectorAll('[data-filter="enabled"]'),
          );
          const btnApply = controls[1];

          btnApply.addEventListener("click", () => {
            const spanValue = btnApply.querySelector("span");
            if (spanValue && spanValue.dataset.value) {
              const dataValue = spanValue.dataset.value;
              applySorting(dataValue);
              clearChoices();

              if (document.querySelector(".value-filter")) {
                document.querySelector(".value-filter").remove();
              }

              let feedback = `
              <p class="body-larger value-filter">
                ${spanValue.innerText.replace(/[()]/g, "")}
                <img id="clearOrder" src="icons/red_close.svg" alt="Limpar" title="Limpar" /></p>`;

              // feedback escolha de filtro aplicado
              btn.insertAdjacentHTML("beforeend", feedback);
              btnClearFilter();
            }
          });

          function btnClearFilter() {
            let btnClear = document.getElementById("clearOrder");

            btnClear.addEventListener("click", () =>
              document.querySelector(".value-filter").remove(),
            );
          }

          function clearChoices() {
            popup.dataset.status = "hidden";
            popup.style.display = "none";

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
        }
      }),
    );
  });
