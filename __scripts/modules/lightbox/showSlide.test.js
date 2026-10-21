var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { afterEach, describe, it, expect, beforeEach, vi } from "vitest";
import { showSlide } from "./showSlide";
import { slides } from "./lightboxState";
let fetchMock;
beforeEach(() => {
    document.body.innerHTML = `
    <div class="item">
      <a href="?display=test.jpg"></a>
      <h3>Caption</h3>
    </div>
    <div id="caption"><span></span></div>
    <img id="lightboxImage" />
  `;
    fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        headers: {
            get: () => "image/jpeg",
        },
    });
    vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
    vi.unstubAllGlobals();
});
describe("showSlide", () => {
    it("sets caption and image src", () => __awaiter(void 0, void 0, void 0, function* () {
        const anchors = document.querySelectorAll("a");
        slides(anchors);
        showSlide(0);
        const img = document.getElementById("lightboxImage");
        const caption = document.querySelector("#caption span");
        expect(caption.textContent).toBe("Caption");
        yield Promise.resolve(); // allow fetch then()
        expect(img.src).toContain("test.jpg");
    }));
    it("keeps the image hidden until its load event fires", () => __awaiter(void 0, void 0, void 0, function* () {
        const anchors = document.querySelectorAll("a");
        slides(anchors);
        showSlide(0);
        const img = document.getElementById("lightboxImage");
        expect(img.style.visibility).toBe("hidden");
        yield vi.waitFor(() => expect(img.src).toContain("test.jpg"));
        img.dispatchEvent(new Event("load"));
        expect(img.style.visibility).toBe("visible");
    }));
    it("falls back to the media directory when the response is not an image", () => __awaiter(void 0, void 0, void 0, function* () {
        fetchMock.mockResolvedValueOnce({
            ok: true,
            headers: { get: () => "text/html" },
        });
        const anchors = document.querySelectorAll("a");
        slides(anchors);
        showSlide(0);
        const img = document.getElementById("lightboxImage");
        yield vi.waitFor(() => expect(img.src).toContain("_media/images/test.jpg"));
    }));
    it("falls back to the media directory when fetching the image fails", () => __awaiter(void 0, void 0, void 0, function* () {
        fetchMock.mockRejectedValueOnce(new Error("Network failure"));
        const anchors = document.querySelectorAll("a");
        slides(anchors);
        showSlide(0);
        const img = document.getElementById("lightboxImage");
        yield vi.waitFor(() => expect(img.src).toContain("_media/images/test.jpg"));
    }));
    it("wraps negative indices", () => __awaiter(void 0, void 0, void 0, function* () {
        const anchors = document.querySelectorAll("a");
        slides(anchors);
        showSlide(-1);
        const img = document.getElementById("lightboxImage");
        yield Promise.resolve();
        expect(img.src).toContain("test.jpg");
    }));
    it("wraps positive indices that exceed the number of slides", () => __awaiter(void 0, void 0, void 0, function* () {
        document.body.innerHTML = `
      <div class="item">
        <a href="?display=first.jpg"></a>
        <h3>First caption</h3>
      </div>
      <div class="item">
        <a href="?display=second.jpg"></a>
        <h3>Second caption</h3>
      </div>
      <div id="caption"><span></span></div>
      <img id="lightboxImage" />
    `;
        slides(document.querySelectorAll("a"));
        showSlide(2);
        const img = document.getElementById("lightboxImage");
        const caption = document.querySelector("#caption span");
        expect(caption.textContent).toBe("First caption");
        yield vi.waitFor(() => expect(img.src).toContain("first.jpg"));
    }));
});
//# sourceMappingURL=showSlide.test.js.map