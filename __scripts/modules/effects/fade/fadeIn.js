var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDuration } from "../helpers/getDuration";
import { delayForEvent } from "../helpers/helpers";
/**
 * Fades in the specified element over the specified duration.
 *
 * @param {HTMLElement} element - The element to fade in
 * @param {number} [duration] - The animation duration in milliseconds (defaults to the element's transition-duration)
 * @param {boolean} [manageDisplay] - Whether to un-hide the element if its display is currently none. Defaults to true.
 *
 * @returns {void}
 */
export const fadeIn = (element_1, ...args_1) => __awaiter(void 0, [element_1, ...args_1], void 0, function* (element, duration = getDuration(element), manageDisplay = true) {
    // Log function call with parameters
    // console.groupCollapsed("fadeIn");
    // console.log("fadeIn called with element:", element);
    // console.log("fadeIn called with duration:", duration);
    // Set the element's transition duration
    element.style.transitionDuration = `${duration}ms`;
    // If the element is already visible, use its current opacity as the initial opacity;
    // otherwise, use the value of the --pre-fade-opacity custom property set by fadeOut;
    // or default to 1 if neither is available.
    const initialOpacity = parseFloat(element.style.getPropertyValue("--pre-fade-opacity")) ||
        1;
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
    void element.style.display;
    // console.log("fadeIn resetting opacity");
    element.style.opacity = `${initialOpacity}`;
    yield delayForEvent(element, "transitionend", (e) => e.propertyName === "opacity");
    // console.log("fadeIn completed with opacity:", initialOpacity);
    // console.groupEnd();
    return new Promise((resolve) => { resolve(); });
});
//# sourceMappingURL=fadeIn.js.map