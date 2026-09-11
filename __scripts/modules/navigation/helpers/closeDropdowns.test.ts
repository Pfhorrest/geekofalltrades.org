import { describe, it, expect, vi, beforeEach } from "vitest";
import { closeDropdowns } from "./closeDropdowns";
import * as effects from "../../effects/effects";

describe("closeDropdowns", () => {
  let resolveDelay: (value?: any) => void;
  let delayPromise: Promise<void>;

  beforeEach(() => {
    vi.spyOn(effects, "slideUp").mockImplementation(async () => {});
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

  it("slides up only visible dropdowns", async () => {
    resolveDelay();
    await closeDropdowns();

    const dropdowns = document.querySelectorAll("ul ul");
    expect(effects.slideUp).toHaveBeenCalledTimes(1);
    expect(effects.slideUp).toHaveBeenCalledWith(dropdowns[0]);
  });

  it("removes active class after animation duration", async () => {
    const item = document.querySelector("li.active")!;

    const execution = closeDropdowns();
    expect(item.classList.contains("active")).toBe(true);

    resolveDelay();
    await execution;

    expect(item.classList.contains("active")).toBe(false);
  });

  it("resets title and ariaExpanded on menu links", async () => {
    const link: HTMLElement = document.querySelector("li.active a")!;

    const execution = closeDropdowns();
    resolveDelay();
    await execution;

    expect(link.title).toBe("Expand submenu");
    expect(link.ariaExpanded).toBe("false");
  });
});
