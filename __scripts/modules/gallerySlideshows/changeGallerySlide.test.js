import { describe, expect, it } from "vitest";
import { encodeCoverQueryValue, findItemElements } from "./changeGallerySlide";
function createItemFixture(html) {
    const container = document.createElement("div");
    container.innerHTML = html;
    return container.firstElementChild;
}
describe("findItemElements", () => {
    it("includes title, description, and cover when the item has a .more link", () => {
        const item = createItemFixture(`
      <div class="item">
        <p class="title">Title</p>
        <img src="a.jpeg" alt="">
        <p class="description">Desc</p>
        <p class="more"><a href="/photos/2026/09/04">7 more</a></p>
        <a class="cover" href="?display=a.jpeg&title=Title">View</a>
      </div>
    `);
        const { img, title, description, cover } = findItemElements(item);
        expect(img).not.toBeNull();
        expect(title).not.toBeNull();
        expect(description).not.toBeNull();
        expect(cover).not.toBeNull();
    });
    it("excludes title, description, and cover when the item has no .more link", () => {
        const item = createItemFixture(`
      <div class="item">
        <p class="title">Title</p>
        <img src="a.jpeg" alt="">
        <p class="description">Desc</p>
        <a class="cover" href="/photos/2026/02/">View more</a>
      </div>
    `);
        const { img, title, description, cover } = findItemElements(item);
        // The image always cycles; title/description/cover don't, since this
        // item is being cycled *via* its cover link, which needs to keep
        // pointing at the real subgallery page, not get overwritten.
        expect(img).not.toBeNull();
        expect(title).toBeNull();
        expect(description).toBeNull();
        expect(cover).toBeNull();
    });
    it("returns null for img when the item genuinely has none", () => {
        const item = createItemFixture(`<div class="item"><p class="title">No image</p></div>`);
        expect(findItemElements(item).img).toBeNull();
    });
});
describe("encodeCoverQueryValue", () => {
    it("encodes spaces as +", () => {
        expect(encodeCoverQueryValue("Taurus Mason Bee at Ventura Pier")).toBe("Taurus+Mason+Bee+at+Ventura+Pier");
    });
    it("leaves forward slashes unescaped", () => {
        expect(encodeCoverQueryValue("04/IMG_3394.jpeg")).toBe("04/IMG_3394.jpeg");
    });
    it("still escapes characters that would break a query string", () => {
        expect(encodeCoverQueryValue("Fish & Chips")).toBe("Fish+%26+Chips");
    });
});
//# sourceMappingURL=changeGallerySlide.test.js.map