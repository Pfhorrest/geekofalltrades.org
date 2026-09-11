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
import { incrementSlide } from "./incrementSlide";
import * as effects from "../effects/effects";
import * as show from "./showSlide";
import * as state from "./lightboxState";
vi.mock("../effects/effects", () => ({
    fadeOut: vi.fn(),
    fadeIn: vi.fn(),
    delayForEvent: vi.fn(),
}));
vi.mock("./showSlide", () => ({
    showSlide: vi.fn(),
}));
describe("incrementSlide", () => {
    beforeEach(() => {
        document.body.innerHTML = `<div id="lightbox"><img id="lightboxImage"></div>`;
        HTMLImageElement.prototype.decode = vi.fn().mockResolvedValue(undefined);
        vi.spyOn(state, "slideIndex").mockImplementation((n) => n != null ? n : 0);
        vi.spyOn(state, "slideDuration").mockReturnValue(500);
    });
    it("fades out, advances slide, fades in", () => __awaiter(void 0, void 0, void 0, function* () {
        const execution = incrementSlide(1);
        expect(effects.fadeOut).toHaveBeenCalled();
        yield Promise.resolve();
        expect(show.showSlide).toHaveBeenCalledWith(1);
        expect(effects.fadeIn).not.toHaveBeenCalled();
        yield execution;
        expect(effects.fadeIn).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=incrementSlide.test.js.map