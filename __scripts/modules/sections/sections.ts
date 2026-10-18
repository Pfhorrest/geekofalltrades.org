import { hydrateSectionHeadings } from "./headings";
import { hydrateToggleButtons } from "./allSections/toggleButtons/hydrateToggleButtons";
import { expandAnchorSectionCollapseOthers } from "./allSections/allSections";
import { alternateFigures } from "./figures";
import { enableGridBalancing } from "../layout/gridBalance";

export const hydrateSections = () => {
  enableGridBalancing(".gallery");
  hydrateSectionHeadings();
  hydrateToggleButtons();
  expandAnchorSectionCollapseOthers();
  alternateFigures();
};
