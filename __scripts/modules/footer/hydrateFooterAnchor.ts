import { getDuration } from "../effects/helpers/helpers";
import { delay, delayForEvent } from "../effects/helpers/delays";

/**
 * Creates sticky anchor that jumps to the footer
 *
 * @returns {void}
 */
export const hydrateFooterAnchor = async (): Promise<void> => {
  // Get the footer element
  const footer = document.querySelector("footer");
  // Only run if it exists
  if (footer) {
    const anchor = footer.appendChild(document.createElement("a"));
    anchor.id = "footerAnchor";
    anchor.innerHTML =
      "<span>Contact</span>" +
      " | " +
      "<span>Control</span>" +
      " | " +
      "<span>Contrib</span>";

    // To keep scrolling until we really reach the bottom
    const checkAndScroll = () => {
      if (
        !(
          Math.abs(
            // Current scroll position
            window.scrollY -
              // Distance to bottom
              (document.documentElement.scrollHeight - window.innerHeight),
          ) <=
          2 // Margin of error for rounding on Retina displays
        )
      ) {
        window.scrollTo(0, document.documentElement.scrollHeight);
        setTimeout(checkAndScroll, 100);
      }
    };

    // Add event listener
    anchor.addEventListener("click", checkAndScroll);

    // Update footer height
    const footerObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        footer.style.setProperty(
          "--footerHeight",
          `${entry.borderBoxSize[0].blockSize}px`,
        );
      }
    });
    footerObserver.observe(footer);

    // Update anchor height
    const anchorObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        footer.style.setProperty(
          "--footerAnchorHeight",
          `${entry.borderBoxSize[0].blockSize}px`,
        );
      }
    });
    anchorObserver.observe(anchor);
  }
};
