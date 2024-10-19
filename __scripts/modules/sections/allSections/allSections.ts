import { collapseSections } from "./collapseSections";
import { expandSections } from "./expandSections";
import { toggleToggleButtons } from "../allSections/toggleButtons/toggleToggleButtons";
import { getDuration } from "../../effects/effects";

export { collapseSections, expandSections };

/**
 * Expands anchor section and its parents, collapses all other sections.
 * 
 * @returns {void}
 */
export const expandAnchorSectionCollapseOthers = (): void => {
  // Find the anchor element
  const anchor = document.getElementById(location.hash.substring(1));
  // console.log("Anchor:", anchor);
  // If there is one...
  if (anchor) {
    // ...expand and collapse sections
    // console.log("There is an anchor, so expanding and collapsing sections...");
    collapseSections(anchor.id);
    expandSections(anchor.id);
  } else {
    // ...otherwise just toggle buttons to their correct states
    // console.log("There is no anchor, toggling buttons to correct states");
    toggleToggleButtons();
  }
};
