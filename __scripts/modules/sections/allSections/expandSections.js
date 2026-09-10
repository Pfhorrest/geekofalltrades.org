var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { expandSection } from "../someSection/expandSection";
/**
 * Expands all subsections (or just id and its parents)
 *
 * @param {string | null} id The id of the anchor section (and its parents) to expand
 *
 * @returns {void}
 */
export const expandSections = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // console.groupCollapsed("expandSections called with", id ?? "no id");
    // Get all headings in sections
    const headings = document.querySelectorAll("section > h2, section > h3, section > h4, section > h5, section > h6");
    // console.log("sections:", headings);
    // Get the section with the given id (the anchor)
    const anchor = id ? document.getElementById(id) : null;
    // console.log("anchor:", anchor);
    // Expand sections that contain the anchor or are parents of the anchor
    const promisedExpansions = Array.from(headings).map((heading) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (!anchor || ((_a = heading === null || heading === void 0 ? void 0 : heading.closest("section")) === null || _a === void 0 ? void 0 : _a.contains(anchor))) {
            // console.log("expanding section", heading.innerText);
            return expandSection(heading);
        }
    }));
    yield Promise.all(promisedExpansions);
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
//# sourceMappingURL=expandSections.js.map