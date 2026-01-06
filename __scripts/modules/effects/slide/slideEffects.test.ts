import { describe, it, expect, vi, beforeEach } from "vitest";
import * as slideDownModule from "./slideDown";
import * as slideUpModule from "./slideUp";
import { slideToggle } from "./slideEffects";
import * as durationModule from "../helpers/getDuration";

describe("slideToggle", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
    el.style.display = "block";
    vi.restoreAllMocks();
  });

  it("calls slideUp when element is visible", () => {
    const upSpy = vi.spyOn(slideUpModule, "slideUp").mockImplementation(() => {});
    const downSpy = vi
      .spyOn(slideDownModule, "slideDown")
      .mockImplementation(() => {});

    slideToggle(el, 300);

    expect(upSpy).toHaveBeenCalledOnce();
    expect(upSpy).toHaveBeenCalledWith(el, 300);
    expect(downSpy).not.toHaveBeenCalled();
  });

  it("calls slideDown when element is hidden", () => {
    el.style.display = "none";

    const upSpy = vi.spyOn(slideUpModule, "slideUp").mockImplementation(() => {});
    const downSpy = vi
      .spyOn(slideDownModule, "slideDown")
      .mockImplementation(() => {});

    slideToggle(el, 300);

    expect(downSpy).toHaveBeenCalledOnce();
    expect(downSpy).toHaveBeenCalledWith(el, 300);
    expect(upSpy).not.toHaveBeenCalled();
  });

  it("uses getDuration when no duration is provided", () => {
    el.style.display = "none";

    const upSpy = vi.spyOn(slideUpModule, "slideUp").mockImplementation(() => {});
    const downSpy = vi
      .spyOn(slideDownModule, "slideDown")
      .mockImplementation(() => {});
    const durationSpy = vi
      .spyOn(durationModule, "getDuration")
      .mockReturnValue(250);

    slideToggle(el);

    expect(durationSpy).toHaveBeenCalledOnce();
    expect(downSpy).toHaveBeenCalledWith(el, 250);
    expect(upSpy).not.toHaveBeenCalled();
  });
});
