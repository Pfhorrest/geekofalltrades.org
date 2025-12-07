import { getDuration, slideDown, slideUp, } from "../../effects/effects";
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
                const toggle = document.createElement("span");
                toggle.className = "submenu-toggle";
                toggle.setAttribute("aria-hidden", "true");
                toggle.innerHTML = "▼";
                // Mark toggle as a button
                toggle.role = "button";
                // Add title attribute to the toggle
                toggle.title = "Expand submenu";
                menuItemLink.prepend(toggle);
                menuItemLink.append(toggle.cloneNode(true));
                // Add event listener to the menu link
                (_a = menuItemLink
                    .querySelectorAll(".submenu-toggle")) === null || _a === void 0 ? void 0 : _a.forEach((toggle) => toggle.addEventListener("click", (e) => {
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
                        closeDropdowns();
                    }
                    // console.log(
                    //   `timouting ${wasActive ? "collapse" : "expand"} of self`
                    // );
                    // Wait for that if necessary, then...
                    setTimeout(() => {
                        var _a;
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
                            slideDown(submenu);
                        }
                        else {
                            // Otherwise, collapse it
                            // console.log("collapsing submenu");
                            slideUp(submenu);
                            setTimeout(() => {
                                var _a;
                                menuItem.classList.remove("active");
                                // console.log("setting title to expand");
                                (_a = menuItemLink
                                    .querySelectorAll(".submenu-toggle")) === null || _a === void 0 ? void 0 : _a.forEach((toggle) => {
                                    toggle.title = "Expand submenu";
                                    toggle.ariaExpanded = "false";
                                });
                            }, getDuration(submenu));
                        }
                    }, anOpenDropdown ? getDuration(anOpenDropdown) : 10);
                    return false;
                }));
            }
        }
    });
    // Listen for clicks outside of a dropdown
    document.body.addEventListener("click", (e) => {
        var _a;
        if (!(e.target instanceof HTMLElement &&
            ((_a = e.target.closest("li")) === null || _a === void 0 ? void 0 : _a.classList.contains("submenu")))) {
            // Close all dropdowns if so
            // console.log("click outside of a dropdown, closing all");
            closeDropdowns();
        }
    });
};
//# sourceMappingURL=hydrateDropdowns.js.map