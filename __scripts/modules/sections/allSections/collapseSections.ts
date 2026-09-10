import { getDuration } from "../../effects/effects";
import { collapseSection } from "../someSection/collapseSection";

/**
 * Collapses all sections except for the one with the given id and its parents.
 *
 * @param {string | null} id - The id of the section to not collapse
 *
 * @returns {void}
 */
export const collapseSections = async (id?: string | null): Promise<void> => {
  // console.groupCollapsed("collapseSections called with", id);

  // Get all headings in sections
  const headings = document.querySelectorAll<HTMLElement>(
    "section > h2, section > h3, section > h4, section > h5, section > h6",
  );
  // console.log("sections:", headings);

  // Get the section with the given id (the anchor)
  const anchor = id ? document.getElementById(id) : null;
  // console.log("anchor:", anchor);

  // Collapse all sections that don't contain the anchor
  const promisedCollapses = Array.from(headings).map((heading) => {
    if (!heading.closest("section")?.contains(anchor)) {
      // console.log("collapsing section", heading.innerText);
      return collapseSection(heading);
    }
  });
  await Promise.all(promisedCollapses);

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
};
