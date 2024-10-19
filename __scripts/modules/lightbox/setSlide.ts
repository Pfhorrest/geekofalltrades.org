import { slideIndex } from "./lightboxState";
import { showSlide } from "./showSlide";

/**
 * Sets the slide index and shows the slide at that index.
 *
 * @param {number} newIndex - The index of the slide to show.
 * 
 * @returns {void}
 */
export const setSlide = (newIndex: number): void => {
  // console.groupCollapsed("setSlide called with index:", newIndex);

  // Get the lightboxImage element
  const lightboxImage = document.getElementById("lightboxImage");
  if (lightboxImage) {
    // Remove the src attribute from the lightboxImage element. This will prevent the old image from being displayed while the new image is being loaded.
    // console.log("Removing src attribute from lightboxImage");
    lightboxImage.removeAttribute("src");

    // Set the slideIndex to the given index
    // console.log("Setting slideIndex to:", newIndex);
    slideIndex(newIndex);

    // Call the showSlide function to show the slide at the index
    // console.log("Calling showSlide with index:", newIndex);
    showSlide(newIndex);
  // } else {
  //   console.error("Could not find lightboxImage");
  }

  console.groupEnd();
};
