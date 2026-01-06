import { describe, it, expect, beforeEach } from "vitest";
import { fadeIn } from "./fadeIn";
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
    it("sets opacity to 0 then restores it", () => {
        el.style.opacity = "0.5";
        fadeIn(el, 200);
        // Final state after synchronous execution
        expect(el.style.opacity).toBe("0.5");
    });
    it("reveals element if display is none", () => {
        el.style.display = "none";
        fadeIn(el, 150);
        expect(getComputedStyle(el).display).not.toBe("none");
    });
});
//# sourceMappingURL=fadeIn.test.js.map