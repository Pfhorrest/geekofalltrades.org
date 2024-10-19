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
            });
        }, slideDuration());
    }
    // console.groupEnd();
};
//# sourceMappingURL=incrementSlide.js.map