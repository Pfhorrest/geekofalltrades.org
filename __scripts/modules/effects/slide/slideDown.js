import { getDuration } from "../helpers/getDuration";
/**
 * Slides the specified element down into view over the specified duration.
 *
 * @param {HTMLElement} element - The element to slide down
 * @param {number} [duration] - The animation duration in milliseconds. Defaults to the element's transition-duration.
 *
 * @returns {void}
 */
export const slideDown = (element, duration = getDuration(element)) => {
    // console.groupCollapsed("slideDown");
    // console.log("slideDown called with element:", element);
    // console.log("slideDown called with duration:", duration);
    // Get the element's initial display and height
    let initialDisplay = window.getComputedStyle(element).display;
    // console.log("initial display:", initialDisplay);
    let initialHeight = element.offsetHeight || 0;
    // console.log("initial height:", initialHeight);
    // Get the element's custom display variable
    const displayVar = getComputedStyle(element).getPropertyValue("--display");
    // console.log("custom display variable:", displayVar);
    // Get the element's inherent height
    // If it's hidden, first remove any local display property
    let inherentDisplay = initialDisplay;
    if (initialDisplay == "none") {
        // console.log("element is currently hidden, removing display property");
        element.style.removeProperty("display");
        // If it's still hidden...
        inherentDisplay = window.getComputedStyle(element).display;
        if (inherentDisplay == "none") {
            // console.log("element is still hidden...");
            if (displayVar && displayVar != "none") {
                // ...set it to its custom display variable
                // console.log("setting display to custom display variable");
                element.style.display = displayVar;
            }
            else {
                // ...or else block
                // console.log("setting display to block");
                element.style.display = "block";
            }
        }
    }
    // Get all the inherent properties of the expanded element
    let inherentHeight = element.offsetHeight;
    // console.log("inherent offsetHeight:", inherentHeight);
    let inherentPaddingTop = parseInt(getComputedStyle(element).paddingTop) || 0;
    // console.log("inherent padding-top:", inherentPaddingTop);
    let inherentRowGap = parseInt(getComputedStyle(element).rowGap) || 0;
    // console.log("inherent row-gap:", inherentRowGap);
    let inherentPaddingBottom = parseInt(getComputedStyle(element).paddingBottom) || 0;
    // console.log("inherent padding-bottom:", inherentPaddingBottom);
    // Set the element's display back to its initial display
    // console.log("setting element.style.display to:", initialDisplay);
    element.style.display = initialDisplay;
    // If the initial height is less than the inherent height, slide the element down
    // console.log(
    //   "initialHeight < inherentHeight:",
    //   initialHeight < inherentHeight
    // );
    if (initialHeight < inherentHeight) {
        // Set the element's overflow to hidden to contain the animation
        // console.log("setting element's overflow to hidden");
        element.style.overflow = "hidden";
        // console.log("element.style.overflow is now:", element.style.overflow);
        // Set the element's transition to ease-in-out
        // console.log("setting element's transition to ease-in-out");
        element.style.transition = `all ${duration}ms ease-in-out`;
        // console.log("element.style.transition is now:", element.style.transition);
        // Set its height to its initial height no matter what
        // console.log(
        //   "setting element.style.height to initial height:",
        //   initialHeight
        // );
        element.style.height = `${initialHeight}px`;
        // console.log("element.style.height is now:", element.style.height);
        // If that's zero and and it's a flex item...
        let parentElement = element.parentElement;
        let parentDisplay;
        // console.log("initial height is", initialHeight);
        if (initialHeight == 0) {
            if (parentElement) {
                // console.log("there is a parent element");
                parentDisplay = getComputedStyle(parentElement).display;
                // console.log("parent display is", parentDisplay);
                if (parentDisplay == "flex") {
                    // Set all its other height components to 0 too
                    // console.log("...so setting padding and row gap to 0");
                    element.style.paddingTop = `0px`;
                    // console.log(
                    //   "element.style.paddingTop is now",
                    //   element.style.paddingTop
                    // );
                    element.style.rowGap = `0px`;
                    // console.log("element.style.rowGap is now", element.style.rowGap);
                    element.style.paddingBottom = `0px`;
                    // console.log(
                    //   "element.style.paddingBottom is now",
                    //   element.style.paddingBottom
                    // );
                }
            }
        }
        // Force a reflow so the starting state is applied
        void element.offsetHeight;
        // Set display appropriately
        // console.log("setting display appropriately non-none");
        element.style.display =
            inherentDisplay != "none"
                ? inherentDisplay
                : displayVar && displayVar != "none"
                    ? displayVar
                    : "block";
        // console.log("element.style.display is now", element.style.display);
        // console.log("setting paddingTop to its inherent value");
        element.style.paddingTop = `${inherentPaddingTop}px`;
        // console.log("element.style.paddingTop is now", element.style.paddingTop);
        // console.log("setting rowGap to its inherent value");
        element.style.rowGap = `${inherentRowGap}px`;
        // console.log("element.style.rowGap is now", element.style.rowGap);
        // console.log("setting paddingBottom to its inherent value");
        element.style.paddingBottom = `${inherentPaddingBottom}px`;
        // console.log(
        //   "element.style.paddingBottom is now",
        //   element.style.paddingBottom
        // );
        // Force a second reflow so the browser commits the start height
        // before transitioning to the expanded height.
        // Without this, height changes may be coalesced and skip the transition.
        // console.log("forcing reflow");
        void element.offsetHeight;
        // console.log("setting height to its inherent value:", inherentHeight);
        element.style.height = `${inherentHeight}px`;
        // console.log("element.style.height is now", element.style.height);
        // Cleanup after transition or fallback timeout
        const cleanup = () => {
            element.style.removeProperty("height");
            element.style.removeProperty("padding-top");
            element.style.removeProperty("row-gap");
            element.style.removeProperty("padding-bottom");
            element.style.removeProperty("overflow");
            element.style.removeProperty("transition");
        };
        element.addEventListener("transitionend", () => {
            // console.log("transitionend fired");
            cleanup();
        }, { once: true });
        // Fallback in case transitionend doesn't fire
        setTimeout(() => {
            // console.log("fallback timeout fired");
            cleanup();
        }, duration + 16);
    }
    // console.groupEnd();
};
//# sourceMappingURL=slideDown.js.map