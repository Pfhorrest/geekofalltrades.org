import { getDuration } from "../helpers/getDuration";
import { fadeIn } from "./fadeIn";
import { fadeOut } from "./fadeOut";
export { fadeIn, fadeOut };
/**
 * Fades an element in or out over the specified duration,
 * depending on whether its current opacity is zero or not.
 *
 * @param {HTMLElement} element - The element to toggle the visibility of.
 * @param {number} [duration] - The duration of the animation in milliseconds. Defaults to the element's transition duration.
 *
 * @returns {void}
 */
export const fadeToggle = (element, duration = getDuration(element)) => {
    // Get the element's current opacity
    const currentOpacity = parseFloat(getComputedStyle(element).opacity);
    // Choose the animation function based on the current opacity
    // If the element is visible, it should be faded out
    // If the element is hidden, it should be faded in
    const animationFunction = currentOpacity ? fadeOut : fadeIn;
    // Log the function call with all the parameters
    // console.groupCollapsed("fadeToggle");
    // console.log(`currentOpacity = ${currentOpacity}`);
    // console.log(`animationFunction = ${animationFunction.name}`);
    // console.log(`duration = ${duration}`);
    // console.groupEnd();
    // Call the chosen animation function
    animationFunction(element, duration);
};
//# sourceMappingURL=fadeEffects.js.map