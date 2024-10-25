import { hydrateBreadcrumbs } from "./hydration/hydrateBreadcrumbs";
import { hydrateDropdowns } from "./hydration/hydrateDropdowns";
import { slideToggle } from "../effects/effects";

/**
 *  Adds event listener to toggle the nav when the h1 is clicked
 *
 *  @returns {void}
 */
const hydrateH1 = (): void => {
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

export const hydrateNavigation = () => {
  document.addEventListener("DOMContentLoaded", () => {
    hydrateH1();
    hydrateBreadcrumbs();
    hydrateDropdowns();
  });
};
