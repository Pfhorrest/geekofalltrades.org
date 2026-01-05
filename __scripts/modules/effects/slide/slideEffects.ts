import { getDuration } from "../helpers/getDuration";
import { slideDown } from "./slideDown";
import { slideUp } from "./slideUp";

export { slideDown, slideUp };

/**
 * Slides an element in or out over the specified duration,
 * depending on whether its current display is none or not.
 *
 * Dependency injection is supported for testing purposes.
 *
 * @param {HTMLElement} element - The element to toggle the visibility of.
 * @param {number} duration - The animation duration in ms (defaults to element's transition-duration)
 * @param {typeof slideDown} _slideDown - Optional override of slideDown (for testing)
 * @param {typeof slideUp} _slideUp - Optional override of slideUp (for testing)
 * @param {typeof getDuration} _getDuration - Optional override of getDuration (for testing)
 * @returns {void}
 */
export const slideToggle = (
  element: HTMLElement,
  duration?: number,
  _slideDown: typeof slideDown = slideDown,
  _slideUp: typeof slideUp = slideUp,
  _getDuration: typeof import("../helpers/getDuration").getDuration = getDuration
): void => {
  // Compute duration inside the function so mock _getDuration is used
  const computedDuration = duration ?? _getDuration(element);

  // Get the element's current display
  const isVisible = window.getComputedStyle(element).display !== "none";

  // Choose the animation function based on the current opacity
  // If the element is visible, it should be faded out
  // If the element is hidden, it should be faded in
  const animationFunction = isVisible ? _slideUp : _slideDown;

  // Log the function call with all the parameters
  // console.groupCollapsed("slideToggle");
  // console.log(`isVisible = ${isVisible}`);
  // console.log(`animationFunction = ${animationFunction.name}`);
  // console.log(`duration = ${duration}`);
  // console.groupEnd();

  // Call the chosen animation function
  animationFunction(element, computedDuration);
};
