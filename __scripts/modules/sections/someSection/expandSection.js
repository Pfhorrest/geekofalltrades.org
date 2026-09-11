var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fadeIn, getDuration, delayForEvent } from "../../effects/effects";
import { toggleToggleButtons } from "../allSections/toggleButtons/toggleToggleButtons";
/**
 * Expands a section (and all parent sections) from one of its elements
 *
 * @param {HTMLElement} element - An element inside the section to expand
 *
 * @returns {void}
 */
export const expandSection = (element) => {
    // console.groupCollapsed("expandSection called with", element);
    // Get the section containing the element
    let section = element.closest("section");
    // Abort if no section is found
    if (!section)
        return;
    // console.log("section:", section);
    // Get all the parents of the section plus itself
    let sections = [];
    while (section) {
        sections.unshift(section);
        section = section.parentElement;
    }
    sections = sections.filter((section) => section instanceof HTMLElement &&
        section.tagName.toLowerCase() == "section" &&
        section.classList.contains("toggleable"));
    // console.log("sections:", sections);
    // Loop through all the ancestor sections
    sections.forEach((section) => __awaiter(void 0, void 0, void 0, function* () {
        // console.log(`expanding section #${section.id}`);
        // Give the section appropriate class and title
        section.classList.remove("collapsed");
        const element = section.querySelector("h2, h3, h4, h5, h6");
        if (element) {
            element.title = "Collapse section";
            element.ariaExpanded = "true";
        } // Set its min-height to 0px so that it can be animated smoothly
        section.style.setProperty("min-height", `0px`);
        // Get the children of the section that are not headings or descriptions
        const children = Array.from(section.children).filter((child) => child instanceof HTMLElement &&
            !(["h2", "h3", "h4", "h5", "h6"].includes(child.tagName.toLowerCase()) || child.classList.contains("description")));
        let inherentHeight;
        // Save then clear display values for children
        children.forEach((child) => {
            child.setAttribute("data-collapsed-display-value", child.style.display);
            child.style.removeProperty("display");
        });
        // ... so we can grab the inherent height of the section
        inherentHeight = section.offsetHeight;
        // console.log(`inherentHeight:`, inherentHeight);
        // Restore the display values of the children
        children.forEach((child) => {
            if (child.hasAttribute("data-collapsed-display-value")) {
                child.style.setProperty("display", child.getAttribute("data-collapsed-display-value"));
                // child.removeAttribute("data-collapsed-display-value");
            }
        });
        // Set the min-height of the section to the inherent height
        section.style.setProperty("min-height", `${inherentHeight}px`);
        // Wait for the section to expand, then fade in all its children
        yield delayForEvent(section, "transitionend", (e) => e.propertyName === "min-height");
        // console.log(`section #${section.id} expanded, fading in children`);
        children.forEach((child) => {
            // console.log(`fading in child`, child);
            fadeIn(child, getDuration(section));
        });
        // Toggle the state of the toggle buttons
        toggleToggleButtons();
    }));
    // console.groupEnd();
};
//# sourceMappingURL=expandSection.js.map