import { slideUp, delayForEvent } from "../../effects/effects";

/**
 * Closes all dropdown menus.
 */
export const closeDropdowns = async () => {
  const openDropdowns = document.querySelectorAll<HTMLElement>(
    "header > nav > ul > li > ul",
  );
  const activeMenuItems = document.querySelectorAll<HTMLElement>(
    "header > nav > ul > li.active",
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
    const promisedDeactivations = Array.from(activeMenuItems).map(
      async (item: HTMLElement) => {
        // console.log(item);
        const activeDropdown = item.querySelector<HTMLElement>("ul");
        if (activeDropdown) {
          await delayForEvent(
            activeDropdown,
            "transitionend",
            (e) => e.propertyName === "height",
          );
        }
        item.classList.remove("active");
        const itemLink = item.querySelector<HTMLElement>("a");
        if (itemLink) {
          itemLink.title = "Expand submenu";
          itemLink.ariaExpanded = "false";
        }
      },
    );

    // console.groupEnd();
    await Promise.all(promisedDeactivations);
    return new Promise<void>((resolve) => {
      resolve();
    });
  }
};
