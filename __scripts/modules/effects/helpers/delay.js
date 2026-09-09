/**
 * Waits for the given number of milliseconds.
 *
 * @param milliseconds - How long to wait.
 *
 * @returns A promise that resolves after the delay.
 */
export function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
//# sourceMappingURL=delay.js.map