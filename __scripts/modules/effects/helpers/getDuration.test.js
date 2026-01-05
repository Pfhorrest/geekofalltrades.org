import { describe, it, expect, beforeEach } from "vitest";
import { getDuration } from "./getDuration";
describe("getDuration", () => {
    let el;
    beforeEach(() => {
        document.body.innerHTML = "";
        el = document.createElement("div");
        document.body.appendChild(el);
    });
    it("uses --dur when defined (ms)", () => {
        el.style.setProperty("--dur", "250ms");
        const result = getDuration(el);
        expect(result).toBe(250);
    });
    it("uses --dur when defined (seconds)", () => {
        el.style.setProperty("--dur", "0.4s");
        const result = getDuration(el);
        expect(result).toBe(400);
    });
    it("falls back to transition-duration when --dur is not defined", () => {
        el.style.transitionDuration = "150ms";
        const result = getDuration(el);
        expect(result).toBe(150);
    });
    it("handles transition-duration in seconds", () => {
        el.style.transitionDuration = "0.3s";
        const result = getDuration(el);
        expect(result).toBe(300);
    });
    it("returns 0 when neither --dur nor transition-duration are set", () => {
        const result = getDuration(el);
        expect(result).toBe(0);
    });
    it("treats bare numeric values as seconds (current behavior)", () => {
        el.style.setProperty("--dur", "2");
        const result = getDuration(el);
        expect(result).toBe(2000);
    });
});
//# sourceMappingURL=getDuration.test.js.map