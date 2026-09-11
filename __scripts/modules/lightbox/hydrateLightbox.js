var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fadeIn, fadeOut, delayForEvent } from "../effects/effects";
import { setSlide } from "./setSlide";
import { incrementSlide } from "./incrementSlide";
import { slides, slideDuration } from "./lightboxState";
/**
 * Sets up the structure of the lightbox (all hidden by default)
 * and the events listeners to open and close it
 *
 * @returns {void}
 */
export const hydrateLightbox = () => {
    var _a, _b;
    // console.groupCollapsed("hydrateLightbox");
    //Gathers all the slides into a collection
    slides(document.querySelectorAll(".gallery a[href*='display=']"));
    // console.log(`${slides()?.length} slides found`);
    if (((_a = slides()) === null || _a === void 0 ? void 0 : _a.length) !== 0) {
        //Adds onclick event to every slide link to open lightbox
        (_b = slides()) === null || _b === void 0 ? void 0 : _b.forEach((element, index) => {
            // console.log("Adding onclick event to slide link", index);
            element.addEventListener("click", (e) => __awaiter(void 0, void 0, void 0, function* () {
                // console.log("Slide link clicked", index);
                e.preventDefault();
                // console.log("About to set slide:", index);
                setSlide(index);
                const lightbox = document.querySelector("#lightbox");
                const lightboxImage = document.querySelector("#lightboxImage");
                if (lightbox && lightboxImage) {
                    // console.log("Got the lightbox, now to fade it in...");
                    yield Promise.all([
                        // Wait until the fade in is complete
                        fadeIn(lightbox, slideDuration()),
                        // Wait for the image to load and decode
                        delayForEvent(lightboxImage, "load", () => true, 30000),
                        lightboxImage.decode().catch(() => { }),
                    ]);
                    // Stop loading spinner animation
                    lightbox.classList.add("loaded");
                }
            }));
        });
        //Gets the lightbox from an external file and appends it after the (last) main element
        // console.log("Fetching the lightbox html");
        fetch("/___structure/modules/views/partials/lightbox.html")
            .then((res) => res.text())
            .then((html) => {
            var _a, _b, _c, _d;
            // console.log("Got the lightbox html");
            let theLightbox = new DOMParser()
                .parseFromString(html, "text/html")
                .getElementById("lightbox");
            if (theLightbox) {
                // console.log("Found the lightbox element");
                //Inset it into the DOM
                const lastMainElement = (_a = document.querySelector("main")) === null || _a === void 0 ? void 0 : _a.lastChild;
                if (lastMainElement) {
                    // console.log("Inserting lightbox after last main element");
                    lastMainElement.after(theLightbox);
                    //Bind controls
                    (_b = theLightbox
                        .querySelector(".prev")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
                        // console.log("Lightbox previous button clicked");
                        incrementSlide(-1);
                    });
                    (_c = theLightbox
                        .querySelector(".close")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => {
                        // console.log("Lightbox close button clicked");
                        fadeOut(theLightbox, slideDuration());
                    });
                    (_d = theLightbox
                        .querySelector(".next")) === null || _d === void 0 ? void 0 : _d.addEventListener("click", () => {
                        // console.log("Lightbox next button clicked");
                        incrementSlide(1);
                    });
                    //Add onclick to close it when clicking background
                    theLightbox.addEventListener("click", (e) => {
                        if (e.target === theLightbox) {
                            // console.log("Lightbox background clicked");
                            fadeOut(theLightbox, slideDuration());
                        }
                    });
                    //Hide it
                    theLightbox.style.display = "none";
                }
                else {
                    console.error("hydrateLightbox: Could not find the last main element to insert the lightbox after.");
                }
            }
            else {
                console.error("hydrateLightbox: Could not find the lightbox element in the html.");
            }
        })
            .catch((err) => {
            console.error("hydrateLightbox: Error fetching the lightbox html.", err);
        });
    }
    // console.groupEnd();
};
//# sourceMappingURL=hydrateLightbox.js.map