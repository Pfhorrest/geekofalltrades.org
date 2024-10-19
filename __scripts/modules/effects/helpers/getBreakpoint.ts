/**
 * Gets the value of a CSS variable representing a breakpoint,
 * multiplies it by the font size, and returns the result.
 *
 * The breakpoints are defined in the CSS as custom properties
 * (e.g. --bp1, --bp2, etc.). The values of these properties
 * are relative units (e.g. rem, em, etc.), so they need to be
 * multiplied by the font size to get the breakpoint value in
 * pixels.
 *
 * @param {number} [n=2] - The breakpoint number (1-6).
 * 
 * @returns {number} The breakpoint value in pixels.
 */
export const getBreakpoint = (n: number = 2): number => {
  // Get the styles of the root element, which is where the CSS variables are defined
  const rootStyles: CSSStyleDeclaration = getComputedStyle(
    document.documentElement
  );
  // Get the value of the CSS variable representing the breakpoint
  const bp: number = parseFloat(
    rootStyles.getPropertyValue(`--bp${n}`) as string
  );
  // Get the font size of the root element
  const fontSize: number = parseFloat(rootStyles.fontSize);

  // Multiply the breakpoint value by the font size to get the breakpoint value in pixels
  const bpInPixels: number = bp * fontSize;

  // Log the calculation steps for debugging
  // console.groupCollapsed(`getBreakpoint(${n})`);
  // console.log(`rootStyles.getPropertyValue('--bp${n}')`, bp);
  // console.log(`rootStyles.fontSize`, fontSize);
  // console.log(`bp * fontSize`, bp * fontSize);
  // console.groupEnd();

  // Return the breakpoint value in pixels
  return bpInPixels;
};
