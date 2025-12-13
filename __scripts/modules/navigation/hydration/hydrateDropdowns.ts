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
      // Get the submenu within it, if any
      const submenu = menuItem.querySelector<HTMLElement>("ul");
      if (submenu) {
        // Mark menu as having a submenu
        menuItem.classList.add("submenu");
        // Get the link within the menu
        const menuItemLink = menuItem.querySelector<HTMLElement>("a");
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
          menuItemLink.append(toggle.cloneNode(true) as HTMLElement);
          // Add event listener to the menu link
          menuItemLink
            .querySelectorAll<HTMLElement>(".submenu-toggle")
            ?.forEach((toggle) =>
              toggle.addEventListener("click", (e: MouseEvent) => {
                e.preventDefault();
                // console.log(`click event on ${menuItemLink.textContent}`);
                // Save the open/closed state of this dropdown,
                // so we can know if it was open before we closed everything
                const wasActive = menuItem.classList.contains("active");
                // console.log(`wasActive?`, wasActive);
                // If there's any other dropdowns open, close them all
                const anOpenDropdown = document.querySelector<HTMLElement>(
                  "header > nav > ul > li.active"
                );
                if (anOpenDropdown && anOpenDropdown != menuItem) {
                  // console.log(`closing other dropdowns`);
                  closeDropdowns();
                }
                // console.log(
                //   `timouting ${wasActive ? "collapse" : "expand"} of self`
                // );
                // Wait for that if necessary, then...
                setTimeout(
                  () => {
                    if (!wasActive) {
                      // If the dropdown wasn't open before, expand it
                      // console.log("expanding submenu");
                      menuItem.classList.add("active");
                      // console.log("setting title to collapse");
                      menuItemLink
                        .querySelectorAll<HTMLElement>(".submenu-toggle")
                        ?.forEach((toggle) => {
                          toggle.title = "Collapse submenu";
                          toggle.ariaExpanded = "true";
                        });
                      slideDown(submenu);
                    } else {
                      // Otherwise, collapse it
                      // console.log("collapsing submenu");
                      slideUp(submenu);
                      setTimeout(() => {
                        menuItem.classList.remove("active");
                        // console.log("setting title to expand");
                        menuItemLink
                          .querySelectorAll<HTMLElement>(".submenu-toggle")
                          ?.forEach((toggle) => {
                            toggle.title = "Expand submenu";
                            toggle.ariaExpanded = "false";
                          });
                      }, getDuration(submenu));
                    }
                  },
                  anOpenDropdown ? getDuration(anOpenDropdown) : 0
                );
                return false;
              })
            );
        }
      }
    });

  // Listen for clicks outside of a dropdown
  document.body.addEventListener("click", (e: MouseEvent) => {
    if (
      !(
        e.target instanceof HTMLElement &&
        e.target.classList.contains("submenu-toggle")
      )
    ) {
      // Close all dropdowns if so
      // console.log("click outside of a dropdown, closing all");
      closeDropdowns();
    }
  });
};
