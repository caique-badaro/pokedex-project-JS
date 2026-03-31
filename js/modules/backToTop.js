const btnBack = document.querySelector(".btn-back-to-top");

const backBtns = Array.from(
  document.querySelectorAll(
    '[data-back-top="hidden"],[data-back-top="visible"]',
  ),
);

export function backToTop() {
  backBtns[1].addEventListener("click", (e) => {
    e.target.dataset.backTop = "hidden";
    backBtns[0].dataset.backTop = "visible";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    const finalizarScroll = () => {
      if (window.scrollY === 0) {
        setTimeout(() => {
          e.target.dataset.backTop = "visible";
          backBtns[0].dataset.backTop = "hidden";
          btnBack.dataset.status = "hidden";
        }, 1000);
        window.removeEventListener("scrollend", finalizarScroll);
      }
    };
    window.addEventListener("scrollend", finalizarScroll);
  });
}

function actionScroll() {
  let lastPosition = 0;

  window.addEventListener("scroll", () => {
    let currentPosition = window.scrollY;

    if (lastPosition - currentPosition < -24) {
      window.requestAnimationFrame(() => {
        btnBack.dataset.status = "hidden";
        lastPosition = currentPosition;
      });
    } else if (lastPosition - currentPosition > 24) {
      btnBack.dataset.status = "visible";
      lastPosition = currentPosition;
    }
  });
}
actionScroll();
