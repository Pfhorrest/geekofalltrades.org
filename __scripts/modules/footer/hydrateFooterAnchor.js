var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * Creates sticky anchor that jumps to the footer
 *
 * @returns {void}
 */
export const hydrateFooterAnchor = () => __awaiter(void 0, void 0, void 0, function* () {
    // Get the footer element
    const footer = document.querySelector("footer");
    // Only run if it exists
    if (footer) {
        const anchor = footer.appendChild(document.createElement("button"));
        anchor.id = "footerAnchor";
        anchor.innerHTML =
            "<span class='text'>Contact</span>" +
                "<span class='decor'></span>" +
                "<span class='text'>Control</span>" +
                "<span class='decor'></span>" +
                "<span class='text'>Contrib</span>";
        anchor.title = "Scroll to footer for contact information, site controls, and contribution options";
        // To keep scrolling until we really reach the bottom
        const checkAndScroll = () => {
            if (!(Math.abs(
            // Current scroll position
            window.scrollY -
                // Distance to bottom
                (document.documentElement.scrollHeight - window.innerHeight)) <=
                2 // Margin of error for rounding on Retina displays
            )) {
                window.scrollTo(0, document.documentElement.scrollHeight);
                setTimeout(checkAndScroll, 100);
            }
        };
        // Add event listener
        anchor.addEventListener("click", checkAndScroll);
        // Update footer height
        const footerObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                footer.style.setProperty("--footerHeight", `${entry.borderBoxSize[0].blockSize}px`);
            }
        });
        footerObserver.observe(footer);
        // Update anchor height
        const anchorObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                footer.style.setProperty("--footerAnchorHeight", `${entry.borderBoxSize[0].blockSize}px`);
            }
        });
        anchorObserver.observe(anchor);
    }
});
//# sourceMappingURL=hydrateFooterAnchor.js.map