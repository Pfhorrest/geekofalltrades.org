import { describe, expect, it } from "vitest";
import {
  findSubgalleryLink,
  parseSubgalleryEntries,
} from "./getSubgalleryData";

function createItemFixture(html: string): HTMLElement {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.firstElementChild as HTMLElement;
}

describe("parseSubgalleryEntries", () => {
  it("extracts title, description, image, and cover data from a single item", () => {
    const html = `
      <div class="gallery">
        <div class="item">
          <p class="title">Curlew in the Sunset</p>
          <img src="IMG_3332-thumb.jpeg" alt="A curlew wading">
          <p class="description">iPhone 14 Pro Max, 2026-09-03</p>
          <a class="cover" href="?display=IMG_3332.jpeg&title=Curlew+in+the+Sunset">View</a>
        </div>
      </div>
    `;

    const [entry] = parseSubgalleryEntries(
      html,
      "https://geekofalltrades.org/photos/2026/09/03/",
    );

    expect(entry.title).toBe("Curlew in the Sunset");
    expect(entry.description).toBe("iPhone 14 Pro Max, 2026-09-03");
    expect(entry.imgSrc).toBe(
      "https://geekofalltrades.org/photos/2026/09/03/IMG_3332-thumb.jpeg",
    );
    expect(entry.imgAlt).toBe("A curlew wading");
    expect(entry.fullImageSrc).toBe(
      "https://geekofalltrades.org/photos/2026/09/03/IMG_3332.jpeg",
    );
    expect(entry.coverTitle).toBe("Curlew in the Sunset");
  });

  // Regression test for the real bug: a subgallery link without a trailing
  // slash used to make the browser treat the last path segment as a
  // filename and drop it when resolving relative image paths.
  it("resolves image paths correctly even when baseUrl is missing its trailing slash", () => {
    const html = `
      <div class="gallery">
        <div class="item">
          <p class="title">Test</p>
          <img src="06/20/IMG_1763-thumb.jpeg" alt="">
          <p class="description"></p>
        </div>
      </div>
    `;

    const [entry] = parseSubgalleryEntries(
      html,
      "https://geekofalltrades.org/photos/2026",
    );

    expect(entry.imgSrc).toBe(
      "https://geekofalltrades.org/photos/2026/06/20/IMG_1763-thumb.jpeg",
    );
  });

  it("preserves inline markup like span.maybe within the title", () => {
    const html = `
      <div class="gallery">
        <div class="item">
          <p class="title">Untitled <span class="maybe">(Maybe: Bee)</span></p>
          <img src="IMG_3394-thumb.jpeg" alt="">
          <p class="description"></p>
        </div>
      </div>
    `;

    const [entry] = parseSubgalleryEntries(
      html,
      "https://geekofalltrades.org/photos/2026/09/04/",
    );

    expect(entry.title).toBe(
      'Untitled <span class="maybe">(Maybe: Bee)</span>',
    );
  });

  it("parses multiple items in document order", () => {
    const html = `
      <div class="gallery">
        <div class="item"><p class="title">First</p><img src="a.jpeg" alt=""></div>
        <div class="item"><p class="title">Second</p><img src="b.jpeg" alt=""></div>
      </div>
    `;

    const entries = parseSubgalleryEntries(
      html,
      "https://geekofalltrades.org/photos/2026/09/",
    );

    expect(entries.map((entry) => entry.title)).toEqual(["First", "Second"]);
  });

  it("falls back to empty strings for missing elements instead of throwing", () => {
    const html = `
      <div class="gallery">
        <div class="item"></div>
      </div>
    `;

    const [entry] = parseSubgalleryEntries(
      html,
      "https://geekofalltrades.org/photos/2026/09/",
    );

    expect(entry.title).toBe("");
    expect(entry.description).toBe("");
    expect(entry.imgSrc).toBe("");
    expect(entry.imgAlt).toBe("");
    expect(entry.fullImageSrc).toBe("");
    expect(entry.coverTitle).toBe("");
  });
});

describe("findSubgalleryLink", () => {
  it("prefers the .more link when the item has one", () => {
    const item = createItemFixture(`
      <div class="item">
        <p class="more"><a href="/photos/2026/09/04">7 more</a></p>
        <a class="cover" href="?display=a.jpeg&title=Test">View</a>
      </div>
    `);

    const link = findSubgalleryLink(item);

    expect(link?.pathname).toBe("/photos/2026/09/04");
  });

  it("falls back to the cover link when it leads to a different page", () => {
    const item = createItemFixture(`
      <div class="item">
        <a class="cover" href="/photos/2026/02/">View more</a>
      </div>
    `);

    const link = findSubgalleryLink(item);

    expect(link?.pathname).toBe("/photos/2026/02/");
  });

  it("ignores a cover link that is just a same-page lightbox reference", () => {
    const item = createItemFixture(`
      <div class="item">
        <a class="cover" href="?display=2026/02/14/IMG_6845.jpeg&title=Flowering+Maple">View</a>
      </div>
    `);

    const link = findSubgalleryLink(item);

    expect(link).toBeNull();
  });

  it("returns null when the item has neither link", () => {
    const item = createItemFixture(
      `<div class="item"><p class="title">No links here</p></div>`,
    );

    expect(findSubgalleryLink(item)).toBeNull();
  });
});
