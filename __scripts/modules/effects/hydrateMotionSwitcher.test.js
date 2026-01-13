import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";
import { hydrateMotionSwitcher } from "./hydrateMotionSwitcher";
import { setPreference } from "../preferences/setPreference.js";
import { deletePreference } from "../preferences/deletePreference.js";
vi.mock("../preferences/setPreference", () => ({
    setPreference: vi.fn(),
}));
vi.mock("../preferences/deletePreference", () => ({
    deletePreference: vi.fn(),
}));
describe("hydrateMotionSwitcher", () => {
    beforeAll(() => {
        vi.stubGlobal("requestAnimationFrame", (cb) => {
            return setTimeout(() => cb(performance.now()), 0);
        });
    });
    beforeEach(() => {
        document.body.innerHTML = "<footer></footer>";
        document.documentElement.removeAttribute("data-reduced-motion");
        vi.clearAllMocks();
    });
    it("creates motion switcher controls", () => {
        hydrateMotionSwitcher();
        expect(document.querySelector("#motionSwitcher")).toBeTruthy();
    });
    it("switches to less motion", () => {
        hydrateMotionSwitcher();
        document
            .querySelector(".lessMotion")
            .dispatchEvent(new MouseEvent("click"));
        expect(document.documentElement.getAttribute("data-reduced-motion")).toBe("yes");
        expect(setPreference).toHaveBeenCalledWith("reduced-motion", "yes");
    });
    it("switches to more motion", () => {
        hydrateMotionSwitcher();
        document
            .querySelector(".moreMotion")
            .dispatchEvent(new MouseEvent("click"));
        expect(document.documentElement.getAttribute("data-reduced-motion")).toBe("no");
        expect(setPreference).toHaveBeenCalledWith("reduced-motion", "no");
    });
    it("reverts to auto motion", () => {
        hydrateMotionSwitcher();
        document
            .querySelector(".autoMotion")
            .dispatchEvent(new MouseEvent("click"));
        expect(document.documentElement.hasAttribute("data-reduced-motion")).toBe(false);
        expect(deletePreference).toHaveBeenCalledWith("reduced-motion");
    });
});
//# sourceMappingURL=hydrateMotionSwitcher.test.js.map