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
import { fadeOut } from "./fadeOut";
vi.mock("../../effects/helpers/helpers", () => ({
    delayForEvent: vi.fn().mockResolvedValue(undefined),
}));
describe("fadeOut", () => {
    let el;
    beforeEach(() => {
        el = document.createElement("div");
        document.body.appendChild(el);
        el.style.opacity = "1";
        el.style.display = "block";
    });
    it("sets transition duration", () => {
        fadeOut(el, 300);
        expect(el.style.transitionDuration).toBe("300ms");
    });
    it("sets opacity to 0", () => {
        fadeOut(el, 200);
        expect(el.style.opacity).toBe("0");
    });
    it("sets display to none", () => __awaiter(void 0, void 0, void 0, function* () {
        fadeOut(el, 200);
        yield Promise.resolve();
        expect(el.style.display).toBe("none");
    }));
});
//# sourceMappingURL=fadeOut.test.js.map