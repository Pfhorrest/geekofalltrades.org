import { describe, it, expect, beforeEach } from "vitest";
import { initLazyLoading } from "./lazyLoading";
describe("lazy loading test suite", () => {
    const PLACEHOLDER = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    let observerCallback;
    let observedElements;
    let unobservedElements;
    beforeEach(() => {
        document.body.innerHTML = "";
        observerCallback = () => { };
        observedElements = [];
        unobservedElements = [];
        globalThis.IntersectionObserver = class {
            constructor(cb, _options) {
                observerCallback = cb;
            }
            observe(element) {
                observedElements.push(element);
            }
            unobserve(element) {
                unobservedElements.push(element);
            }
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
        observerCallback([
            {
                target: picture,
                isIntersecting: true,
            },
        ], {});
        expect(source.srcset).toBe("img.webp");
        expect(source.dataset.srcset).toBeUndefined();
        expect(img.src).toContain("img.jpg");
        expect(img.dataset.src).toBeUndefined();
        expect(unobservedElements).toContain(picture);
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
    it("does not restore or unobserve an element while it is not intersecting", () => {
        const img = document.createElement("img");
        img.src = "deferred.jpg";
        img.getBoundingClientRect = () => ({ top: 2000, bottom: 2100, left: 0, right: 100, width: 100, height: 100 });
        document.body.appendChild(img);
        initLazyLoading();
        observerCallback([{ target: img, isIntersecting: false }], {});
        expect(img.src).toBe(PLACEHOLDER);
        expect(img.dataset.src).toContain("deferred.jpg");
        expect(unobservedElements).not.toContain(img);
        expect(observedElements).toContain(img);
    });
    it("restores an image's srcset when it intersects", () => {
        const img = document.createElement("img");
        img.src = "image.jpg";
        img.srcset = "small.jpg 1x, large.jpg 2x";
        img.getBoundingClientRect = () => ({ top: 2000, bottom: 2100, left: 0, right: 100, width: 100, height: 100 });
        document.body.appendChild(img);
        initLazyLoading();
        expect(img.getAttribute("srcset")).toBeNull();
        expect(img.dataset.srcset).toBe("small.jpg 1x, large.jpg 2x");
        observerCallback([{ target: img, isIntersecting: true }], {});
        expect(img.getAttribute("srcset")).toBe("small.jpg 1x, large.jpg 2x");
        expect(img.dataset.srcset).toBeUndefined();
        expect(unobservedElements).toContain(img);
    });
    it("restores sources in a picture that has no img child", () => {
        const picture = document.createElement("picture");
        const source = document.createElement("source");
        source.srcset = "standalone.webp";
        picture.appendChild(source);
        picture.getBoundingClientRect = () => ({ top: 2000, bottom: 2100, left: 0, right: 100, width: 100, height: 100 });
        document.body.appendChild(picture);
        initLazyLoading();
        expect(source.getAttribute("srcset")).toBeNull();
        expect(source.dataset.srcset).toBe("standalone.webp");
        observerCallback([{ target: picture, isIntersecting: true }], {});
        expect(source.srcset).toBe("standalone.webp");
        expect(source.dataset.srcset).toBeUndefined();
        expect(unobservedElements).toContain(picture);
    });
});
//# sourceMappingURL=lazyLoading.test.js.map