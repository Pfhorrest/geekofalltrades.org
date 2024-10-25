import {
  expandSections,
  collapseSections,
  expandAnchorSectionCollapseOthers,
} from "../allSections";

/**
 * Adds event listeners to control toggle-all-sections buttons
 * 
 * @returns {void}
 */
export const hydrateToggleButtons = () => {
  // Only run if there is at least one section in main
  const main = document.querySelector("main");
  if (main && main.querySelector("section")) {
    // Set up the toggle-all-sections-controls container
    const toggleAllControls = main.appendChild(document.createElement("div"));
    toggleAllControls.classList.add("toggleAllControls");

    // Reusable function to create a control with the given class and text
    const createControl = (className: string, text: string) =>
      toggleAllControls.appendChild(
        Object.assign(document.createElement("a"), {
          className,
          innerText: text,
        })
      );

    // Create the controls
    const expandControl = createControl("expandAll", "Expand All");
    // console.log("created expandControl:", expandControl);
    const anchorControl = createControl("anchorTarget", location.hash);
    // console.log("created anchorControl:", anchorControl);
    const collapseControl = createControl("collapseAll", "Collapse All");
    // console.log("created collapseControl:", collapseControl);

    // Duplicate the controls at the bottom
    main.prepend(toggleAllControls.cloneNode(true));

    // Add event listeners
    document.querySelectorAll(".expandAll").forEach((control) => {
      // console.log("Setting up event listener on", control);
      control.addEventListener("click", () => {
        // console.log("Expand all sections");
        expandSections();
      });
    });
    document.querySelectorAll(".anchorTarget").forEach((control) => {
      // console.log("Setting up event listener on", control);
      control.addEventListener("click", () => {
        // console.log("Expand anchor section");
        expandAnchorSectionCollapseOthers();
      });
    });
    document.querySelectorAll(".collapseAll").forEach((control) => {
      // console.log("Setting up event listener on", control);
      control.addEventListener("click", () => {
        // console.log("Collapse all sections");
        collapseSections();
      });
    });
  }
};
