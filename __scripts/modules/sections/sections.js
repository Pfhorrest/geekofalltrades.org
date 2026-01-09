import { enableFlexBalancing } from "../flexBalance/flexBalance";
import { hydrateSectionHeadings } from "./headings";
import { hydrateToggleButtons } from "./allSections/toggleButtons/hydrateToggleButtons";
import { expandAnchorSectionCollapseOthers } from "./allSections/allSections";
import { alternateFigures } from "./figures";
import { toggleToggleButtons } from "./allSections/toggleButtons/toggleToggleButtons";
export const hydrateSections = () => {
    document.addEventListener("DOMContentLoaded", () => {
        enableFlexBalancing(".gallery");
        hydrateSectionHeadings();
        hydrateToggleButtons();
        expandAnchorSectionCollapseOthers();
        alternateFigures();
    });
    window.addEventListener("hashchange", () => {
        toggleToggleButtons();
    });
};
//# sourceMappingURL=sections.js.map