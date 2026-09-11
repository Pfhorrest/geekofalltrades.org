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
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
      return setTimeout(() => cb(performance.now()), 0) as unknown as number;
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
      .querySelector(".lessMotion")!
      .dispatchEvent(new MouseEvent("click"));

    expect(
      parseInt(
        document.documentElement
          .getAttribute("data-reduced-motion")
          ?.split("/")[0] || "0"
      )
    ).toBeGreaterThan(0);
    expect(setPreference).toHaveBeenCalledWith("reduced-motion", "1");
  });

  it("switches to more motion", () => {
    hydrateMotionSwitcher();

    document
      .querySelector(".moreMotion")!
      .dispatchEvent(new MouseEvent("click"));

    expect(
      parseInt(
        document.documentElement
          .getAttribute("data-reduced-motion")
          ?.split("/")[0] || "0"
      )
    ).toBeLessThan(0);
    expect(setPreference).toHaveBeenCalledWith("reduced-motion", "-1");
  });

  it("reverts to auto motion", () => {
    hydrateMotionSwitcher();

    document
      .querySelector(".autoMotion")!
      .dispatchEvent(new MouseEvent("click"));

    expect(
      parseInt(
        document.documentElement
          .getAttribute("data-reduced-motion")
          ?.split("/")[0] || "0"
      )
    ).toBe(0);
    expect(deletePreference).toHaveBeenCalledWith("reduced-motion");
  });
});
