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
import { hydrateDropdowns } from "./hydrateDropdowns";
import { slideDown, slideUp } from "../../effects/effects";
import { closeDropdowns } from "../helpers/closeDropdowns";
vi.mock("../../effects/effects", () => ({
    slideDown: vi.fn(),
    slideUp: vi.fn(),
    getDuration: vi.fn(() => 100),
}));
vi.mock("../helpers/closeDropdowns", () => ({
    closeDropdowns: vi.fn(),
}));
describe("hydrateDropdowns", () => {
    let menuItem;
    let submenu;
    let link;
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = `
      <header>
        <nav>
          <ul>
            <li>
              <a href="#">Menu</a>
              <ul></ul>
            </li>
          </ul>
        </nav>
      </header>
    `;
        hydrateDropdowns();
        menuItem = document.querySelector("li");
        submenu = menuItem.querySelector("ul");
        link = menuItem.querySelector("a");
    });
    it("marks menu items with submenus", () => {
        expect(menuItem.classList.contains("submenu")).toBe(true);
    });
    it("injects submenu toggle buttons", () => {
        const toggles = link.querySelectorAll(".submenu-toggle");
        expect(toggles.length).toBe(2);
        const firstToggle = toggles[0];
        const secondToggle = toggles[1];
        expect(firstToggle.getAttribute("aria-hidden")).toBeFalsy();
        expect(secondToggle.getAttribute("aria-hidden")).toBeTruthy();
        expect(firstToggle.tagName.toLowerCase()).toBe("button");
    });
    it("opens submenu on toggle click", () => __awaiter(void 0, void 0, void 0, function* () {
        const toggle = link.querySelector(".submenu-toggle");
        toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        yield Promise.resolve();
        expect(menuItem.classList.contains("active")).toBe(true);
        expect(slideDown).toHaveBeenCalledWith(submenu);
    }));
    it("closes submenu if already open", () => __awaiter(void 0, void 0, void 0, function* () {
        menuItem.classList.add("active");
        const toggle = link.querySelector(".submenu-toggle");
        toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(slideUp).toHaveBeenCalledWith(submenu);
        yield Promise.resolve();
        expect(menuItem.classList.contains("active")).toBe(false);
    }));
    it("closes other dropdowns before opening a new one", () => {
        const other = document.createElement("li");
        other.classList.add("active");
        document.querySelector("ul").appendChild(other);
        const toggle = link.querySelector(".submenu-toggle");
        toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(closeDropdowns).toHaveBeenCalled();
    });
    it("closes all dropdowns when clicking outside", () => {
        document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        expect(closeDropdowns).toHaveBeenCalled();
    });
});
//# sourceMappingURL=hydrateDropdowns.test.js.map