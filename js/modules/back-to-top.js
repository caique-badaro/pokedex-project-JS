const btnBack = document.querySelector(".btn-back-to-top");
const backBtns = Array.from(
  document.querySelectorAll(
    '[data-back-top="hidden"],[data-back-top="visible"]',
  ),
);

export function backToTop() {
  console.log("funcionou", backBtns);

  backBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // altero o status para controlar a visualização
      backBtns.forEach((el) => {
        if (el.dataset.backTop === "visible") {
          el.dataset.backTop = "hidden";
        } else {
          el.dataset.backTop = "visible";
        }
      });
    });
  });

  let teste = [btnBack];

  console.log(teste);
}

// data-back-top="hidden" data-back-top="visible"
