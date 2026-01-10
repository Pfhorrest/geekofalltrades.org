import { describe, it, expect, beforeEach } from "vitest";
import { isInView } from "./isInView";
describe("isInView", () => {
    let element;
    beforeEach(() => {
        element = document.createElement("div");
        document.body.appendChild(element);
        // Default viewport
        Object.defineProperty(window, "innerWidth", { value: 1000, configurable: true });
        Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    });
    it("returns true when element is fully in view", () => {
        element.getBoundingClientRect = () => ({
            top: 100,
            left: 100,
            bottom: 200,
            right: 200,
        });
        expect(isInView(element)).toBe(true);
    });
    it("returns false when element is partially in view and partiallyVisible is false", () => {
        element.getBoundingClientRect = () => ({
            top: -50,
            left: 100,
            bottom: 100,
            right: 200,
        });
        expect(isInView(element)).toBe(false);
    });
    it("returns true when element is partially in view and partiallyVisible is true", () => {
        element.getBoundingClientRect = () => ({
            top: -50,
            left: 100,
            bottom: 100,
            right: 200,
        });
        expect(isInView(element, true)).toBe(true);
    });
    it("returns false when element is completely outside viewport", () => {
        element.getBoundingClientRect = () => ({
            top: 900,
            left: 100,
            bottom: 1000,
            right: 200,
        });
        expect(isInView(element, true)).toBe(false);
    });
});
//# sourceMappingURL=isInView.test.js.map