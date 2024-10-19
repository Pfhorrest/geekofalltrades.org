import { fadeIn, fadeOut } from "../effects/effects";
import { setSlide } from "./setSlide";
import { incrementSlide } from "./incrementSlide";
import { slides, slideDuration } from "./lightboxState";

/**
 * Sets up the structure of the lightbox (all hidden by default)
 * and the events listeners to open and close it
 * 
 * @returns {void}
 */
export const hydrateLightbox = (): void => {
  // console.groupCollapsed("hydrateLightbox");
  document.addEventListener("DOMContentLoaded", () => {
    //Gathers all the slides into a collection
    slides(
      document.querySelectorAll<HTMLAnchorElement>(
        ".gallery a[href*='display=']"
      )
    );
    // console.log(`${slides()?.length} slides found`);

    if (slides()?.length !== 0) {
      //Adds onclick event to every slide link to open lightbox
      slides()?.forEach((element: HTMLAnchorElement, index: number) => {
        // console.log("Adding onclick event to slide link", index);
        element.addEventListener("click", (e: MouseEvent) => {
          // console.log("Slide link clicked", index);
          e.preventDefault();
          // console.log("About to set slide:", index);
          setSlide(index);
          document.querySelectorAll<HTMLElement>("#lightbox")?.forEach((el) => {
            // console.log("Got the lightbox, now to fade it in...");
            fadeIn(el, slideDuration());
          });
        });
      });

      //Gets the lightbox from an external file and appends it after the (last) main element
      // console.log("Fetching the lightbox html");
      fetch("/___structure/modules/lightbox.html")
        .then((res) => res.text())
        .then((html) => {
          // console.log("Got the lightbox html");
          let theLightbox: HTMLElement | null = new DOMParser()
            .parseFromString(html, "text/html")
            .getElementById("lightbox");
          if (theLightbox) {
            // console.log("Found the lightbox element");
            //Inset it into the DOM
            const lastMainElement: HTMLElement | null = document.querySelector(
              "main"
            )?.lastChild as HTMLElement;
            if (lastMainElement) {
              // console.log("Inserting lightbox after last main element");
              lastMainElement.after(theLightbox);
              //Bind controls
              theLightbox
                .querySelector<HTMLElement>(".prev")
                ?.addEventListener("click", () => {
                  // console.log("Lightbox previous button clicked");
                  incrementSlide(-1);
                });
              theLightbox
                .querySelector<HTMLElement>(".close")
                ?.addEventListener("click", () => {
                  // console.log("Lightbox close button clicked");
                  fadeOut(theLightbox);
                });
              theLightbox
                .querySelector<HTMLElement>(".next")
                ?.addEventListener("click", () => {
                  // console.log("Lightbox next button clicked");
                  incrementSlide(1);
                });
              //Add onclick to close it when clicking background
              theLightbox.addEventListener("click", (e) => {
                if (e.target === theLightbox) {
                  // console.log("Lightbox background clicked");
                  fadeOut(theLightbox);
                }
              });
              //Hide it
              theLightbox.style.display = "none";
            } else {
              console.error(
                "hydrateLightbox: Could not find the last main element to insert the lightbox after."
              );
            }
          } else {
            console.error(
              "hydrateLightbox: Could not find the lightbox element in the html."
            );
          }
        })
        .catch((err) => {
          console.error(
            "hydrateLightbox: Error fetching the lightbox html.",
            err
          );
        });
    }
  });
  // console.groupEnd();
};
