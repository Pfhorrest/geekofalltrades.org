import { describe, it, expect, beforeEach } from "vitest";
import { initLazyLoading } from "./lazyLoading";
describe("lazy loading test suite", () => {
    const PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    let observerCallback;
    beforeEach(() => {
        document.body.innerHTML = "";
        observerCallback = () => { };
        globalThis.IntersectionObserver = class {
            constructor(cb, _options) {
                observerCallback = cb;
            }
            observe() { }
            unobserve() { }
            disconnect() { }
        };
    });
    it("keeps above-the-fold images intact", () => {
        const img = document.createElement("img");
        img.src = "image.jpg";
        img.getBoundingClientRect = () => ({
            top: 0,
            bottom: 100,
            left: 0,
            right: 100,
            width: 100,
            height: 100,
        });
        document.body.appendChild(img);
        initLazyLoading();
        expect(img.src).toContain("image.jpg");
        expect(img.loading).toBe("lazy");
        expect(img.dataset.src).toBeUndefined();
    });
    it("defers loading for below-the-fold images", () => {
        const img = document.createElement("img");
        img.src = "image.jpg";
        img.getBoundingClientRect = () => ({
            top: 2000,
            bottom: 2100,
            left: 0,
            right: 100,
            width: 100,
            height: 100,
        });
        document.body.appendChild(img);
        initLazyLoading();
        expect(img.src).toBe(PLACEHOLDER);
        expect(img.dataset.src).toContain("image.jpg");
    });
    it("handles picture elements correctly", () => {
        const picture = document.createElement("picture");
        const source = document.createElement("source");
        source.srcset = "img.webp";
        const img = document.createElement("img");
        img.src = "img.jpg";
        picture.append(source, img);
        picture.getBoundingClientRect = () => ({
            top: 2000,
            bottom: 2100,
            left: 0,
            right: 100,
        });
        document.body.appendChild(picture);
        initLazyLoading();
        expect(source.srcset).toBe("");
        expect(source.dataset.srcset).toBe("img.webp");
        expect(img.src).toBe(PLACEHOLDER);
        expect(img.dataset.src).toContain("img.jpg");
    });
    it("restores src when intersecting", () => {
        const img = document.createElement("img");
        img.src = "image.jpg";
        img.getBoundingClientRect = () => ({
            top: 2000,
            bottom: 2100,
            left: 0,
            right: 100,
        });
        document.body.appendChild(img);
        initLazyLoading();
        observerCallback([
            {
                target: img,
                isIntersecting: true,
            },
        ], {});
        expect(img.src).toContain("image.jpg");
        expect(img.dataset.src).toBeUndefined();
    });
});
//# sourceMappingURL=lazyLoading.test.js.map