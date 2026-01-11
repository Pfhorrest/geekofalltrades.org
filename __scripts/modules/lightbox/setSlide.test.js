import { describe, it, expect, beforeEach, vi } from "vitest";
import { setSlide } from "./setSlide";
import * as state from "./lightboxState";
import * as show from "./showSlide";
vi.mock("./showSlide", () => ({
    showSlide: vi.fn(),
}));
describe("setSlide", () => {
    beforeEach(() => {
        document.body.innerHTML = `<img id="lightboxImage" src="old.jpg" />`;
        vi.spyOn(state, "slideIndex");
    });
    it("sets slideIndex and calls showSlide", () => {
        setSlide(2);
        expect(state.slideIndex).toHaveBeenCalledWith(2);
        expect(show.showSlide).toHaveBeenCalledWith(2);
    });
    it("removes src from lightboxImage", () => {
        setSlide(1);
        const img = document.getElementById("lightboxImage");
        expect(img.getAttribute("src")).toBeNull();
    });
});
//# sourceMappingURL=setSlide.test.js.map