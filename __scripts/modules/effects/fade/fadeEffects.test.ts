import { describe, it, expect, beforeEach, vi } from "vitest";
import * as fadeInModule from "./fadeIn";
import * as fadeOutModule from "./fadeOut";
import { fadeToggle } from "./fadeEffects";

describe("fadeToggle", () => {
  let el: HTMLElement;

  beforeEach(() => {
    el = document.createElement("div");
    document.body.appendChild(el);
  });

  it("calls fadeOut when opacity is non-zero", () => {
    el.style.opacity = "1";

    const fadeOutSpy = vi
      .spyOn(fadeOutModule, "fadeOut")
      .mockImplementation(() => {});

    fadeToggle(el, 250);

    expect(fadeOutSpy).toHaveBeenCalledWith(el, 250);
  });

  it("calls fadeIn when opacity is zero", () => {
    el.style.opacity = "0";

    const fadeInSpy = vi
      .spyOn(fadeInModule, "fadeIn")
      .mockImplementation(() => {});

    fadeToggle(el, 400);

    expect(fadeInSpy).toHaveBeenCalledWith(el, 400);
  });
});
