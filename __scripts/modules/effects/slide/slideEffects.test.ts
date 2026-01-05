import { describe, it, expect, vi, beforeEach } from "vitest";
import { slideToggle } from "./slideEffects";

describe("slideToggle", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
    // Default to visible
    el.style.display = "block";
  });

  it("calls slideUp when element is visible", () => {
    const upSpy = vi.fn();
    const downSpy = vi.fn();

    slideToggle(el, 300, downSpy, upSpy);

    expect(upSpy).toHaveBeenCalledOnce();
    expect(upSpy).toHaveBeenCalledWith(el, 300);
    expect(downSpy).not.toHaveBeenCalled();
  });

  it("calls slideDown when element is hidden", () => {
    el.style.display = "none";

    const upSpy = vi.fn();
    const downSpy = vi.fn();

    slideToggle(el, 300, downSpy, upSpy);

    expect(downSpy).toHaveBeenCalledOnce();
    expect(downSpy).toHaveBeenCalledWith(el, 300);
    expect(upSpy).not.toHaveBeenCalled();
  });

  it("uses getDuration when no duration is provided", () => {
    el.style.display = "none";

    const upSpy = vi.fn();
    const downSpy = vi.fn();
    const mockGetDuration = vi.fn(() => 250);

    slideToggle(el, undefined, downSpy, upSpy, mockGetDuration);

    expect(mockGetDuration).toHaveBeenCalledOnce();
    expect(downSpy).toHaveBeenCalledWith(el, 250);
    expect(upSpy).not.toHaveBeenCalled();
  });

});
