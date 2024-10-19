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
  // Loop over all nav links
  document
    .querySelectorAll<HTMLElement>("#menu ul li > a")
    .forEach((navLink) => {
      // Get the container of the nav link
      const navContainer = navLink.closest<HTMLElement>("li");
      // Abort if there is none
      if (!navContainer) return;
      // Get the associated submenu
      const submenu = navContainer.querySelector<HTMLElement>("ul");
      if (submenu) {
        // Mark nav link as having a submenu
        navLink.classList.add("submenu");
        navLink.setAttribute("title", "Expand submenu");
        // Add event listener to the nav link
        navLink.addEventListener("click", (e: MouseEvent) => {
          e.preventDefault();
          // console.log(`click event on ${navLink.textContent}`);
          // Save the open/closed state of this dropdown,
          // so we can know if it was open before we closed everything
          const wasCurrent = navContainer.classList.contains("current");
          // If there's any other dropdowns open, close them all
          const anOpenDropdown =
            document.querySelector<HTMLElement>("#menu li.current");
          if (anOpenDropdown && anOpenDropdown != navContainer) {
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
                navContainer.classList.add("current");
                // console.log("setting title to collapse");
                navLink.setAttribute("title", "Collapse submenu");
                slideDown(submenu);
              } else {
                // Otherwise, collapse it
                // console.log("collapsing submenu");
                slideUp(submenu);
                setTimeout(() => {
                  navContainer.classList.remove("current");
                  // console.log("setting title to expand");
                  navLink.setAttribute("title", "Expand submenu");
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
        e.target.classList.contains("submenu")
      )
    ) {
      // Close all dropdowns if so
      // console.log("click outside of a dropdown, closing all");
      closeDropdowns();
    }
  });
};
