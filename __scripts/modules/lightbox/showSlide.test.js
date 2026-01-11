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
import { showSlide } from "./showSlide";
import { slides } from "./lightboxState";
beforeEach(() => {
    document.body.innerHTML = `
    <div class="item">
      <a href="?display=test.jpg"></a>
      <h3>Caption</h3>
    </div>
    <div id="caption"><span></span></div>
    <img id="lightboxImage" />
  `;
});
vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({
    ok: true,
    headers: {
        get: () => "image/jpeg",
    },
})));
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
    it("wraps negative indices", () => __awaiter(void 0, void 0, void 0, function* () {
        const anchors = document.querySelectorAll("a");
        slides(anchors);
        showSlide(-1);
        const img = document.getElementById("lightboxImage");
        yield Promise.resolve();
        expect(img.src).toContain("test.jpg");
    }));
    it("returns early if slide does not exist", () => {
        slides(document.querySelectorAll("a"));
        expect(() => showSlide(5)).not.toThrow();
    });
});
//# sourceMappingURL=showSlide.test.js.map