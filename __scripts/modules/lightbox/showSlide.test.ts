import { afterEach, describe, it, expect, beforeEach, vi } from "vitest";
import { showSlide } from "./showSlide";
import { slides } from "./lightboxState";

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  document.body.innerHTML = `
    <div class="item">
      <a href="?display=test.jpg"></a>
      <h3>Caption</h3>
    </div>
    <div id="caption"><span></span></div>
    <img id="lightboxImage" />
  `;

  fetchMock = vi.fn().mockResolvedValue({
    ok: true,
    headers: {
      get: () => "image/jpeg",
    },
  });
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

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

  it("keeps the image hidden until its load event fires", async () => {
    const anchors = document.querySelectorAll<HTMLAnchorElement>("a");
    slides(anchors);

    showSlide(0);

    const img = document.getElementById("lightboxImage") as HTMLImageElement;
    expect(img.style.visibility).toBe("hidden");

    await vi.waitFor(() => expect(img.src).toContain("test.jpg"));
    img.dispatchEvent(new Event("load"));

    expect(img.style.visibility).toBe("visible");
  });

  it("falls back to the media directory when the response is not an image", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      headers: { get: () => "text/html" },
    });
    const anchors = document.querySelectorAll<HTMLAnchorElement>("a");
    slides(anchors);

    showSlide(0);

    const img = document.getElementById("lightboxImage") as HTMLImageElement;
    await vi.waitFor(() => expect(img.src).toContain("_media/images/test.jpg"));
  });

  it("falls back to the media directory when fetching the image fails", async () => {
    fetchMock.mockRejectedValueOnce(new Error("Network failure"));
    const anchors = document.querySelectorAll<HTMLAnchorElement>("a");
    slides(anchors);

    showSlide(0);

    const img = document.getElementById("lightboxImage") as HTMLImageElement;
    await vi.waitFor(() => expect(img.src).toContain("_media/images/test.jpg"));
  });

  it("wraps negative indices", async () => {
    const anchors = document.querySelectorAll<HTMLAnchorElement>("a");
    slides(anchors);

    showSlide(-1);

    const img = document.getElementById("lightboxImage") as HTMLImageElement;
    await Promise.resolve();
    expect(img.src).toContain("test.jpg");
  });

  it("wraps positive indices that exceed the number of slides", async () => {
    document.body.innerHTML = `
      <div class="item">
        <a href="?display=first.jpg"></a>
        <h3>First caption</h3>
      </div>
      <div class="item">
        <a href="?display=second.jpg"></a>
        <h3>Second caption</h3>
      </div>
      <div id="caption"><span></span></div>
      <img id="lightboxImage" />
    `;
    slides(document.querySelectorAll<HTMLAnchorElement>("a"));

    showSlide(2);

    const img = document.getElementById("lightboxImage") as HTMLImageElement;
    const caption = document.querySelector("#caption span")!;
    expect(caption.textContent).toBe("First caption");
    await vi.waitFor(() => expect(img.src).toContain("first.jpg"));
  });
});
