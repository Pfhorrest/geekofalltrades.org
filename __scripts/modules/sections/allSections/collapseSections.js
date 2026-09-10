var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { collapseSection } from "../someSection/collapseSection";
/**
 * Collapses all sections except for the one with the given id and its parents.
 *
 * @param {string | null} id - The id of the section to not collapse
 *
 * @returns {void}
 */
export const collapseSections = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // console.groupCollapsed("collapseSections called with", id);
    // Get all headings in sections
    const headings = document.querySelectorAll("section > h2, section > h3, section > h4, section > h5, section > h6");
    // console.log("sections:", headings);
    // Get the section with the given id (the anchor)
    const anchor = id ? document.getElementById(id) : null;
    // console.log("anchor:", anchor);
    // Collapse all sections that don't contain the anchor
    const promisedCollapses = Array.from(headings).map((heading) => {
        var _a;
        if (!((_a = heading.closest("section")) === null || _a === void 0 ? void 0 : _a.contains(anchor))) {
            // console.log("collapsing section", heading.innerText);
            return collapseSection(heading);
        }
    });
    yield Promise.all(promisedCollapses);
    // Scroll to the anchor
    if (anchor) {
        location.hash = anchor.id;
        anchor.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }
    // console.groupEnd();
});
//# sourceMappingURL=collapseSections.js.map