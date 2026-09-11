import { getDuration, delayForEvent } from "../helpers/helpers";

/**
 * Fades in the specified element over the specified duration.
 *
 * @param {HTMLElement} element - The element to fade in
 * @param {number} [duration] - The animation duration in milliseconds (defaults to the element's transition-duration)
 * @param {boolean} [manageDisplay] - Whether to un-hide the element if its display is currently none. Defaults to true.
 *
 * @returns {void}
 */
export const fadeIn = async (
  element: HTMLElement,
  duration: number = getDuration(element),
  manageDisplay: boolean = true,
): Promise<void> => {
  // Log function call with parameters
  // console.groupCollapsed("fadeIn");
  // console.log("fadeIn called with element:", element);
  // console.log("fadeIn called with duration:", duration);
  // Set the element's transition duration
  element.style.transitionDuration = `${duration}ms`;

  // If the element is already visible, use its current opacity as the initial opacity;
  // otherwise, use the value of the --pre-fade-opacity custom property set by fadeOut;
  // or default to 1 if neither is available.
  const initialOpacity =
    parseFloat(element.style.getPropertyValue("--pre-fade-opacity")) || 1;
  element.style.removeProperty("--pre-fade-opacity");
  // console.log("element's restore opacity:", initialOpacity);

  // Set the element's opacity to 0
  element.style.opacity = "0";

  if (manageDisplay) {
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
  }

  // Force a reflow, then set the element's opacity to its initial value
  void element.style.opacity;
  element.style.opacity = `${initialOpacity}`;
  // console.log(`fadeIn engaging for element`, element);

  await delayForEvent(
    element,
    "transitionend",
    (e) => e.propertyName === "opacity",
  );
  // console.log(`fadeIn completed for element`, element);
  // console.groupEnd();

  return new Promise((resolve) => {
    resolve();
  });
};
