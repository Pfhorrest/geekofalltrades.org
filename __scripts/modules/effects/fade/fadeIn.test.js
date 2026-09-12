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
import { fadeIn } from "./fadeIn";
import { fadeOut } from "./fadeOut";
vi.mock("../../effects/helpers/helpers", () => ({
    delayForEvent: vi.fn().mockResolvedValue(undefined),
}));
describe("fadeIn", () => {
    let el;
    beforeEach(() => {
        el = document.createElement("div");
        document.body.appendChild(el);
        el.style.opacity = "1";
        el.style.display = "block";
    });
    it("sets transition duration", () => {
        fadeIn(el, 300);
        expect(el.style.transitionDuration).toBe("300ms");
    });
    it("restores opacity saved by fadeOut", () => __awaiter(void 0, void 0, void 0, function* () {
        el.style.opacity = "0.5";
        fadeOut(el, 200);
        yield Promise.resolve();
        fadeIn(el, 200);
        yield Promise.resolve();
        expect(el.style.opacity).toBe("0.5");
    }));
    it("reveals element if display is none", () => {
        el.style.display = "none";
        fadeIn(el, 150);
        expect(getComputedStyle(el).display).not.toBe("none");
    });
});
//# sourceMappingURL=fadeIn.test.js.map