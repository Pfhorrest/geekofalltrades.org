import { describe, it, expect, vi, beforeEach } from "vitest";
import { hydrateColorSwitcher } from "./hydrateColorSwitcher";
vi.mock("../preferences/setPreference", () => ({
    setPreference: vi.fn(),
}));
vi.mock("../preferences/deletePreference", () => ({
    deletePreference: vi.fn(),
}));
import { setPreference } from "../preferences/setPreference.js";
import { deletePreference } from "../preferences/deletePreference.js";
describe("hydrateColorSwitcher", () => {
    beforeEach(() => {
        document.body.innerHTML = "<footer></footer>";
        document.documentElement.removeAttribute("data-color-scheme");
        document.documentElement.removeAttribute("data-theme");
        vi.clearAllMocks();
    });
    it("creates color and theme switchers", () => {
        hydrateColorSwitcher();
        expect(document.querySelector("#lightOrDarkSwitcher")).toBeTruthy();
        expect(document.querySelector("#themeSwitcher")).toBeTruthy();
    });
    it("switches to dark mode", () => {
        hydrateColorSwitcher();
        document.querySelector(".darkMode").dispatchEvent(new MouseEvent("click"));
        expect(document.documentElement.getAttribute("data-color-scheme")).toBe("dark");
        expect(setPreference).toHaveBeenCalledWith("color-scheme", "dark");
    });
    it("reverts to auto mode", () => {
        hydrateColorSwitcher();
        document.documentElement.setAttribute("data-color-scheme", "dark");
        document.querySelector(".autoMode").dispatchEvent(new MouseEvent("click"));
        expect(document.documentElement.hasAttribute("data-color-scheme")).toBe(false);
        expect(deletePreference).toHaveBeenCalledWith("color-scheme");
    });
    it("switches theme to alien", () => {
        hydrateColorSwitcher();
        document
            .querySelector(".alien-theme")
            .dispatchEvent(new MouseEvent("click"));
        expect(document.documentElement.getAttribute("data-theme")).toBe("alien");
        expect(setPreference).toHaveBeenCalledWith("theme", "alien");
    });
});
//# sourceMappingURL=hydrateColorSwitcher.test.js.map