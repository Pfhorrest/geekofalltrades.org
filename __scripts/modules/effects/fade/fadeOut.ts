import { getDuration } from "../helpers/getDuration";

/**
 * Fades out the specified element over the specified duration.
 *
 * @param {HTMLElement} element - The element to fade out
 * @param {number} [duration] - The animation duration in milliseconds. Defaults to the element's transition-duration
 * 
 * @returns {void}
 */
export const fadeOut = (
  element: HTMLElement,
  duration: number = getDuration(element)
): void => {
  // Log function call with parameters
  // console.groupCollapsed("fadeOut");
  // console.log("fadeOut called with element:", element);
  // console.log("fadeOut called with duration:", duration);

  // Set the element's opacity to 0
  element.style.opacity = "0";

  // Wait for the animation duration, then set the element's display to none
  setTimeout(() => {
    // console.log("fadeOut setting display to none");
    element.style.display = "none";
    // console.log("fadeOut completed");
    // console.groupEnd();
  }, duration);
};
