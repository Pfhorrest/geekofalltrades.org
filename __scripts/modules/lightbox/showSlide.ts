import { slides, slideIndex } from "./lightboxState";

/**
 * Populates the lightbox with the data of the specified slide
 *
 * @param {number} index - The index of the slide to show
 * 
 * @returns {void}
 */
export const showSlide = (index: number): void => {
  // console.groupCollapsed("Showing slide:", index);
  // Get the list of slides
  const slidesList = slides();
  const slidesLength = slidesList.length;
  // Loop the index around to the beginning or end of the list if it is out of bounds
  if (index >= slidesLength || index < 0) {
    index = index % slidesLength;
  }
  // Get the slide at the specified index
  const slide = slidesList[index];
  // Handle the case where there is no slide at the specified index
  if (!slide) {
    console.error("No slide at index:", index);
    return;
  }
  // console.log("slide:", slide);
  // Get the parent item of the slide
  const parentItem = slide.closest(".item");
  // Handle the case where there is no parent item
  if (!parentItem) {
    console.error("No parent item found for slide:", slide);
    return;
  }
  // console.log("parentItem:", parentItem);
  // Get the caption text
  const captionText = parentItem.querySelector(".title, h3")?.innerHTML;
  // console.log("captionText:", captionText);
  // Get the caption element
  const captionElement = document.getElementById("caption");
  // Handle the case where there is no caption element
  if (!captionElement) {
    console.error("No caption element found");
    return;
  }
  // Set the caption text
  captionElement.innerHTML = captionText || "";
  // Get the image element
  const imageElement =
    document.querySelector<HTMLImageElement>("#lightboxImage");
  // Handle the case where there is no image element
  if (!imageElement) {
    console.error("No image element found");
    return;
  }
  // console.log("imageElement:", imageElement);
  // Get the src URL from the slide's href attribute
  const srcUrl = new URL(
    location.href + slide.getAttribute("href") || ""
  ).searchParams.get("display");
  // Handle the case where there is no src URL
  if (!srcUrl) {
    // console.error("No display param found in URL:", slide.getAttribute("href"));
    return;
  }
  // console.log("srcUrl:", srcUrl);
  // Hide the image element until the image has loaded
  imageElement.style.visibility = "hidden";
  // Add an event listener to the image element to show it when the image has loaded
  imageElement.addEventListener("load", () => {
    // console.log("Image loaded");
    imageElement.style.visibility = "visible";
  });
  // Check if an image exists at the src URL
  fetch(srcUrl)
    .then((res) => {
      if (res.ok && res.headers.get("Content-Type")?.startsWith("image/")) {
        // console.log("Setting image source to:", srcUrl);
        imageElement.src = srcUrl;
      } else {
        // If not, look in __images/ instead
        // console.log("Setting image source to:", "__images/" + srcUrl);
        imageElement.src = "__images/" + srcUrl;
      }
    })
    .catch(() => {
      // console.log("Setting image source to:", "__images/" + srcUrl);
      imageElement.src = "__images/" + srcUrl;
    });
  // Set the image alt attribute to the caption text
  imageElement.alt = captionElement?.textContent || "";
  // console.groupEnd();
};