import { describe, it, expect, beforeEach } from "vitest";
import { slides, slideIndex, slideDuration } from "./lightboxState";
describe("lightboxState", () => {
    beforeEach(() => {
        slideIndex(0);
        slideDuration(500);
        slides(undefined);
    });
    it("stores and returns slides", () => {
        document.body.innerHTML = `
      <a>a</a>
      <a>b</a>
      <a>c</a>
    `;
        const list = document.querySelectorAll("a");
        slides(list);
        expect(slides()).toBe(list);
    });
    it("gets and sets slideIndex", () => {
        expect(slideIndex()).toBe(0);
        slideIndex(3);
        expect(slideIndex()).toBe(3);
    });
    it("gets and sets slideDuration", () => {
        expect(slideDuration()).toBe(500);
        slideDuration(1000);
        expect(slideDuration()).toBe(1000);
    });
});
//# sourceMappingURL=lightboxState.test.js.map