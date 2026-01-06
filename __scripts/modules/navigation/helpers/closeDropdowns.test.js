import { describe, it, expect, vi, beforeEach } from "vitest";
import { closeDropdowns } from "./closeDropdowns";
import * as effects from "../../effects/effects";
describe("closeDropdowns", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.spyOn(effects, "slideUp").mockImplementation(() => { });
        vi.spyOn(effects, "getDuration").mockReturnValue(100);
        document.body.innerHTML = `
      <header>
        <nav>
          <ul>
            <li class="active">
              <a title="Collapse submenu" aria-expanded="true">Menu</a>
              <ul style="display: block"></ul>
            </li>
            <li>
              <a>Other</a>
              <ul style="display: none"></ul>
            </li>
          </ul>
        </nav>
      </header>
    `;
    });
    it("slides up only visible dropdowns", () => {
        closeDropdowns();
        const dropdowns = document.querySelectorAll("ul ul");
        expect(effects.slideUp).toHaveBeenCalledTimes(1);
        expect(effects.slideUp).toHaveBeenCalledWith(dropdowns[0]);
    });
    it("removes active class after animation duration", () => {
        const item = document.querySelector("li.active");
        closeDropdowns();
        expect(item.classList.contains("active")).toBe(true);
        vi.advanceTimersByTime(100);
        expect(item.classList.contains("active")).toBe(false);
    });
    it("resets title and ariaExpanded on menu links", () => {
        const link = document.querySelector("li.active a");
        closeDropdowns();
        vi.advanceTimersByTime(100);
        expect(link.title).toBe("Expand submenu");
        expect(link.ariaExpanded).toBe("false");
    });
});
//# sourceMappingURL=closeDropdowns.test.js.map