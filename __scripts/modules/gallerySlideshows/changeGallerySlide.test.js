var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import changeGallerySlide, { encodeCoverQueryValue, findItemElements, } from "./changeGallerySlide";
import { delay, getDuration } from "../effects/helpers/helpers";
import { fadeIn, fadeOut } from "../effects/fade/fadeEffects";
import { slideDuration } from "../lightbox/lightboxState";
vi.mock("../effects/helpers/helpers", () => ({
    getDuration: vi.fn(() => 100),
    delay: vi.fn(() => Promise.resolve()),
}));
vi.mock("../effects/fade/fadeEffects", () => ({
    fadeIn: vi.fn(),
    fadeOut: vi.fn(),
}));
vi.mock("../lightbox/lightboxState", () => ({
    slideDuration: vi.fn(() => 200),
}));
let preloadShouldFail = false;
class MockPreloadImage {
    constructor() {
        this.onload = null;
        this.onerror = null;
        this.imageSource = "";
    }
    set src(value) {
        this.imageSource = value;
        queueMicrotask(() => {
            var _a, _b;
            if (preloadShouldFail)
                (_a = this.onerror) === null || _a === void 0 ? void 0 : _a.call(this);
            else
                (_b = this.onload) === null || _b === void 0 ? void 0 : _b.call(this);
        });
    }
    get src() {
        return this.imageSource;
    }
}
function createItemFixture(html) {
    const container = document.createElement("div");
    container.innerHTML = html;
    return container.firstElementChild;
}
describe("findItemElements", () => {
    it("includes title, description, and cover when the item has a .more link", () => {
        const item = createItemFixture(`
      <div class="item">
        <p class="title">Title</p>
        <img src="a.jpeg" alt="">
        <p class="description">Desc</p>
        <p class="more"><a href="/photos/2026/09/04">7 more</a></p>
        <a class="cover" href="?display=a.jpeg&title=Title">View</a>
      </div>
    `);
        const { img, title, description, cover } = findItemElements(item);
        expect(img).not.toBeNull();
        expect(title).not.toBeNull();
        expect(description).not.toBeNull();
        expect(cover).not.toBeNull();
    });
    it("excludes title, description, and cover when the item has no .more link", () => {
        const item = createItemFixture(`
      <div class="item">
        <p class="title">Title</p>
        <img src="a.jpeg" alt="">
        <p class="description">Desc</p>
        <a class="cover" href="/photos/2026/02/">View more</a>
      </div>
    `);
        const { img, title, description, cover } = findItemElements(item);
        // The image always cycles; title/description/cover don't, since this
        // item is being cycled *via* its cover link, which needs to keep
        // pointing at the real subgallery page, not get overwritten.
        expect(img).not.toBeNull();
        expect(title).toBeNull();
        expect(description).toBeNull();
        expect(cover).toBeNull();
    });
    it("returns null for img when the item genuinely has none", () => {
        const item = createItemFixture(`<div class="item"><p class="title">No image</p></div>`);
        expect(findItemElements(item).img).toBeNull();
    });
});
describe("encodeCoverQueryValue", () => {
    it("encodes spaces as +", () => {
        expect(encodeCoverQueryValue("Taurus Mason Bee at Ventura Pier")).toBe("Taurus+Mason+Bee+at+Ventura+Pier");
    });
    it("leaves forward slashes unescaped", () => {
        expect(encodeCoverQueryValue("04/IMG_3394.jpeg")).toBe("04/IMG_3394.jpeg");
    });
    it("still escapes characters that would break a query string", () => {
        expect(encodeCoverQueryValue("Fish & Chips")).toBe("Fish+%26+Chips");
    });
});
describe("changeGallerySlide", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(delay).mockResolvedValue(undefined);
        vi.mocked(getDuration).mockReturnValue(100);
        vi.mocked(slideDuration).mockReturnValue(200);
        preloadShouldFail = false;
        vi.stubGlobal("Image", MockPreloadImage);
    });
    afterEach(() => {
        vi.unstubAllGlobals();
        vi.restoreAllMocks();
    });
    it("updates the image, title, description, and cover link, then fades them back in", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = createItemFixture(`
      <div class="item">
        <p class="title">Old title</p>
        <img src="old-thumb.jpeg" alt="Old alt">
        <p class="description">Old description</p>
        <p class="more"><a href="/photos/2026/09/04/">More</a></p>
        <a class="cover" href="?display=old.jpeg&title=Old">View</a>
      </div>
    `);
        const img = item.querySelector("img");
        const decode = vi.fn().mockRejectedValue(new Error("decode failed"));
        Object.defineProperty(img, "decode", { configurable: true, value: decode });
        yield changeGallerySlide(item, [{
                title: 'New <span class="maybe">title</span>',
                description: "New description",
                imgSrc: "2026/new-thumb.jpeg",
                imgAlt: "A new bird",
                fullImageSrc: "photos/2026/new image.jpeg",
                coverTitle: "A & B",
            }]);
        expect(img.getAttribute("src")).toBe("2026/new-thumb.jpeg");
        expect(img.alt).toBe("A new bird");
        expect(decode).toHaveBeenCalledOnce();
        expect(item.querySelector(".title").innerHTML).toBe('New <span class="maybe">title</span>');
        expect(item.querySelector(".description").innerHTML).toBe("New description");
        expect(item.querySelector("a.cover").getAttribute("href")).toBe("?display=photos/2026/new+image.jpeg&title=A+%26+B");
        const fadedElements = [img, item.querySelector(".title"), item.querySelector(".description")];
        for (const element of fadedElements) {
            expect(fadeOut).toHaveBeenCalledWith(element, 200, false);
            expect(fadeIn).toHaveBeenCalledWith(element, 200, false);
        }
        expect(delay).toHaveBeenNthCalledWith(1, 200);
        expect(delay).toHaveBeenNthCalledWith(2, 200);
    }));
    it("continues if preloading fails", () => __awaiter(void 0, void 0, void 0, function* () {
        preloadShouldFail = true;
        const item = createItemFixture('<div class="item"><img src="old.jpeg" alt="old"></div>');
        const img = item.querySelector("img");
        Object.defineProperty(img, "decode", {
            configurable: true,
            value: vi.fn().mockResolvedValue(undefined),
        });
        yield expect(changeGallerySlide(item, [{
                title: "",
                description: "",
                imgSrc: "broken.jpeg",
                imgAlt: "broken image",
                fullImageSrc: "",
                coverTitle: "",
            }])).resolves.toBeUndefined();
        expect(img.getAttribute("src")).toBe("broken.jpeg");
        expect(fadeIn).toHaveBeenCalledWith(img, 200, false);
    }));
    it("returns without changing anything when there are no entries", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = createItemFixture('<div class="item"><img src="old.jpeg" alt="old"></div>');
        yield changeGallerySlide(item, []);
        expect(fadeOut).not.toHaveBeenCalled();
        expect(fadeIn).not.toHaveBeenCalled();
        expect(delay).not.toHaveBeenCalled();
    }));
    it("returns when an item has no elements to fade", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = createItemFixture('<div class="item"><p>Nothing to animate</p></div>');
        yield changeGallerySlide(item, [{
                title: "Title",
                description: "Description",
                imgSrc: "image.jpeg",
                imgAlt: "image",
                fullImageSrc: "image.jpeg",
                coverTitle: "Title",
            }]);
        expect(fadeOut).not.toHaveBeenCalled();
        expect(delay).not.toHaveBeenCalled();
    }));
    it("wraps to the last entry when the prior entry is first and the random choice repeats it", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = createItemFixture('<div class="item"><img src="old.jpeg" alt="old"></div>');
        const img = item.querySelector("img");
        Object.defineProperty(img, "decode", {
            configurable: true,
            value: vi.fn().mockResolvedValue(undefined),
        });
        vi.spyOn(Math, "random").mockReturnValue(0);
        const entries = [
            { title: "First", description: "", imgSrc: "first.jpeg", imgAlt: "first", fullImageSrc: "", coverTitle: "" },
            { title: "Last", description: "", imgSrc: "last.jpeg", imgAlt: "last", fullImageSrc: "", coverTitle: "" },
        ];
        yield changeGallerySlide(item, entries);
        expect(img.getAttribute("src")).toBe("first.jpeg");
        yield expect(changeGallerySlide(item, entries)).resolves.toBeUndefined();
        expect(img.getAttribute("src")).toBe("last.jpeg");
    }));
});
//# sourceMappingURL=changeGallerySlide.test.js.map