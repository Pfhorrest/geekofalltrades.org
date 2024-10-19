import { slideUp, getDuration } from "../../effects/effects";

/**
 * @description
 * Closes all dropdown menus.
 */
export const closeDropdowns = () => {
  const openDropdowns =
    document.querySelectorAll<HTMLElement>("#menu ul li ul");
  const currentMenus = document.querySelectorAll<HTMLElement>(
    "#menu ul li.current"
  );
  if (openDropdowns.length > 0 || currentMenus.length > 0) {
    // console.groupCollapsed(
    //   `Closing all dropdowns at ${new Date().toISOString()}`
    // );

    // Slide up all open dropdowns
    openDropdowns.forEach((dropdown) => {
      // Only if they're visible
      if (dropdown.style.display != "none") {
        // console.log(
        //   `Sliding up '${
        //     dropdown.parentElement?.querySelector("a")?.innerText
        //   }'`
        // );
        slideUp(dropdown);
      }
    });

    // Remove 'current' from all menus, after the slide-up animations are done
    currentMenus.forEach((menu) => {
      // console.log(
      //   `Setting timeout for '${menu.querySelector("a")?.innerText}'`
      // );
      setTimeout(() => {
        // console.log(
        //   `Removing 'current' from '${menu.querySelector("a")?.innerText}'`
        // );
        menu.classList.remove("current");
        menu
          ?.querySelector<HTMLElement>("a")
          ?.setAttribute("title", "Collapse submenu");
      }, getDuration(menu));
    });

    console.groupEnd();
  }
};
