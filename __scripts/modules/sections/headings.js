import { toggleSection } from "./someSection/someSection";
/**
 * Initializse toggling sections by clicking their headings
 *
 * @returns {void}
 */
export const hydrateSectionHeadings = () => {
    // console.groupCollapsed("hydrateSectionHeadings");
    // Find all headings of sections, and for each one ...
    document.querySelectorAll("section > h2, section > h3, section > h4, section > h5, section > h6").forEach((heading) => {
        var _a;
        // Get the section containing the heading
        const section = heading.closest("section");
        // console.log("section:", section);
        // If that exists and has children that aren't headings or descriptions ...
        if (section &&
            Array.from((_a = section.children) !== null && _a !== void 0 ? _a : []).filter((child) => !(child.tagName.toLowerCase() === "h2" ||
                child.tagName.toLowerCase() === "h3" ||
                child.tagName.toLowerCase() === "h4" ||
                child.tagName.toLowerCase() === "h5" ||
                child.tagName.toLowerCase() === "h6" ||
                (child.tagName.toLowerCase() === "p" &&
                    child.classList.contains("description")))).length > 0) {
            // console.log(`Found section '${heading.innerText}' to hydrate`);
            // Give is a button role
            heading.role = "button";
            // Make it look clickable
            heading.style.cursor = "pointer";
            // Give it appropriate title and class
            heading.title = "Collapse section";
            heading.ariaExpanded = "true";
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
//# sourceMappingURL=headings.js.map