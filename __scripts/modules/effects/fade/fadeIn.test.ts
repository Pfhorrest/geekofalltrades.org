import { describe, it, expect, beforeEach, vi } from "vitest";
import { fadeIn } from "./fadeIn";
import { fadeOut } from "./fadeOut";

vi.mock("../../effects/helpers/helpers", () => ({
  delayForEvent: vi.fn().mockResolvedValue(undefined),
}));

describe("fadeIn", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
    document.body.appendChild(el);

    el.style.opacity = "1";
    el.style.display = "block";
  });

  it("sets transition duration", () => {
    fadeIn(el, 300);
    expect(el.style.transitionDuration).toBe("300ms");
  });

  it("restores opacity saved by fadeOut", async () => {
    el.style.opacity = "0.5";

    fadeOut(el, 200);

    await Promise.resolve();

    fadeIn(el, 200);

    await Promise.resolve();

    expect(el.style.opacity).toBe("0.5");
  });

  it("reveals element if display is none", () => {
    el.style.display = "none";

    fadeIn(el, 150);

    expect(getComputedStyle(el).display).not.toBe("none");
  });
});
