import { describe, it, expect, beforeEach, vi } from "vitest";
import { hydrateExternalLinks } from "./hydrateExternalLinks";
describe("hydrateExternalLinks", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        vi.restoreAllMocks();
    });
    it("does nothing if there are no external links", () => {
        document.body.innerHTML = `
      <a href="/internal">Internal</a>
    `;
        hydrateExternalLinks();
        const link = document.querySelector("a");
        expect(link.title).toBe("");
    });
    it("adds title and click handler to rel='external' links", () => {
        document.body.innerHTML = `
      <a href="https://example.com" rel="external">External</a>
    `;
        const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
        hydrateExternalLinks();
        const link = document.querySelector("a");
        expect(link.title).toBe("Opens in a new window");
        link.click();
        expect(openSpy).toHaveBeenCalledTimes(1);
        expect(openSpy).toHaveBeenCalledWith(link.href, "_blank");
    });
    it("adds title and click handler to absolute external URLs", () => {
        document.body.innerHTML = `
      <a href="https://external-site.test/page">External</a>
    `;
        const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
        hydrateExternalLinks();
        const link = document.querySelector("a");
        expect(link.title).toBe("Opens in a new window");
        link.click();
        expect(openSpy).toHaveBeenCalledWith("https://external-site.test/page", "_blank");
    });
    it("does not intercept links to the current hostname", () => {
        const sameHostUrl = `http://${location.hostname}/page`;
        document.body.innerHTML = `
      <a href="${sameHostUrl}">Same host</a>
    `;
        const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
        hydrateExternalLinks();
        const link = document.querySelector("a");
        link.click();
        expect(openSpy).not.toHaveBeenCalled();
        expect(link.title).toBe("");
    });
});
//# sourceMappingURL=hydrateExternalLinks.test.js.map