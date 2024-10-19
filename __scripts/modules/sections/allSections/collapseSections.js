import { getDuration } from "../../effects/effects";
import { collapseSection } from "../someSection/collapseSection";
/**
 * Collapses all sections except for the one with the given id and its parents.
 *
 * @param {string | null} id - The id of the section to not collapse
 *
 * @returns {void}
 */
export const collapseSections = (id) => {
    // console.groupCollapsed("collapseSections called with", id);
    // Get all headings in sections
    const headings = document.querySelectorAll("section > h2, section > h3, section > h4, section > h5, section > h6");
    // console.log("sections:", headings);
    // Get the section with the given id (the anchor)
    const anchor = id ? document.getElementById(id) : null;
    // console.log("anchor:", anchor);
    // Collapse all sections that don't contain the anchor
    headings.forEach((heading) => {
        if (!heading.closest("section")?.contains(anchor)) {
            // console.log("collapsing section", heading.innerText);
            collapseSection(heading);
        }
    });
    // Scroll to the anchor
    if (anchor) {
        setTimeout(() => {
            location.hash = anchor.id;
            anchor.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "center",
            });
        }, getDuration(anchor));
    }
    // console.groupEnd();
};
//# sourceMappingURL=collapseSections.js.map