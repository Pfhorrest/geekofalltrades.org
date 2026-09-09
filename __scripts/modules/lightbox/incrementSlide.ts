import { fadeOut, fadeIn } from "../effects/effects";
import { showSlide } from "./showSlide";
import { slideDuration, slideIndex } from "./lightboxState";
import { delayForEvent } from "../effects/helpers/helpers";

/**
 * Steps forward through the slideshow (or backward if negative)
 *
 * @param {number} stepCount - The number of slides to step forward (or backward if negative)
 *
 * @returns {void}
 */
export const incrementSlide = async (stepCount: number): Promise<void> => {
  // console.groupCollapsed(`Incrementing slide by ${stepCount}.`);

  // Restart loading spinner animation
  const lightbox = document.querySelector<HTMLElement>("#lightbox");
  lightbox?.classList.remove("loaded");

  const lightboxImage = document.querySelector<HTMLImageElement>("#lightboxImage");
  if (lightboxImage) {
    // Fade out the image
    await fadeOut(lightboxImage, slideDuration());

    // console.log("Fade out complete. Removing src attribute.");
    lightboxImage.setAttribute("src", "");

    // Show the new slide
    showSlide(slideIndex(slideIndex() + stepCount));

    // Wait for the new image to load and decode
    await Promise.all([
      delayForEvent(lightboxImage, "load"),
      lightboxImage.decode().catch(() => {})    
    ]);

    // Fade in the new image
    // console.log("Image loaded. Fading in.");
    await fadeIn(lightboxImage, slideDuration());

    // Stop loading spinner animation
    lightbox?.classList.add("loaded");
  }
  // console.groupEnd();
};
