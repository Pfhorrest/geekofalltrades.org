import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import { hydrateMotionSwitcher } from "./hydrateMotionSwitcher";
import { setPreference } from "../preferences/setPreference.js";
import { deletePreference } from "../preferences/deletePreference.js";

vi.mock("../preferences/setPreference", () => ({
  setPreference: vi.fn(),
}));

vi.mock("../preferences/deletePreference", () => ({
  deletePreference: vi.fn(),
}));

let scheduledFrames: FrameRequestCallback[];

describe("hydrateMotionSwitcher", () => {
  beforeEach(() => {
    scheduledFrames = [];
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      scheduledFrames.push(callback);
      return scheduledFrames.length;
    });
    vi.spyOn(performance, "now").mockReturnValue(0);

    document.body.innerHTML = "<footer></footer>";
    document.documentElement.removeAttribute("data-reduced-motion");
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("creates motion switcher controls", () => {
    hydrateMotionSwitcher();

    expect(document.querySelector("#motionSwitcher")).toBeTruthy();
    expect(document.querySelectorAll("#motionSwitcher a")).toHaveLength(3);
    expect(scheduledFrames).toHaveLength(1);
  });

  it("switches to less motion", () => {
    hydrateMotionSwitcher();

    document.querySelector(".lessMotion")!.dispatchEvent(new MouseEvent("click"));

    expect(document.documentElement.getAttribute("data-reduced-motion")).toBe("1");
    expect(setPreference).toHaveBeenCalledWith("reduced-motion", "1");
  });

  it("switches to more motion", () => {
    hydrateMotionSwitcher();

    document.querySelector(".moreMotion")!.dispatchEvent(new MouseEvent("click"));

    expect(document.documentElement.getAttribute("data-reduced-motion")).toBe("-1");
    expect(setPreference).toHaveBeenCalledWith("reduced-motion", "-1");
  });

  it("reverts to auto motion", () => {
    document.documentElement.setAttribute("data-reduced-motion", "1");
    hydrateMotionSwitcher();

    document.querySelector(".autoMotion")!.dispatchEvent(new MouseEvent("click"));

    expect(document.documentElement.hasAttribute("data-reduced-motion")).toBe(false);
    expect(deletePreference).toHaveBeenCalledWith("reduced-motion");
  });

  it("increases reduced motion after a low-FPS measurement in automatic mode", () => {
    const now = vi.spyOn(performance, "now");
    now.mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(1000);
    hydrateMotionSwitcher();

    scheduledFrames.shift()!(1000);

    expect(document.documentElement.getAttribute("data-reduced-motion")).toBe("1/auto");
    expect(setPreference).toHaveBeenNthCalledWith(1, "reduced-motion", "0/auto");
    expect(setPreference).toHaveBeenNthCalledWith(2, "reduced-motion", "1/auto");
    expect(scheduledFrames).toHaveLength(1);
  });

  it("reduces the automatic motion limit after a high-FPS measurement", () => {
    const now = vi.spyOn(performance, "now").mockReturnValue(0);
    hydrateMotionSwitcher();

    // The immediate sample is at t=0. Thirty subsequent samples stay below
    // one second; the 31st callback crosses the one-second measurement window.
    for (let frameNumber = 1; frameNumber <= 31; frameNumber += 1) {
      now.mockReturnValue(frameNumber === 31 ? 1000 : frameNumber * 33);
      scheduledFrames.shift()!(frameNumber * 33);
    }

    expect(document.documentElement.getAttribute("data-reduced-motion")).toBe("-1/auto");
    expect(setPreference).toHaveBeenNthCalledWith(1, "reduced-motion", "0/auto");
    expect(setPreference).toHaveBeenNthCalledWith(2, "reduced-motion", "-1/auto");
  });

  it("does not let FPS monitoring override a pre-existing explicit preference", () => {
    document.documentElement.setAttribute("data-reduced-motion", "1");
    const now = vi.spyOn(performance, "now");
    now.mockReturnValueOnce(0).mockReturnValueOnce(0).mockReturnValueOnce(1000);
    hydrateMotionSwitcher();

    scheduledFrames.shift()!(1000);

    expect(document.documentElement.getAttribute("data-reduced-motion")).toBe("1");
    expect(setPreference).not.toHaveBeenCalled();
  });

  it("still starts its FPS monitor when the footer is absent", () => {
    document.body.innerHTML = "";

    hydrateMotionSwitcher();

    expect(document.querySelector("#motionSwitcher")).toBeNull();
    expect(scheduledFrames).toHaveLength(1);
  });
});
