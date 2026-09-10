import { getDuration } from "../../effects/effects";
import { expandSection } from "../someSection/expandSection";

/**
 * Expands all subsections (or just id and its parents)
 *
 * @param {string | null} id The id of the anchor section (and its parents) to expand
 *
 * @returns {void}
 */
export const expandSections = async (id?: string | null): Promise<void> => {
  // console.groupCollapsed("expandSections called with", id ?? "no id");

  // Get all headings in sections
  const headings = document.querySelectorAll<HTMLHeadingElement>(
    "section > h2, section > h3, section > h4, section > h5, section > h6",
  );
  // console.log("sections:", headings);

  // Get the section with the given id (the anchor)
  const anchor = id ? document.getElementById(id) : null;
  // console.log("anchor:", anchor);

  // Expand sections that contain the anchor or are parents of the anchor
  const promisedExpansions = Array.from(headings).map(async (heading) => {
    if (!anchor || heading?.closest("section")?.contains(anchor)) {
      // console.log("expanding section", heading.innerText);
      return expandSection(heading);
    }
  });
  await Promise.all(promisedExpansions);

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
