import { describe, it, expect, beforeEach, vi } from "vitest";
import { hydrateScrollAnimation } from "./hydrateScrollAnimation";
import { offScreenObserver } from "./offScreenObserver";
import { isInView } from "./isInView";
vi.mock("./offScreenObserver", () => ({
    offScreenObserver: {
        observe: vi.fn(),
    },
}));
vi.mock("./isInView", () => ({
    isInView: vi.fn(),
}));
describe("hydrateScrollAnimation", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });
    it("adds 'off-screen' class to elements not in view and observes them", () => {
        isInView.mockReturnValue(false);
        document.body.innerHTML = `
      <main>
        <div class="test"></div>
      </main>
    `;
        hydrateScrollAnimation();
        const element = document.querySelector(".test");
        expect(element.classList.contains("off-screen")).toBe(true);
        expect(offScreenObserver.observe).toHaveBeenCalledWith(element);
    });
    it("does not add 'off-screen' class to elements already in view", () => {
        isInView.mockReturnValue(true);
        document.body.innerHTML = `
      <main>
        <div class="test"></div>
      </main>
    `;
        hydrateScrollAnimation();
        const element = document.querySelector(".test");
        expect(element.classList.contains("off-screen")).toBe(false);
        expect(offScreenObserver.observe).toHaveBeenCalledWith(element);
    });
});
//# sourceMappingURL=hydrateScrollAnimation.test.js.map