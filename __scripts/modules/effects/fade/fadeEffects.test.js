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
import * as fadeInModule from "./fadeIn";
import * as fadeOutModule from "./fadeOut";
import { fadeToggle } from "./fadeEffects";
describe("fadeToggle", () => {
    let el;
    beforeEach(() => {
        el = document.createElement("div");
        document.body.appendChild(el);
    });
    it("calls fadeOut when opacity is non-zero", () => {
        el.style.opacity = "1";
        const fadeOutSpy = vi
            .spyOn(fadeOutModule, "fadeOut")
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        fadeToggle(el, 250);
        expect(fadeOutSpy).toHaveBeenCalledWith(el, 250);
    });
    it("calls fadeIn when opacity is zero", () => {
        el.style.opacity = "0";
        const fadeInSpy = vi
            .spyOn(fadeInModule, "fadeIn")
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        fadeToggle(el, 400);
        expect(fadeInSpy).toHaveBeenCalledWith(el, 400);
    });
});
//# sourceMappingURL=fadeEffects.test.js.map