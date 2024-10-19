import { hydrateBreadcrumbs } from "./hydration/hydrateBreadcrumbs";
import { hydrateDropdowns } from "./hydration/hydrateDropdowns";
import { slideToggle } from "../effects/effects";
/**
 *  Adds event listener to toggle the menu when the h1 is clicked
 *
 *  @returns {void}
 */
const hydrateH1 = () => {
    document.querySelector("header > h1")?.addEventListener("click", () => {
        document.querySelectorAll("#menu")?.forEach((el) => {
            slideToggle(el);
        });
    });
};
export const hydrateNavigation = () => {
    document.addEventListener("DOMContentLoaded", () => {
        hydrateH1();
        hydrateBreadcrumbs();
        hydrateDropdowns();
    });
};
//# sourceMappingURL=navigation.js.map