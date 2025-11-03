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
    void element.offsetHeight; // Force a reflow to ensure the height is applied
    // console.log("setting element's height to 0");
    element.style.height = "0";
    element.style.paddingTop = "0";
    element.style.rowGap = "0";
    element.style.paddingBottom = "0";
    // Wait for the transition to complete, then remove all the styles
    const cleanup = () => {
        element.style.display = "none";
        element.style.removeProperty("height");
        element.style.removeProperty("padding-top");
        element.style.removeProperty("row-gap");
        element.style.removeProperty("padding-bottom");
        element.style.removeProperty("overflow");
        element.style.removeProperty("transition");
        element.removeEventListener("transitionend", onTransitionEnd);
    };
    // Define the handler separately so we can remove it
    const onTransitionEnd = (event) => {
        if (event.target === element)
            cleanup();
    };
    element.addEventListener("transitionend", onTransitionEnd, { once: true });
    // Fallback in case transitionend doesn't fire
    setTimeout(() => {
        cleanup();
    }, duration + 16);
    // console.groupEnd();
};
//# sourceMappingURL=slideUp.js.map