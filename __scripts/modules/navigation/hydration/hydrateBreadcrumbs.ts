import {
  slideUp,
  slideDown,
  getDuration,
  getBreakpoint,
} from "../../effects/effects";
import { closeDropdowns } from "../helpers/closeDropdowns";

/**
 * Adds event listeners to show parent breadcrumbs' subnavs on hover.
 *
 * @returns {void}
 */
export const hydrateBreadcrumbs = (): void => {
  // Get the breakpoint above which any of this matters
  const breakpoint = getBreakpoint();
  // Get the last subnav
  const lastSubnav = document.querySelector<HTMLElement>(
    "header > nav > a:last-of-type + ul"
  );
  // If there are no subnavs, never mind
  if (!lastSubnav) {
    // console.error("No subnav elements found.");
    return;
  }
  // Get the transition duration of the last subnav
  const transitionDuration = getDuration(lastSubnav);
  // Set the hover delay to twice that
  const hoverDelayDuration = 2 * transitionDuration;
  // Extend HTMLElement to add the mouseIn property
  interface MousyHTMLElement extends HTMLElement {
    mouseIn?: boolean;
  }
  // Resuable function to switch subnavs
  let switchSubnav = (targetSubnav: HTMLElement) => {
    // Remove 'current' from all subnavs
    // Slide up any open subnavs
    Array.from(document.querySelectorAll<HTMLElement>("header > nav > a + ul"))
      .filter((subnav) => subnav != targetSubnav)
      .forEach((subnav) => {
        // console.log("about to slide up subnav", subnav);
        slideUp(subnav);
      });
    // Wait the transition duration and then show the target subnav
    // console.log("about to slide down subnav:", targetSubnav);
    setTimeout(() => {
      // (if necessary)
      if (getComputedStyle(targetSubnav).display == "none") {
        slideDown(targetSubnav);
      }
    }, transitionDuration);
  };
  // For every breadcrumb
  document
    .querySelectorAll<MousyHTMLElement>("header > nav > a")
    .forEach((breadcrumb) => {
      // If it has a subnav
      const nextSibling = breadcrumb.nextElementSibling;
      if (
        nextSibling instanceof HTMLElement &&
        nextSibling.tagName.toLowerCase() == "ul"
      ) {
        const thisSubnav = nextSibling as MousyHTMLElement;
        // Listen for when the mouse enters the breadcrumb
        breadcrumb.addEventListener("mouseenter", (e: MouseEvent) => {
          // Mark that the mouse is in the breadcrumb
          breadcrumb.mouseIn = true;
          breadcrumb.classList.add("current");
          // console.log(`Mouse entered breadcrumb '${breadcrumb.innerText}'`);
          if (window.innerWidth >= breakpoint) {
            // If we're above the breakpoint, wait the hover delay then...
            setTimeout(() => {
              // If the mouse is still in the breadcrumb,
              // and didn't just come in from its subnav...
              if (e.relatedTarget != thisSubnav && breadcrumb.mouseIn) {
                // console.log(`switching to '${breadcrumb.innerText}' subnav`);
                switchSubnav(thisSubnav);
              }
            }, hoverDelayDuration);
          }
        });
        // Listen for when the mouse leaves the breadcrumb
        breadcrumb.addEventListener("mouseleave", (e: MouseEvent) => {
          breadcrumb.mouseIn = false;
          // console.log(`Mouse left breadcrumb '${breadcrumb.innerText}'`);
          if (
            window.innerWidth >= breakpoint &&
            e.relatedTarget instanceof HTMLElement &&
            e.relatedTarget.closest("ul") != thisSubnav
          ) {
            // If it's to something other than its subnav, revert to last subnav
            // console.log("...into something other than its subnav, so....");
            // Check if any dropdowns are open
            const anOpenDropdown = document.querySelector<HTMLElement>(
              "header > nav > ul > li.current"
            );
            setTimeout(() => {
              if (
                !breadcrumb.mouseIn &&
                !thisSubnav.mouseIn &&
                !anOpenDropdown
              ) {
                // console.log("removing 'current' class from subnav");
                breadcrumb.classList.remove("current");
                // console.log("Reverting to last subnav");
                switchSubnav(lastSubnav);
              }
            }, hoverDelayDuration);
          }
        });
        // Listen for when the mouse leaves the subnav
        thisSubnav.addEventListener("mouseleave", (e: MouseEvent) => {
          thisSubnav.mouseIn = false;
          // console.log("Mouse left subnav");
          if (
            window.innerWidth >= breakpoint &&
            e.relatedTarget != breadcrumb
          ) {
            // If it's to something other than its breadcrumb, revert to last subnav
            // console.log("...into something other than its breadcrumb, so....");
            // Check if any dropdowns are open
            const anOpenDropdown = document.querySelector<HTMLElement>(
              "header > nav > ul > li.current"
            );
            setTimeout(() => {
              if (
                !breadcrumb.mouseIn &&
                !thisSubnav.mouseIn &&
                !anOpenDropdown
              ) {
                // console.log("removing 'current' class from subnav");
                breadcrumb.classList.remove("current");
                // console.log("Reverting to last subnav");
                switchSubnav(lastSubnav);
              }
            }, hoverDelayDuration);
          }
        });
      } else {
        // console.error(`No subnav found for '${breadcrumb.innerText}'`);
      }
    });
};
