import { hydrateBreadcrumbs } from "./hydration/hydrateBreadcrumbs";
import { hydrateDropdowns } from "./hydration/hydrateDropdowns";
import { slideToggle } from "../effects/effects";
/**
 *  Adds event listener to toggle the nav when the h1 is clicked
 *
 *  @returns {void}
 */
const hydrateH1 = () => {
    const h1 = document.querySelector("header > h1");
    if (h1) {
        h1.addEventListener("click", () => {
            var _a;
            (_a = document.querySelectorAll("header > nav")) === null || _a === void 0 ? void 0 : _a.forEach((el) => {
                slideToggle(el);
            });
        });
        h1.style.cursor = "pointer";
    }
};
const highlightCurrent = () => {
    // console.log("highlighting current link...");
    const items = document.querySelectorAll("header > nav ul > li");
    items.forEach((item) => {
        const link = item.querySelector("a");
        if (link) {
            const trimmedLocationHref = window.location.href.replace(/\/$/, "");
            const trimmedLinkHref = link.href.replace(/\/$/, "");
            if (trimmedLocationHref.startsWith(trimmedLinkHref)) {
                // console.log(
                //   `${trimmedLocationHref} starts with ${trimmedLinkHref}`
                // );
                item.classList.add("current");
                // } else {
                //   console.log(
                //     `${trimmedLocationHref} does not start with ${trimmedLinkHref}`
                //   );
            }
        }
    });
};
export const hydrateNavigation = () => {
    document.addEventListener("DOMContentLoaded", () => {
        hydrateH1();
        hydrateBreadcrumbs();
        hydrateDropdowns();
        highlightCurrent();
    });
};
//# sourceMappingURL=navigation.js.map