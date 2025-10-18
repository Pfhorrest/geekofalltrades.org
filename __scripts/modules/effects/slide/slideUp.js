import { getDuration } from "../helpers/getDuration";
/**
 * Slides the specified element up out of view over the specified duration.
 *
 * @param {HTMLElement} element - The element to slide up
 * @param {number} [duration] - The animation duration in milliseconds (defaults to the element's transition-duration)
 *
 * @returns {void}
 */
export const slideUp = (element, duration = getDuration(element)) => {
    // console.groupCollapsed("slideUp");
    // console.log("slideUp called with element:", element);
    // console.log("slideUp called with duration:", duration);
    // Set the element's overflow to hidden to contain the animation
    // console.log("setting element's overflow to hidden");
    element.style.overflow = "hidden";
    // Set the element's transition to ease-in-out
    // console.log("setting element's transition to ease-in-out");
    element.style.transition = `all ${duration}ms ease-in-out`;
    // Set the element's height to its current height in pixels
    // console.log("setting element's height to its current height:", element.offsetHeight);
    element.style.height = `${element.offsetHeight}px`;
    // Wait for the next frame to be rendered, then set the element's height to 0
    setTimeout(() => {
        // console.log("setting element's height to 0");
        element.style.height = "0";
        element.style.paddingTop = "0";
        element.style.rowGap = "0";
        element.style.paddingBottom = "0";
    }, 100);
    // Wait for the animation to complete, then remove all the styles
    setTimeout(() => {
        // console.log("setting element's display to none");
        element.style.display = "none";
        element.style.removeProperty("height");
        element.style.removeProperty("padding-top");
        element.style.removeProperty("row-gap");
        element.style.removeProperty("padding-bottom");
        element.style.removeProperty("overflow");
        element.style.removeProperty("transition");
    }, Math.max(10, duration));
    // console.groupEnd();
};
//# sourceMappingURL=slideUp.js.map