import { describe, it, expect, beforeEach, vi } from "vitest";
import { hydrateDropdowns } from "./hydrateDropdowns";
import { slideDown, slideUp, getDuration } from "../../effects/effects";
import { closeDropdowns } from "../helpers/closeDropdowns";

vi.useFakeTimers();

vi.mock("../../effects/effects", () => ({
  slideDown: vi.fn(),
  slideUp: vi.fn(),
  getDuration: vi.fn(() => 100),
}));

vi.mock("../helpers/closeDropdowns", () => ({
  closeDropdowns: vi.fn(),
}));

describe("hydrateDropdowns", () => {
  let menuItem: HTMLElement;
  let submenu: HTMLElement;
  let link: HTMLElement;

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

    menuItem = document.querySelector("li")!;
    submenu = menuItem.querySelector("ul")!;
    link = menuItem.querySelector("a")!;
  });

  it("marks menu items with submenus", () => {
    expect(menuItem.classList.contains("submenu")).toBe(true);
  });

  it("injects submenu toggle buttons", () => {
    const toggles = link.querySelectorAll(".submenu-toggle");
    expect(toggles.length).toBe(2);
    toggles.forEach(toggle => {
      expect(toggle.getAttribute("aria-hidden")).toBe("true");
      expect(toggle.getAttribute("role")).toBe("button");
    });
  });

  it("opens submenu on toggle click", () => {
    const toggle = link.querySelector(".submenu-toggle")!;
    toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    vi.runAllTimers();

    expect(menuItem.classList.contains("active")).toBe(true);
    expect(slideDown).toHaveBeenCalledWith(submenu);
  });

  it("closes submenu if already open", () => {
    menuItem.classList.add("active");

    const toggle = link.querySelector(".submenu-toggle")!;
    toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(slideUp).toHaveBeenCalledWith(submenu);

    vi.advanceTimersByTime(100);

    expect(menuItem.classList.contains("active")).toBe(false);
  });

  it("closes other dropdowns before opening a new one", () => {
    const other = document.createElement("li");
    other.classList.add("active");
    document.querySelector("ul")!.appendChild(other);

    const toggle = link.querySelector(".submenu-toggle")!;
    toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    expect(closeDropdowns).toHaveBeenCalled();
  });

  it("closes all dropdowns when clicking outside", () => {
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(closeDropdowns).toHaveBeenCalled();
  });
});
