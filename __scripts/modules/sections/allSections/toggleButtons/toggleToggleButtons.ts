/**
 * Toggles (dis)ability of toggle all sections buttons as appropriate
 *
 * @returns {void}
 */
export const toggleToggleButtons = (): void => {
  // Get all sections
  const sections = Array.from(
    document.querySelectorAll<HTMLElement>("section.toggleable")
  );

  // Check if any sections are collapsed
  const anyCollapsed = sections.some((el) =>
    el.classList.contains("collapsed")
  );

  // Check if any sections are not collapsed
  const anyUncollapsed = sections.some(
    (el) => !el.classList.contains("collapsed")
  );

  // If any are collapsed, enable 'expand all' buttons
  document
    .querySelectorAll<HTMLElement>(".expandAll")
    .forEach((el) =>
      anyCollapsed
        ? el.classList.remove("disabled")
        : el.classList.add("disabled")
    );
  // console.log(".expandAll", anyCollapsed ? "enabled" : "disabled");

  // If any are not collapsed, enable 'collapse all' buttons
  document
    .querySelectorAll<HTMLElement>(".collapseAll")
    .forEach((el) =>
      anyUncollapsed
        ? el.classList.remove("disabled")
        : el.classList.add("disabled")
    );
  // console.log(".collapseAll", anyUncollapsed ? "enabled" : "disabled");

  // Get the current anchor, or nothing if there isn't one
  const anchor = document.querySelector(location.hash || ":not(*)");
  // console.log("anchor", anchor);
  document.querySelectorAll<HTMLElement>(".anchorTarget").forEach((el) => {
    // If there's an anchor
    if (anchor) {
      // Set the text content to the text of the anchor
      el.textContent =
        anchor.querySelector("h2, h3, h4, h5, h6")?.textContent || "";
      if (
        // If any collapsed section contains the anchor
        sections.some(
          (section) =>
            section.classList.contains("collapsed") && section.contains(anchor)
        ) ||
        // or any uncollapsed section does not contain the anchor
        sections.some(
          (section) =>
            !(
              section.classList.contains("collapsed") ||
              section.contains(anchor)
            )
        )
      ) {
        // Enable the button
        // console.log(".anchorTarget enabled");
        el.classList.remove("disabled");
      } else {
        // Otherwise disable the button
        // console.log(".anchorTarget disabled");
        el.classList.add("disabled");
      }
      // console.log(".anchorTarget textContent:", el.textContent);
    } else {
      // And if there is no anchor, disable it and remove its label
      // console.log(".anchorTarget disabled");
      el.classList.add("disabled");
      el.textContent = " ";
      // console.log(".anchorTarget textContent:", el.textContent);
    }
  });
};
