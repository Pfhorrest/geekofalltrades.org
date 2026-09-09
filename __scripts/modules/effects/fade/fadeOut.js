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
 * Fades out the specified element over the specified duration.
 *
 * @param {HTMLElement} element - The element to fade out
 * @param {number} [duration] - The animation duration in milliseconds. Defaults to the element's transition-duration
 * @param {boolean} [manageDisplay] - Whether to set the element's display to none once it has faded out. Defaults to true.
 *
 * @returns {void}
 */
export const fadeOut = (element_1, ...args_1) => __awaiter(void 0, [element_1, ...args_1], void 0, function* (element, duration = getDuration(element), manageDisplay = true) {
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
    yield delayForEvent(element, "transitionend", (e) => e.propertyName === "opacity");
    if (manageDisplay) {
        // Force a reflow, then set the element's display to none
        void element.style.display;
        // console.log("fadeOut setting display to none");
        element.style.display = "none";
    }
    return new Promise((resolve) => { resolve(); });
    // console.log("fadeOut completed");
    // console.groupEnd();
});
//# sourceMappingURL=fadeOut.js.map