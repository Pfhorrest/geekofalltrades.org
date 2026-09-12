import { describe, it, expect, beforeEach, vi } from "vitest";
import { fadeOut } from "./fadeOut";

vi.mock("../../effects/helpers/helpers", () => ({
  delayForEvent: vi.fn().mockResolvedValue(undefined),
}));

describe("fadeOut", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
    document.body.appendChild(el);

    el.style.opacity = "1";
    el.style.display = "block";
  });

  it("sets transition duration", () => {
    fadeOut(el, 300);
    expect(el.style.transitionDuration).toBe("300ms");
  });

  it("sets opacity to 0", () => {
    fadeOut(el, 200);
    expect(el.style.opacity).toBe("0");
  });

  it("sets display to none", async () => {
    fadeOut(el, 200);
    await Promise.resolve();
    expect(el.style.display).toBe("none");
  });
});
