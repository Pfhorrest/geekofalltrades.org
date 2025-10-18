import { getDuration } from "../helpers/getDuration";
import { slideDown } from "./slideDown";
import { slideUp } from "./slideUp";

export { slideDown, slideUp };

/**
 * Slides an element in or out over the specified duration,
 * depending on whether its current display is none or not.
 *
 * @param {HTMLElement} element - The element to toggle the visibility of.
 * @param {number} duration - The animation duration in milliseconds. Defaults to the element's transition-duration.
 * 
 * @returns {void}
 */
export const slideToggle = (
  element: HTMLElement,
  duration: number = getDuration(element)
): void => {
  // Get the element's current display
  const isVisible = window.getComputedStyle(element).display != "none";

  // Choose the animation function based on the current opacity
  // If the element is visible, it should be faded out
  // If the element is hidden, it should be faded in
  const animationFunction = isVisible ? slideUp : slideDown;

  // Log the function call with all the parameters
  // console.groupCollapsed("slideToggle");
  // console.log(`isVisible = ${isVisible}`);
  // console.log(`animationFunction = ${animationFunction.name}`);
  // console.log(`duration = ${duration}`);
  // console.groupEnd();

  // Call the chosen animation function
  animationFunction(element, Math.max(10,duration));
};
