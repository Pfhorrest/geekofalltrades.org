import { slideToggle } from "../../effects/effects";
/**
 *  Adds event listener to toggle the nav when the h1 is clicked
 *
 *  @returns {void}
 */
export const hydrateH1 = () => {
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
//# sourceMappingURL=hydrateH1.js.map