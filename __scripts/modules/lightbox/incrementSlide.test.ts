import { describe, it, expect, beforeEach, vi } from "vitest";
import { incrementSlide } from "./incrementSlide";
import * as effects from "../effects/effects";
import * as show from "./showSlide";
import * as state from "./lightboxState";

vi.mock("../effects/effects", () => ({
  fadeOut: vi.fn(),
  fadeIn: vi.fn(),
}));

vi.mock("./showSlide", () => ({
  showSlide: vi.fn(),
}));

describe("incrementSlide", () => {
  beforeEach(() => {
    vi.useFakeTimers();

    document.body.innerHTML = `<img id="lightboxImage" />`;

    vi.spyOn(state, "slideIndex")
      .mockImplementation((n?: number) => (n != null ? n : 0));

    vi.spyOn(state, "slideDuration").mockReturnValue(500);
  });

  it("fades out, advances slide, fades in", () => {
    incrementSlide(1);

    expect(effects.fadeOut).toHaveBeenCalled();

    vi.advanceTimersByTime(500);

    expect(show.showSlide).toHaveBeenCalledWith(1);

    const img = document.getElementById("lightboxImage")!;
    img.dispatchEvent(new Event("load"));

    expect(effects.fadeIn).toHaveBeenCalled();
  });
});
