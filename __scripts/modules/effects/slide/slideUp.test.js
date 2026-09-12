var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, afterEach, vi, } from "vitest";
import { slideUp } from "./slideUp";
import { getDuration } from "../../effects/helpers/helpers";
vi.mock("../../effects/helpers/helpers", () => ({
    getDuration: vi.fn(),
    delay: vi.fn().mockResolvedValue(undefined),
    delayForEvent: vi.fn().mockResolvedValue(undefined),
}));
describe("slideUp", () => {
    let el;
    beforeEach(() => {
        getDuration.mockReturnValue(300);
        el = document.createElement("div");
        document.body.appendChild(el);
        Object.defineProperty(el, "offsetHeight", {
            configurable: true,
            get: () => 100,
        });
    });
    afterEach(() => {
        document.body.innerHTML = "";
    });
    it("collapses a visible element", () => {
        slideUp(el, 300);
        expect(el.style.overflow).toBe("hidden");
        expect(el.style.transition).toContain("300ms");
        expect(el.style.height).toBe("0px");
    });
    it("sets display to none after transition", () => __awaiter(void 0, void 0, void 0, function* () {
        slideUp(el, 300);
        el.dispatchEvent(new TransitionEvent("transitionend", { propertyName: "height" }));
        yield Promise.resolve();
        expect(el.style.display).toBe("none");
        expect(el.style.height).toBe("");
        expect(el.style.transition).toBe("");
        expect(el.style.overflow).toBe("");
    }));
    it("falls back to timeout cleanup if transitionend does not fire", () => __awaiter(void 0, void 0, void 0, function* () {
        slideUp(el, 300);
        yield Promise.resolve();
        expect(el.style.display).toBe("none");
    }));
});
//# sourceMappingURL=slideUp.test.js.map