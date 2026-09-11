import { getDuration, delayForEvent } from "../helpers/helpers";

/**
 * Fades out the specified element over the specified duration.
 *
 * @param {HTMLElement} element - The element to fade out
 * @param {number} [duration] - The animation duration in milliseconds. Defaults to the element's transition-duration
 * @param {boolean} [manageDisplay] - Whether to set the element's display to none once it has faded out. Defaults to true.
 *
 * @returns {void}
 */
export const fadeOut = async (
  element: HTMLElement,
  duration: number = getDuration(element),
  manageDisplay: boolean = true,
): Promise<void> => {
  // Log function call with parameters
  // console.groupCollapsed("fadeOut");
  // console.log("fadeOut called with element:", element);
  // console.log("fadeOut called with duration:", duration);

  // Capture the element's current opacity before overwriting it, so fadeIn
  // can restore this exact value later instead of assuming full opacity.
  // Skip re-capturing if a value is already stored, so calling fadeOut
  // again before a matching fadeIn can't clobber the true original with 0.
  if (!element.style.getPropertyValue("--pre-fade-opacity")) {
    const currentOpacity = getComputedStyle(element).opacity;
    element.style.setProperty("--pre-fade-opacity", currentOpacity);
  }

  // Set the element's transition duration
  element.style.transitionDuration = `${duration}ms`;

  // Set the element's opacity to 0
  element.style.opacity = "0";
  // console.log(`fadeOut engaging for element`, element);

  await delayForEvent(
    element,
    "transitionend",
    (e) => e.propertyName === "opacity",
  );
  // console.log(`fadeOut completed for element`, element);

  if (manageDisplay) {
    // Force a reflow, then set the element's display to none
    void element.style.display;
    // console.log("fadeOut setting display to none");
    element.style.display = "none";
  }
  // console.groupEnd();

  return new Promise((resolve) => {
    resolve();
  });
};
