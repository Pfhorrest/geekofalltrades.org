import { getDuration, delayForEvent } from "../helpers/helpers";

/**
 * Slides the specified element up out of view over the specified duration.
 *
 * @param {HTMLElement} element - The element to slide up
 * @param {number} [duration] - The animation duration in milliseconds (defaults to the element's transition-duration)
 *
 * @returns {void}
 */
export const slideUp = async (
  element: HTMLElement,
  duration: number = getDuration(element),
): Promise<void> => {
  // console.groupCollapsed("slideUp");
  // console.log("slideUp called with element:", element);
  // console.log("slideUp called with duration:", duration);

  // Set the element's overflow to hidden to contain the animation
  // console.log("setting element's overflow to hidden");
  element.style.overflow = "hidden";
  // console.log("element.style.overflow is now:", element.style.overflow);
  // Set the element's transition to ease-in-out
  // console.log("setting element's transition to ease-in-out");
  element.style.transition = `all ${duration}ms ease-in-out`;
  // console.log("element.style.transition is now:", element.style.transition);

  // Set the element's height to its current height in pixels
  // console.log(
  //   "setting element's height to its current height:",
  //   element.offsetHeight
  // );
  element.style.height = `${element.offsetHeight}px`;
  // console.log("element.style.height is now:", element.style.height);

  // Force a reflow to ensure the height is applied
  // console.log("forcing reflow");
  void element.offsetHeight;

  // console.log("setting element's height to 0");
  element.style.height = "0";
  // console.log("element.style.height is now:", element.style.height);
  element.style.paddingTop = "0";
  // console.log("element.style.paddingTop is now:", element.style.paddingTop);
  element.style.rowGap = "0";
  // console.log("element.style.rowGap is now:", element.style.rowGap);
  element.style.paddingBottom = "0";
  // console.log(
  //   "element.style.paddingBottom is now:",
  //   element.style.paddingBottom
  // );

  // Wait for the transition to complete, then remove all the styles
  const cleanup = () => {
    element.style.display = "none";
    element.style.removeProperty("height");
    element.style.removeProperty("padding-top");
    element.style.removeProperty("row-gap");
    element.style.removeProperty("padding-bottom");
    element.style.removeProperty("overflow");
    element.style.removeProperty("transition");
  };

  await delayForEvent(
    element,
    "transitionend",
    (e) => e.propertyName === "height",
  );
  cleanup();
  return new Promise((resolve) => {
    resolve();
  });

  // console.groupEnd();
};
