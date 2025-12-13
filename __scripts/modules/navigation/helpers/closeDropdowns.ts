import { slideUp, getDuration } from "../../effects/effects";

/**
 * @description
 * Closes all dropdown menus.
 */
export const closeDropdowns = () => {
  const openDropdowns = document.querySelectorAll<HTMLElement>(
    "header > nav > ul > li > ul"
  );
  const activeMenuItems = document.querySelectorAll<HTMLElement>(
    "header > nav > ul > li.active"
  );
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
    activeMenuItems.forEach((item) => {
      // console.log(
      //   `Setting timeout for '${item.querySelector("a")?.innerText}'`
      // );
      setTimeout(() => {
        // console.log(item);
        item.classList.remove("active");
        const itemLink = item.querySelector<HTMLElement>("a");
        if (itemLink) {
          itemLink.title = "Expand submenu";
          itemLink.ariaExpanded = "true";
        }
      }, getDuration(item));
    });

    // console.groupEnd();
  }
};
