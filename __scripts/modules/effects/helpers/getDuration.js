/**
 * Gets the transition-duration of element in ms.
 *
 * It first tries to get the value of the CSS variable `--dur`.
 * If that doesn't exist, it tries to get the value of the CSS property
 * `transition-duration`. If that doesn't exist either, it defaults to 0.
 *
 * @param {HTMLElement} element - The element to get the transition-duration from
 *
 * @returns The transition-duration of the element in ms
 */
export const getDuration = (element) => {
    const style = getComputedStyle(element);
    const duration = (style.getPropertyValue("--dur") ||
        style.getPropertyValue("transition-duration") ||
        "0").trim();
    // console.groupCollapsed(
    //   `getDuration(${element.tagName}${
    //     element.classList.length
    //       ? `.${element.classList.value.split(/\s+/).join(".")}`
    //       : ""
    //   }${element.id ? `#${element.id}` : ""})`
    // );
    // console.log(
    //   `style.getPropertyValue("--dur")`,
    //   style.getPropertyValue("--dur")
    // );
    // console.log(
    //   `style.getPropertyValue("transition-duration")`,
    //   style.getPropertyValue("transition-duration")
    // );
    // console.log(`trimmed duration`, duration);
    const parsedDuration = parseFloat(duration) || 0;
    // console.log(`parsed duration`, parsedDuration);
    const isMs = duration.endsWith("ms");
    // console.log(`isMs`, isMs);
    const durationInMs = isMs ? parsedDuration : parsedDuration * 1000;
    // console.log(`duration in ms`, durationInMs);
    // console.groupEnd();
    return durationInMs;
};
//# sourceMappingURL=getDuration.js.map