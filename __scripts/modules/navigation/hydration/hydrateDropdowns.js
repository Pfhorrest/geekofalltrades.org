var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { slideDown, slideUp } from "../../effects/effects";
import { closeDropdowns } from "../helpers/closeDropdowns";
/**
 * Adds event listeners to control dropdown submenu behavior.
 *
 * @returns {void}
 */
export const hydrateDropdowns = () => {
    // console.log("hydrating dropdowns");
    // Loop over all menu links
    document
        .querySelectorAll("header > nav > ul > li")
        .forEach((menuItem) => {
        var _a;
        // Get the submenu within it, if any
        const submenu = menuItem.querySelector("ul");
        if (submenu) {
            // Mark menu as having a submenu
            menuItem.classList.add("submenu");
            // Get the link within the menu
            const menuItemLink = menuItem.querySelector("a");
            if (menuItemLink) {
                // Create the toggle element
                const toggle = document.createElement("button");
                toggle.className = "submenu-toggle";
                toggle.innerHTML = "▼";
                // Add title attribute to the toggle
                toggle.title = "Expand submenu";
                const toggleClone = toggle.cloneNode(true);
                toggleClone.setAttribute("aria-hidden", "true");
                toggleClone.setAttribute("tabindex", "-1");
                menuItemLink.prepend(toggle);
                menuItemLink.append(toggleClone);
                // Add event listener to the menu link
                (_a = menuItemLink
                    .querySelectorAll(".submenu-toggle")) === null || _a === void 0 ? void 0 : _a.forEach((toggle) => toggle.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
                    var _a, _b;
                    e.preventDefault();
                    // console.log(`click event on ${menuItemLink.textContent}`);
                    // Save the open/closed state of this dropdown,
                    // so we can know if it was open before we closed everything
                    const wasActive = menuItem.classList.contains("active");
                    // console.log(`wasActive?`, wasActive);
                    // If there's any other dropdowns open, close them all
                    const anOpenDropdown = document.querySelector("header > nav > ul > li.active");
                    if (anOpenDropdown && anOpenDropdown != menuItem) {
                        // console.log(`closing other dropdowns`);
                        yield closeDropdowns();
                    }
                    if (!wasActive) {
                        // If the dropdown wasn't open before, expand it
                        // console.log("expanding submenu");
                        menuItem.classList.add("active");
                        // console.log("setting title to collapse");
                        (_a = menuItemLink
                            .querySelectorAll(".submenu-toggle")) === null || _a === void 0 ? void 0 : _a.forEach((toggle) => {
                            toggle.title = "Collapse submenu";
                            toggle.ariaExpanded = "true";
                        });
                        yield slideDown(submenu);
                    }
                    else {
                        // Otherwise, collapse it
                        // console.log("collapsing submenu");
                        yield slideUp(submenu);
                        menuItem.classList.remove("active");
                        // console.log("setting title to expand");
                        (_b = menuItemLink
                            .querySelectorAll(".submenu-toggle")) === null || _b === void 0 ? void 0 : _b.forEach((toggle) => {
                            toggle.title = "Expand submenu";
                            toggle.ariaExpanded = "false";
                        });
                    }
                    return false;
                })));
            }
        }
    });
    // Listen for clicks outside of a dropdown
    document.body.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
        if (!(e.target instanceof HTMLElement &&
            e.target.classList.contains("submenu-toggle"))) {
            // Close all dropdowns if so
            // console.log("click outside of a dropdown, closing all");
            yield closeDropdowns();
        }
    }));
};
//# sourceMappingURL=hydrateDropdowns.js.map