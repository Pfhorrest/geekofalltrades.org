import { describe, it, expect, beforeEach, vi } from "vitest";
import { hydrateH1 } from "./hydrateH1";
import { slideToggle } from "../../effects/effects";
// Mock slideToggle
vi.mock("../../effects/effects", () => ({
    slideToggle: vi.fn(),
}));
describe("hydrateH1", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });
    it("does nothing if header > h1 does not exist", () => {
        // No header/h1 in DOM
        hydrateH1();
        expect(slideToggle).not.toHaveBeenCalled();
    });
    it("sets cursor to pointer on header > h1", () => {
        document.body.innerHTML = `
      <header>
        <h1>Site Title</h1>
      </header>
    `;
        const h1 = document.querySelector("header > h1");
        hydrateH1();
        expect(h1.style.cursor).toBe("pointer");
    });
    it("calls slideToggle on all header > nav elements when h1 is clicked", () => {
        document.body.innerHTML = `
      <header>
        <h1>Site Title</h1>
        <nav></nav>
        <nav></nav>
      </header>
    `;
        const h1 = document.querySelector("header > h1");
        const navs = document.querySelectorAll("header > nav");
        hydrateH1();
        h1.click();
        expect(slideToggle).toHaveBeenCalledTimes(navs.length);
        navs.forEach((nav) => {
            expect(slideToggle).toHaveBeenCalledWith(nav);
        });
    });
    it("handles multiple clicks by calling slideToggle each time", () => {
        document.body.innerHTML = `
      <header>
        <h1>Site Title</h1>
        <nav></nav>
      </header>
    `;
        const h1 = document.querySelector("header > h1");
        const nav = document.querySelector("header > nav");
        hydrateH1();
        h1.click();
        h1.click();
        expect(slideToggle).toHaveBeenCalledTimes(2);
        expect(slideToggle).toHaveBeenNthCalledWith(1, nav);
        expect(slideToggle).toHaveBeenNthCalledWith(2, nav);
    });
});
//# sourceMappingURL=hydrateH1.test.js.map