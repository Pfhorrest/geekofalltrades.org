/**
 * Checks if an element is visible in the viewport.
 *
 * @param {Element} element - The element to check visibility for.
 * @param {boolean} [partiallyVisible=false] - If true, the element is considered visible even if only part of it is visible.
 *
 * @returns {boolean} True if the element is visible, false otherwise.
 */
export const isInView = (element, partiallyVisible = false) => {
    const { bottom, right, top, left } = element.getBoundingClientRect();
    const { innerHeight, innerWidth } = window;
    // console.groupCollapsed("isInView");
    // console.log("element:", element);
    // console.log("partiallyVisible:", partiallyVisible);
    // console.log("getBoundingClientRect:", { bottom, right, top, left });
    // console.log("innerHeight:", innerHeight);
    // console.log("innerWidth:", innerWidth);
    // The element is partially visible if any part of it is in the viewport.
    const isPartiallyInView = top <= innerHeight && left <= innerWidth && bottom >= 0 && right >= 0;
    // The element is fully visible if it is fully contained within the viewport.
    const isFullyInView = top >= 0 && left >= 0 && bottom <= innerHeight && right <= innerWidth;
    // console.log("isPartiallyInView:", isPartiallyInView);
    // console.log("isFullyInView:", isFullyInView);
    // If partiallyVisible is set, the element "is in view" if it is partially
    // visible. Otherwise, the element "is in view" if it is fully visible.
    const result = partiallyVisible ? isPartiallyInView : isFullyInView;
    // console.log("result:", result);
    // console.groupEnd();
    return result;
};
//# sourceMappingURL=isInView.js.map