import { enableFlexBalancing } from "../flexBalance/flexBalance";
import { hydrateSectionHeadings } from "./headings";
import { hydrateToggleButtons } from "./allSections/toggleButtons/hydrateToggleButtons";
import { expandAnchorSectionCollapseOthers } from "./allSections/allSections";
import { alternateFigures } from "./figures";

export const hydrateSections = () => {
  enableFlexBalancing(".gallery");
  hydrateSectionHeadings();
  hydrateToggleButtons();
  expandAnchorSectionCollapseOthers();
  alternateFigures();
};
