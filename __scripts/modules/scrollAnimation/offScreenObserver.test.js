var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, vi } from "vitest";
describe("offScreenObserver", () => {
    let observerCallback;
    let observer;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        vi.resetModules();
        class MockIntersectionObserver {
            constructor(callback) {
                this.root = null;
                this.rootMargin = "";
                this.thresholds = [];
                this.observe = vi.fn();
                this.unobserve = vi.fn();
                this.disconnect = vi.fn();
                this.takeRecords = vi.fn(() => []);
                observerCallback = callback;
            }
        }
        vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
        // IMPORTANT: import AFTER mocking the constructor
        yield import("./offScreenObserver");
    }));
    const makeEntry = (target, isIntersecting) => ({
        target,
        isIntersecting,
        boundingClientRect: target.getBoundingClientRect(),
        intersectionRect: target.getBoundingClientRect(),
        rootBounds: null,
        intersectionRatio: isIntersecting ? 1 : 0,
        time: performance.now(),
    });
    it("removes 'off-screen' class when element enters viewport", () => {
        const element = document.createElement("div");
        element.classList.add("off-screen");
        observerCallback([makeEntry(element, true)], observer);
        expect(element.classList.contains("off-screen")).toBe(false);
    });
    it("adds 'off-screen' class when element leaves viewport", () => {
        const element = document.createElement("div");
        observerCallback([makeEntry(element, false)], observer);
        expect(element.classList.contains("off-screen")).toBe(true);
    });
    it("does nothing when element is intersecting and already visible", () => {
        const element = document.createElement("div");
        observerCallback([makeEntry(element, true)], observer);
        expect(element.classList.contains("off-screen")).toBe(false);
    });
    it("does nothing when element is not intersecting and already off-screen", () => {
        const element = document.createElement("div");
        element.classList.add("off-screen");
        observerCallback([makeEntry(element, false)], observer);
        expect(element.classList.contains("off-screen")).toBe(true);
    });
});
//# sourceMappingURL=offScreenObserver.test.js.map