var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, vi, beforeEach } from "vitest";
import * as slideDownModule from "./slideDown";
import * as slideUpModule from "./slideUp";
import { slideToggle } from "./slideEffects";
import * as durationModule from "../helpers/getDuration";
describe("slideToggle", () => {
    let el;
    beforeEach(() => {
        el = document.createElement("div");
        el.style.display = "block";
        vi.restoreAllMocks();
    });
    it("calls slideUp when element is visible", () => {
        const upSpy = vi.spyOn(slideUpModule, "slideUp").mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        const downSpy = vi
            .spyOn(slideDownModule, "slideDown")
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        slideToggle(el, 300);
        expect(upSpy).toHaveBeenCalledOnce();
        expect(upSpy).toHaveBeenCalledWith(el, 300);
        expect(downSpy).not.toHaveBeenCalled();
    });
    it("calls slideDown when element is hidden", () => {
        el.style.display = "none";
        const upSpy = vi.spyOn(slideUpModule, "slideUp").mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        const downSpy = vi
            .spyOn(slideDownModule, "slideDown")
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        slideToggle(el, 300);
        expect(downSpy).toHaveBeenCalledOnce();
        expect(downSpy).toHaveBeenCalledWith(el, 300);
        expect(upSpy).not.toHaveBeenCalled();
    });
    it("uses getDuration when no duration is provided", () => {
        el.style.display = "none";
        const upSpy = vi.spyOn(slideUpModule, "slideUp").mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        const downSpy = vi
            .spyOn(slideDownModule, "slideDown")
            .mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        const durationSpy = vi
            .spyOn(durationModule, "getDuration")
            .mockReturnValue(250);
        slideToggle(el);
        expect(durationSpy).toHaveBeenCalledOnce();
        expect(downSpy).toHaveBeenCalledWith(el, 250);
        expect(upSpy).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=slideEffects.test.js.map