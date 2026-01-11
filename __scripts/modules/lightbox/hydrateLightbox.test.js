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
import { hydrateLightbox } from "./hydrateLightbox";
import * as set from "./setSlide";
import * as inc from "./incrementSlide";
import * as effects from "../effects/effects";
vi.mock("./setSlide", () => ({ setSlide: vi.fn() }));
vi.mock("./incrementSlide", () => ({ incrementSlide: vi.fn() }));
vi.mock("../effects/effects", () => ({
    fadeIn: vi.fn(),
    fadeOut: vi.fn(),
}));
vi.stubGlobal("fetch", vi.fn(() => Promise.resolve({
    text: () => Promise.resolve(`
        <div id="lightbox">
          <button class="prev"></button>
          <button class="next"></button>
          <button class="close"></button>
        </div>
      `),
})));
function flushPromises() {
    return new Promise((resolve) => setTimeout(resolve, 0));
    // In some environments, setImmediate might be used instead of setTimeout(resolve, 0)
}
describe("hydrateLightbox", () => {
    beforeEach(() => {
        document.body.innerHTML = `
      <main>
        <div class="gallery">
          <a href="?display=img.jpg"></a>
        </div>
      </main>
    `;
    });
    it("binds slide click to open lightbox", () => __awaiter(void 0, void 0, void 0, function* () {
        hydrateLightbox();
        yield flushPromises();
        const link = document.querySelector("a");
        link.click();
        expect(set.setSlide).toHaveBeenCalledWith(0);
        expect(effects.fadeIn).toHaveBeenCalled();
    }));
    it("binds next/prev/close controls", () => __awaiter(void 0, void 0, void 0, function* () {
        hydrateLightbox();
        yield flushPromises();
        document.querySelector(".next").dispatchEvent(new MouseEvent("click"));
        document.querySelector(".prev").dispatchEvent(new MouseEvent("click"));
        document.querySelector(".close").dispatchEvent(new MouseEvent("click"));
        expect(inc.incrementSlide).toHaveBeenCalledWith(1);
        expect(inc.incrementSlide).toHaveBeenCalledWith(-1);
        expect(effects.fadeOut).toHaveBeenCalled();
    }));
});
//# sourceMappingURL=hydrateLightbox.test.js.map