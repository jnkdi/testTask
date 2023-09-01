// "use strict";

const mobileMenuButton = document.querySelector(".burger-menu");
const header = document.querySelector("header");

mobileMenuButton.addEventListener("click", () => {
  header.classList.toggle("menu-open");
});
