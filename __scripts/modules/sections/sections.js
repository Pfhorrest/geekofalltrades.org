import { toggleSection } from "./someSection/someSection";
import { hydrateToggleButtons } from "./allSections/toggleButtons/hydrateToggleButtons";
import { expandAnchorSectionCollapseOthers } from "./allSections/allSections";
import { toggleToggleButtons } from "./allSections/toggleButtons/toggleToggleButtons";
/**
 * Initializse toggling sections by clicking their headings
 *
 * @returns {void}
 */
const hydrateSectionHeadings = () => {
    // console.groupCollapsed("hydrateSectionHeadings");
    // Find all headings of sections, and for each one ...
    document.querySelectorAll("section > h2, section > h3, section > h4, section > h5, section > h6").forEach((heading) => {
        // Get the section containing the heading
        const section = heading.closest("section");
        // console.log("section:", section);
        // If that exists and has children that aren't headings or descriptions ...
        if (section &&
            Array.from(section.children ?? []).filter((child) => !(child.tagName.toLowerCase() === "h2" ||
                child.tagName.toLowerCase() === "h3" ||
                child.tagName.toLowerCase() === "h4" ||
                child.tagName.toLowerCase() === "h5" ||
                child.tagName.toLowerCase() === "h6" ||
                (child.tagName.toLowerCase() === "p" &&
                    child.classList.contains("description")))).length > 0) {
            // console.log(`Found section '${heading.innerText}' to hydrate`);
            // Make it look clickable
            heading.style.cursor = "pointer";
            // Give it appropriate title and class
            heading.setAttribute("title", "Collapse section");
            section.classList.add("toggleable");
            // Add an event listener to toggle the section when clicked
            heading.addEventListener("click", () => {
                // console.log(`Toggling section '${heading.innerText}'`);
                toggleSection(heading);
            });
        }
    });
    // console.groupEnd();
};
export const hydrateSections = () => {
    document.addEventListener("DOMContentLoaded", () => {
        hydrateSectionHeadings();
        hydrateToggleButtons();
        expandAnchorSectionCollapseOthers();
    });
    window.addEventListener("hashchange", () => {
        toggleToggleButtons();
    });
};
//# sourceMappingURL=sections.js.map