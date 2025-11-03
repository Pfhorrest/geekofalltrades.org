import { getDuration } from "../helpers/getDuration";

/**
 * Fades in the specified element over the specified duration.
 *
 * @param {HTMLElement} element - The element to fade in
 * @param {number} [duration] - The animation duration in milliseconds (defaults to the element's transition-duration)
 *
 * @returns {void}
 */
export const fadeIn = (
  element: HTMLElement,
  duration: number = getDuration(element)
): void => {
  // Log function call with parameters
  // console.groupCollapsed("fadeIn");
  // console.log("fadeIn called with element:", element);
  // console.log("fadeIn called with duration:", duration);
  // Set the element's transition duration
  element.style.transitionDuration = `${duration}ms`;

  // Get the element's initial opacity
  const initialOpacity = parseFloat(getComputedStyle(element).opacity) || 1;
  // console.log("element's current opacity:", initialOpacity);

  // Set the element's opacity to 0
  element.style.opacity = "0";

  // If the element is hidden, show it
  // console.log("element's initial display:", element.style.display);
  if (window.getComputedStyle(element).display == "none") {
    // console.log("element was initially hidden, removing display property");
    element.style.removeProperty("display");
    // console.log("element's inherent display:", element.style.display);
    if (window.getComputedStyle(element).display == "none") {
      // console.log("element was still hidden, setting display to block");
      element.style.display = "block";
    }
  }

  // Force a reflow, then set the element's display to none
  void element.style.display;
  // console.log("fadeIn resetting opacity");
  element.style.opacity = `${initialOpacity}`;
  // console.log("fadeIn completed with opacity:", initialOpacity);
  // console.groupEnd();
};
