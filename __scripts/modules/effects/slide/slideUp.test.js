import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { slideUp } from "./slideUp";
describe("slideUp", () => {
    let el;
    beforeEach(() => {
        el = document.createElement("div");
        document.body.appendChild(el);
        Object.defineProperty(el, "offsetHeight", {
            configurable: true,
            get: () => 100,
        });
        vi.useFakeTimers();
    });
    afterEach(() => {
        document.body.innerHTML = "";
        vi.useRealTimers();
    });
    it("collapses a visible element", () => {
        slideUp(el, 300);
        expect(el.style.overflow).toBe("hidden");
        expect(el.style.transition).toContain("300ms");
        expect(el.style.height).toBe("0px");
    });
    it("sets display to none after transition", () => {
        slideUp(el, 300);
        el.dispatchEvent(new TransitionEvent("transitionend"));
        expect(el.style.display).toBe("none");
        expect(el.style.height).toBe("");
        expect(el.style.transition).toBe("");
        expect(el.style.overflow).toBe("");
    });
    it("falls back to timeout cleanup if transitionend does not fire", () => {
        slideUp(el, 300);
        vi.advanceTimersByTime(316);
        expect(el.style.display).toBe("none");
    });
});
//# sourceMappingURL=slideUp.test.js.map