/**
 * Alternate between left and right floating figures in sections
 *
 * Goes through all figures in sections and sets a custom property
 * "--fig-index" which is either 0 or 1. This property is used in
 * CSS to determine whether to float a figure left or right.
 *
 * @returns {void}
 */
export const alternateFigures = (): void => {
    const figures = document.querySelectorAll<HTMLElement>("section figure");
    figures.forEach((fig, i) => {
        fig.style.setProperty("--fig-index", String(i % 2));
    });
};