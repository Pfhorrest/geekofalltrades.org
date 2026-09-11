var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fadeOut, fadeIn, delayForEvent } from "../effects/effects";
import { showSlide } from "./showSlide";
import { slideDuration, slideIndex } from "./lightboxState";
/**
 * Steps forward through the slideshow (or backward if negative)
 *
 * @param {number} stepCount - The number of slides to step forward (or backward if negative)
 *
 * @returns {void}
 */
export const incrementSlide = (stepCount) => __awaiter(void 0, void 0, void 0, function* () {
    // console.groupCollapsed(`Incrementing slide by ${stepCount}.`);
    // Restart loading spinner animation
    const lightbox = document.querySelector("#lightbox");
    lightbox === null || lightbox === void 0 ? void 0 : lightbox.classList.remove("loaded");
    const lightboxImage = document.querySelector("#lightboxImage");
    if (lightboxImage) {
        // Fade out the image
        yield fadeOut(lightboxImage, slideDuration());
        // console.log("Fade out complete. Removing src attribute.");
        lightboxImage.setAttribute("src", "");
        // Show the new slide
        showSlide(slideIndex(slideIndex() + stepCount));
        // Wait for the new image to load and decode
        yield Promise.all([
            delayForEvent(lightboxImage, "load"),
            lightboxImage.decode().catch(() => { })
        ]);
        // Fade in the new image
        // console.log("Image loaded. Fading in.");
        yield fadeIn(lightboxImage, slideDuration());
        // Stop loading spinner animation
        lightbox === null || lightbox === void 0 ? void 0 : lightbox.classList.add("loaded");
    }
    // console.groupEnd();
});
//# sourceMappingURL=incrementSlide.js.map