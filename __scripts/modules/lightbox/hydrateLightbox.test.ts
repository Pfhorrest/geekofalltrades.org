import { describe, it, expect, beforeEach, vi } from "vitest";
import { hydrateLightbox } from "./hydrateLightbox";
import * as set from "./setSlide";
import * as inc from "./incrementSlide";
import * as effects from "../effects/effects";

vi.mock("./setSlide", () => ({ setSlide: vi.fn() }));
vi.mock("./incrementSlide", () => ({ incrementSlide: vi.fn() }));
vi.mock("../effects/effects", () => ({
  fadeIn: vi.fn(),
  fadeOut: vi.fn(),
}));

vi.stubGlobal(
  "fetch",
  vi.fn(() =>
    Promise.resolve({
      text: () =>
        Promise.resolve(`
        <div id="lightbox">
          <button class="prev"></button>
          <button class="next"></button>
          <button class="close"></button>
        </div>
      `),
    })
  )
);

function flushPromises() {
  return new Promise((resolve) => setTimeout(resolve, 0));
  // In some environments, setImmediate might be used instead of setTimeout(resolve, 0)
}
describe("hydrateLightbox", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <main>
        <div class="gallery">
          <a href="?display=img.jpg"></a>
        </div>
      </main>
    `;
  });

  it("binds slide click to open lightbox", async () => {
    hydrateLightbox();
    await flushPromises();

    const link = document.querySelector("a")!;
    link.click();

    expect(set.setSlide).toHaveBeenCalledWith(0);
    expect(effects.fadeIn).toHaveBeenCalled();
  });

  it("binds next/prev/close controls", async () => {
    hydrateLightbox();
    await flushPromises();
    document.querySelector(".next")!.dispatchEvent(new MouseEvent("click"));
    document.querySelector(".prev")!.dispatchEvent(new MouseEvent("click"));
    document.querySelector(".close")!.dispatchEvent(new MouseEvent("click"));

    expect(inc.incrementSlide).toHaveBeenCalledWith(1);
    expect(inc.incrementSlide).toHaveBeenCalledWith(-1);
    expect(effects.fadeOut).toHaveBeenCalled();
  });
});
