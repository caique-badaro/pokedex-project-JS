// // controlar a movimentação do carrossel com as tags (tipos de pokemon)

const arrowLeft = document.querySelector('.arrow-carousel[data-arrow="left"]');
const arrowRight = document.querySelector(
  '.arrow-carousel[data-arrow="right"]',
);
const step = 120;
let currentOffset = 0;
let maxScroll = 0;

export function moveCarouselTags() {
  const containerTags = document.getElementById("classTag");
  const carouselWindow = document.querySelector(".carousel-window");

  maxScroll =
    Math.ceil(containerTags.getBoundingClientRect().width) -
    Math.ceil(carouselWindow.getBoundingClientRect().width);

  const move = (direction) => {
    if (direction === "next") {
      currentOffset -= step;
    } else {
      currentOffset += step;
    }

    // trava parar no início
    if (currentOffset > 0) currentOffset = 0;

    // Trava parar no fim, ref maxScroll
    if (Math.abs(currentOffset) >= maxScroll) {
      currentOffset = -(maxScroll + 16);
    }

    containerTags.style.transition = "transform 0.5s ease-out";
    containerTags.style.transform = `translateX(${currentOffset}px)`;
  };

  arrowRight.onclick = () => move("next");
  arrowLeft.onclick = () => move("prev");
}
