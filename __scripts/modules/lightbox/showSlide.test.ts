import { describe, it, expect, beforeEach, vi } from "vitest";
import { showSlide } from "./showSlide";
import { slides } from "./lightboxState";

beforeEach(() => {
  document.body.innerHTML = `
    <div class="item">
      <a href="?display=test.jpg"></a>
      <h3>Caption</h3>
    </div>
    <div id="caption"><span></span></div>
    <img id="lightboxImage" />
  `;
});

vi.stubGlobal("fetch", vi.fn(() =>
  Promise.resolve({
    ok: true,
    headers: {
      get: () => "image/jpeg",
    },
  })
));

describe("showSlide", () => {
  it("sets caption and image src", async () => {
    const anchors = document.querySelectorAll<HTMLAnchorElement>("a");
    slides(anchors);

    showSlide(0);

    const img = document.getElementById("lightboxImage") as HTMLImageElement;
    const caption = document.querySelector("#caption span")!;

    expect(caption.textContent).toBe("Caption");

    await Promise.resolve(); // allow fetch then()
    expect(img.src).toContain("test.jpg");
  });

  it("wraps negative indices", async () => {
    const anchors = document.querySelectorAll<HTMLAnchorElement>("a");
    slides(anchors);

    showSlide(-1);

    const img = document.getElementById("lightboxImage") as HTMLImageElement;
    await Promise.resolve();
    expect(img.src).toContain("test.jpg");
  });

  it("returns early if slide does not exist", () => {
    slides(document.querySelectorAll("a"));
    expect(() => showSlide(5)).not.toThrow();
  });
});
