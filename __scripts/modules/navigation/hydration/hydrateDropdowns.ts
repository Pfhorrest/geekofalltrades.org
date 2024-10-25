import {
  slideToggle,
  getDuration,
  slideDown,
  slideUp,
} from "../../effects/effects";
import { closeDropdowns } from "../helpers/closeDropdowns";

/**
 * Adds event listeners to control dropdown submenu behavior.
 * 
 * @returns {void}
 */
export const hydrateDropdowns = (): void => {
  // console.log("hydrating dropdowns");
  // Loop over all menu links
  document
    .querySelectorAll<HTMLElement>("header > nav > ul > li")
    .forEach((menuItem) => {
      // Get the link within it
      const menuItemLink = menuItem.querySelector<HTMLElement>("a");
      // Get the submenu within it, if any
      const submenu = menuItem.querySelector<HTMLElement>("ul");
      if (submenu) {
        // Mark menu as having a submenu
        menuItem.classList.add("submenu");
        // Add title attribute to the menu link
        menuItemLink?.setAttribute("title", "Expand submenu");
        // Add event listener to the menu link
        menuItemLink?.addEventListener("click", (e: MouseEvent) => {
          e.preventDefault();
          // console.log(`click event on ${menuItemLink.textContent}`);
          // Save the open/closed state of this dropdown,
          // so we can know if it was open before we closed everything
          const wasCurrent = menuItem.classList.contains("current");
          // console.log(`wasCurrent?`, wasCurrent);
          // If there's any other dropdowns open, close them all
          const anOpenDropdown =
            document.querySelector<HTMLElement>("header > nav > ul > li.current");
          if (anOpenDropdown && anOpenDropdown != menuItem) {
            // console.log(`closing other dropdowns`);
            closeDropdowns();
          }
          // console.log(
          //   `timouting ${wasCurrent ? "collapse" : "expand"} of self`
          // );
          // Wait for that if necessary, then...
          setTimeout(
            () => {
              if (!wasCurrent) {
                // If the dropdown wasn't open before, expand it
                // console.log("expanding submenu");
                menuItem.classList.add("current");
                // console.log("setting title to collapse");
                menuItemLink.setAttribute("title", "Collapse submenu");
                slideDown(submenu);
              } else {
                // Otherwise, collapse it
                // console.log("collapsing submenu");
                slideUp(submenu);
                setTimeout(() => {
                  menuItem.classList.remove("current");
                  // console.log("setting title to expand");
                  menuItemLink.setAttribute("title", "Expand submenu");
                }, getDuration(submenu));
              }
            },
            anOpenDropdown ? getDuration(anOpenDropdown) : 10
          );
          return false;
        });
      }
    });

  // Listen for clicks outside of a dropdown
  document.body.addEventListener("click", (e: MouseEvent) => {
    if (
      !(
        e.target instanceof HTMLElement &&
        e.target.closest("li")?.classList.contains("submenu")
      )
    ) {
      // Close all dropdowns if so
      // console.log("click outside of a dropdown, closing all");
      closeDropdowns();
    }
  });
};
