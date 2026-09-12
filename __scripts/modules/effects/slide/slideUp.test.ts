import {
  describe,
  it,
  expect,
  beforeEach,
  afterEach,
  vi,
  type MockedFunction,
} from "vitest";
import { slideUp } from "./slideUp";
import { getDuration } from "../../effects/helpers/helpers";

vi.mock("../../effects/helpers/helpers", () => ({
  getDuration: vi.fn(),
  delay: vi.fn().mockResolvedValue(undefined),
  delayForEvent: vi.fn().mockResolvedValue(undefined),
}));

describe("slideUp", () => {
  let el: HTMLElement;

  beforeEach(() => {
    (getDuration as MockedFunction<typeof getDuration>).mockReturnValue(300);

    el = document.createElement("div");
    document.body.appendChild(el);

    Object.defineProperty(el, "offsetHeight", {
      configurable: true,
      get: () => 100,
    });
  });

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("collapses a visible element", () => {
    slideUp(el, 300);

    expect(el.style.overflow).toBe("hidden");
    expect(el.style.transition).toContain("300ms");
    expect(el.style.height).toBe("0px");
  });

  it("sets display to none after transition", async () => {
    slideUp(el, 300);

    el.dispatchEvent(new TransitionEvent("transitionend", {propertyName: "height"}));

    await Promise.resolve();

    expect(el.style.display).toBe("none");
    expect(el.style.height).toBe("");
    expect(el.style.transition).toBe("");
    expect(el.style.overflow).toBe("");
  });

  it("falls back to timeout cleanup if transitionend does not fire", async () => {
    slideUp(el, 300);

    await Promise.resolve();

    expect(el.style.display).toBe("none");
  });
});
