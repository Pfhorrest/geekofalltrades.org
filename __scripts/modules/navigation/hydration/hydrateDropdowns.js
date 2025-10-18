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
        // Get the submenu within it, if any
        const submenu = menuItem.querySelector("ul");
        if (submenu) {
            // Mark menu as having a submenu
            menuItem.classList.add("submenu");
            // Get the link within the menu
            const menuItemLink = menuItem.querySelector("a");
            if (menuItemLink) {
                // Mark link as a button
                menuItemLink.role = "button";
                // Add title attribute to the menu link
                menuItemLink.title = "Expand submenu";
                // Add event listener to the menu link
                menuItemLink.addEventListener("click", (e) => {
                    e.preventDefault();
                    // console.log(`click event on ${menuItemLink.textContent}`);
                    // Save the open/closed state of this dropdown,
                    // so we can know if it was open before we closed everything
                    const wasCurrent = menuItem.classList.contains("current");
                    // console.log(`wasCurrent?`, wasCurrent);
                    // If there's any other dropdowns open, close them all
                    const anOpenDropdown = document.querySelector("header > nav > ul > li.current");
                    if (anOpenDropdown && anOpenDropdown != menuItem) {
                        // console.log(`closing other dropdowns`);
                        closeDropdowns();
                    }
                    // console.log(
                    //   `timouting ${wasCurrent ? "collapse" : "expand"} of self`
                    // );
                    // Wait for that if necessary, then...
                    setTimeout(() => {
                        if (!wasCurrent) {
                            // If the dropdown wasn't open before, expand it
                            // console.log("expanding submenu");
                            menuItem.classList.add("current");
                            // console.log("setting title to collapse");
                            menuItemLink.title = "Collapse submenu";
                            menuItemLink.ariaExpanded = "true";
                            slideDown(submenu);
                        }
                        else {
                            // Otherwise, collapse it
                            // console.log("collapsing submenu");
                            slideUp(submenu);
                            setTimeout(() => {
                                menuItem.classList.remove("current");
                                // console.log("setting title to expand");
                                menuItemLink.title = "Expand submenu";
                                menuItemLink.ariaExpanded = "false";
                            }, getDuration(submenu));
                        }
                    }, anOpenDropdown ? getDuration(anOpenDropdown) : 10);
                    return false;
                });
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