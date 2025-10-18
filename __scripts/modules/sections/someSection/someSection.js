import { collapseSection } from "./collapseSection";
import { expandSection } from "./expandSection";
export { collapseSection, expandSection };
/**
 * Toggles a section from one of its elements
 *
 * @param {HTMLElement} element - A heading element
 *
 * @returns {void}
 */
export const toggleSection = (element) => {
    var _a;
    // console.groupCollapsed("toggleSection called with", element);
    const section = element.closest("section");
    if (section === null || section === void 0 ? void 0 : section.classList.contains("collapsed")) {
        // If the section is collapsed, expand it
        // console.log("Section is collapsed, so expanding");
        expandSection(element);
    }
    else {
        // If the section is expanded, collapse it
        // console.log("Section is not collapsed, so collapsing");
        collapseSection(element);
    }
    // Set the URL hash to the id of the section, if there is one
    // console.log(
    //   "Setting location.hash to",
    //   section?.id ? "'" + section?.id + "'" : "null"
    // );
    location.hash = (_a = section === null || section === void 0 ? void 0 : section.id) !== null && _a !== void 0 ? _a : "";
    // console.groupEnd();
};
//# sourceMappingURL=someSection.js.map