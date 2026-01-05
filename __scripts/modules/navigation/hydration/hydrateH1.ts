import { slideToggle } from "../../effects/effects";

/**
 *  Adds event listener to toggle the nav when the h1 is clicked
 *
 *  @returns {void}
 */
export const hydrateH1 = (): void => {
  const h1 = document.querySelector<HTMLElement>("header > h1");
  if (h1) {
    h1.addEventListener("click", () => {
      document.querySelectorAll<HTMLElement>("header > nav")?.forEach((el) => {
        slideToggle(el);
      });
    });
    h1.style.cursor = "pointer";
  }
};
