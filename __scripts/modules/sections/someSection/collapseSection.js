var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fadeOut, getDuration, delayForEvent } from "../../effects/effects";
import { toggleToggleButtons } from "../allSections/toggleButtons/toggleToggleButtons";
/**
 * Collapses a section from one of its elements
 *
 * @param {HTMLElement} element - An element inside the section to collapse
 *
 * @returns {void}
 */
export const collapseSection = (element) => __awaiter(void 0, void 0, void 0, function* () {
    // console.groupCollapsed("collapseSection called with", element);
    // Get the section containing the element
    const section = element.closest("section");
    // Abort if no section is found
    if (!section)
        return;
    // console.log("section:", section);
    // Get the duration of the animation
    const duration = getDuration(section);
    // console.log("duration:", duration);
    // Give the section appropriate class and title
    section.classList.add("collapsed");
    element.title = "Expand section";
    element.ariaExpanded = "false";
    // Get the children of the section that are not headings or descriptions
    const children = Array.from(section.children).filter((child) => child instanceof HTMLElement &&
        !(["h2", "h3", "h4", "h5", "h6"].includes(child.tagName.toLowerCase()) ||
            child.classList.contains("description")));
    // Set the min-height of the section to its current height,
    // so that the section can smoothly collapse to 0 height
    let inherentHeight = section.offsetHeight;
    // console.log("fixing section min-height to", inherentHeight);
    section.style.minHeight = `${inherentHeight}px`;
    // Fade out all the applicable children of the section
    const promisedFadeOuts = children.map((child) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log("fading out", child);
        return fadeOut(child, duration);
    }));
    // After the fade outs are complete, set the min-height of the section to 0,
    // and remove the min-height property after the animation is complete
    yield Promise.all(promisedFadeOuts);
    // console.log("setting section min-height to 0");
    section.style.minHeight = "0px";
    yield delayForEvent(section, "transitionend", (e) => e.propertyName === "min-height");
    // console.log("removing section min-height property");
    section.style.removeProperty("min-height");
    // Toggle the state of the toggle buttons
    toggleToggleButtons();
    // console.groupEnd();
});
//# sourceMappingURL=collapseSection.js.map