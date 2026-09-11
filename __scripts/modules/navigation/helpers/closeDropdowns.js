var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { slideUp, delayForEvent } from "../../effects/effects";
/**
 * Closes all dropdown menus.
 */
export const closeDropdowns = () => __awaiter(void 0, void 0, void 0, function* () {
    const openDropdowns = document.querySelectorAll("header > nav > ul > li > ul");
    const activeMenuItems = document.querySelectorAll("header > nav > ul > li.active");
    if (openDropdowns.length > 0 || activeMenuItems.length > 0) {
        // console.groupCollapsed(
        //   `Closing all dropdowns at ${new Date().toISOString()}`
        // );
        // Slide up all open dropdowns
        openDropdowns.forEach((dropdown) => {
            // Only if they're visible
            if (getComputedStyle(dropdown).display !== "none") {
                // console.log(
                //   `Sliding up '${
                //     dropdown.parentElement?.querySelector("a")?.innerText
                //   }'`
                // );
                slideUp(dropdown);
            }
        });
        // Remove 'active' from all menu items, after the slide-up animations are done
        const promisedDeactivations = Array.from(activeMenuItems).map((item) => __awaiter(void 0, void 0, void 0, function* () {
            // console.log(item);
            const activeDropdown = item.querySelector("ul");
            if (activeDropdown) {
                yield delayForEvent(activeDropdown, "transitionend", (e) => e.propertyName === "height");
            }
            item.classList.remove("active");
            const itemLink = item.querySelector("a");
            if (itemLink) {
                itemLink.title = "Expand submenu";
                itemLink.ariaExpanded = "false";
            }
        }));
        // console.groupEnd();
        yield Promise.all(promisedDeactivations);
        return new Promise((resolve) => {
            resolve();
        });
    }
});
//# sourceMappingURL=closeDropdowns.js.map