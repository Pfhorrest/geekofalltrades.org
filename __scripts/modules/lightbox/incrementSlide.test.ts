import { describe, it, expect, beforeEach, vi } from "vitest";
import { incrementSlide } from "./incrementSlide";
import * as effects from "../effects/effects";
import * as show from "./showSlide";
import * as state from "./lightboxState";

vi.mock("../effects/effects", () => ({
  fadeOut: vi.fn(),
  fadeIn: vi.fn(),
  delayForEvent: vi.fn(),
}));

vi.mock("./showSlide", () => ({
  showSlide: vi.fn(),
}));

describe("incrementSlide", () => {
  beforeEach(() => {
    document.body.innerHTML = `<div id="lightbox"><img id="lightboxImage"></div>`;

    HTMLImageElement.prototype.decode = vi.fn().mockResolvedValue(undefined);

    vi.spyOn(state, "slideIndex").mockImplementation((n?: number) =>
      n != null ? n : 0,
    );

    vi.spyOn(state, "slideDuration").mockReturnValue(500);
  });

  it("fades out, advances slide, fades in", async () => {
    const execution = incrementSlide(1);

    expect(effects.fadeOut).toHaveBeenCalled();

    await Promise.resolve();

    expect(show.showSlide).toHaveBeenCalledWith(1);
    expect(effects.fadeIn).not.toHaveBeenCalled();

    await execution;

    expect(effects.fadeIn).toHaveBeenCalled();
  });
});
