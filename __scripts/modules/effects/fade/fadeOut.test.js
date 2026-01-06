import { describe, it, expect, beforeEach } from "vitest";
import { fadeOut } from "./fadeOut";
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
    it("sets display to none", () => {
        fadeOut(el, 200);
        expect(el.style.display).toBe("none");
    });
});
//# sourceMappingURL=fadeOut.test.js.map