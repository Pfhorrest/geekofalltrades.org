import { getDuration } from "../effects";
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
/**
 * Waits for the given element to emit the given event and optionally fulfill a condition.
 *
 * @param element - The element to wait for.
 * @param eventName - The name of the event to wait for.
 * @param condition - An optional function to determine if the event should be considered.
 *
 * @returns A promise that resolves when the event is emitted and the condition (if provided) is fulfilled.
 */
export function delayForEvent(element, eventName, condition, timeout) {
    // console.log(`Waiting for ${eventName} event on`, element);
    return new Promise((resolve) => {
        function handler(event) {
            // console.log(`Event received: ${eventName}`, event);
            if (!condition || condition(event)) {
                // console.log(`Condition met, resolving...`);
                element.removeEventListener(eventName, handler);
                resolve();
            }
        }
        // console.log(`Adding event listener for ${eventName} on`, element);
        element.addEventListener(eventName, handler);
        // Safety timeout to prevent hanging indefinitely
        setTimeout(() => {
            element.removeEventListener(eventName, handler);
            resolve();
        }, timeout || 2 * getDuration(element));
    });
}
//# sourceMappingURL=delays.js.map