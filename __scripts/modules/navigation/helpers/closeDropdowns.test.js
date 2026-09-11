var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, vi, beforeEach } from "vitest";
import { closeDropdowns } from "./closeDropdowns";
import * as effects from "../../effects/effects";
describe("closeDropdowns", () => {
    let resolveDelay;
    let delayPromise;
    beforeEach(() => {
        vi.spyOn(effects, "slideUp").mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () { }));
        delayPromise = new Promise((resolve) => {
            resolveDelay = resolve;
        });
        vi.spyOn(effects, "delayForEvent").mockReturnValue(delayPromise);
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
    it("slides up only visible dropdowns", () => __awaiter(void 0, void 0, void 0, function* () {
        resolveDelay();
        yield closeDropdowns();
        const dropdowns = document.querySelectorAll("ul ul");
        expect(effects.slideUp).toHaveBeenCalledTimes(1);
        expect(effects.slideUp).toHaveBeenCalledWith(dropdowns[0]);
    }));
    it("removes active class after animation duration", () => __awaiter(void 0, void 0, void 0, function* () {
        const item = document.querySelector("li.active");
        const execution = closeDropdowns();
        expect(item.classList.contains("active")).toBe(true);
        resolveDelay();
        yield execution;
        expect(item.classList.contains("active")).toBe(false);
    }));
    it("resets title and ariaExpanded on menu links", () => __awaiter(void 0, void 0, void 0, function* () {
        const link = document.querySelector("li.active a");
        const execution = closeDropdowns();
        resolveDelay();
        yield execution;
        expect(link.title).toBe("Expand submenu");
        expect(link.ariaExpanded).toBe("false");
    }));
});
//# sourceMappingURL=closeDropdowns.test.js.map