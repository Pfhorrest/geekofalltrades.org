import { offScreenObserver } from "./offScreenObserver";
import { isInView } from "./isInView";

/**
 * Hydrates the scroll animations by adding the "off-screen" class to
 * elements that are not in view, and observing them for changes to their
 * visibility.
 * 
 * @returns {void}
 */
export const hydrateScrollAnimation = (): void => {
  // Wait for the DOM to be loaded, then...
  document.addEventListener("DOMContentLoaded", () => {
    // Iterate over select items
    document
      .querySelectorAll<HTMLElement>(
        "main *:not(a, em, strong, i, b, span, img)"
      )
      .forEach((element) => {
        // const elementName =
        //   entry.target.tagName.toLowerCase() +
        //   (entry.target.classList.length > 0
        //     ? "." + Array.from(entry.target.classList).join(".")
        //     : "") +
        //   (entry.target.id ? "#" + entry.target.id : "");
        // console.log(`Processing element: ${elementName}`);

        // If the element is not in view...
        if (!isInView(element, true)) {
          // Add the "off-screen" class
          // console.log(`Element not in view, adding "off-screen" class`);
          element.classList.add("off-screen");
        }
        // Then observe the element for changes to its visibility
        offScreenObserver.observe(element);
      });
  });
};
