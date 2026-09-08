import { fadeOut, fadeIn } from "../effects/effects";
import { showSlide } from "./showSlide";
import { slideDuration, slideIndex } from "./lightboxState";
/**
 * Steps forward through the slideshow (or backward if negative)
 *
 * @param {number} stepCount - The number of slides to step forward (or backward if negative)
 *
 * @returns {void}
 */
export const incrementSlide = (stepCount) => {
    // console.groupCollapsed(`Incrementing slide by ${stepCount}.`);
    // Restart loading spinner animation
    const lightbox = document.querySelector("#lightbox");
    lightbox === null || lightbox === void 0 ? void 0 : lightbox.classList.remove("loaded");
    const lightboxImage = document.querySelector("#lightboxImage");
    if (lightboxImage) {
        // Fade out the image
        fadeOut(lightboxImage, slideDuration());
        // Wait until the fade out is complete and remove the src attribute
        setTimeout(() => {
            // console.log("Fade out complete. Removing src attribute.");
            lightboxImage.setAttribute("src", "");
            // Show the new slide
            showSlide(slideIndex(slideIndex() + stepCount));
            // Wait for the new image to load
            lightboxImage.addEventListener("load", () => {
                // Fade in the new image
                // console.log("Image loaded. Fading in.");
                fadeIn(lightboxImage, slideDuration());
                setTimeout(() => {
                    // Stop loading spinner animation
                    lightbox === null || lightbox === void 0 ? void 0 : lightbox.classList.add("loaded");
                }, 2 * slideDuration());
            });
        }, slideDuration());
    }
    // console.groupEnd();
};
//# sourceMappingURL=incrementSlide.js.map