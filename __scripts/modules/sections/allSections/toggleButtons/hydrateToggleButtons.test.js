import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { hydrateToggleButtons, cleanupToggleListener } from "./hydrateToggleButtons";
import { toggleToggleButtons } from "./toggleToggleButtons";
import { expandSections, collapseSections, expandAnchorSectionCollapseOthers, } from "../allSections";
// Mock the toggleToggleButtons module
vi.mock("./toggleToggleButtons", () => ({
    toggleToggleButtons: vi.fn(),
}));
// Mock the allSections module
vi.mock("../allSections", () => ({
    expandSections: vi.fn(),
    collapseSections: vi.fn(),
    expandAnchorSectionCollapseOthers: vi.fn(),
}));
describe("hydrateToggleButtons", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        vi.clearAllMocks();
    });
    afterEach(() => {
        cleanupToggleListener();
    });
    it("does nothing if there is no main element", () => {
        hydrateToggleButtons();
        expect(document.querySelector(".toggleAllControls")).toBeNull();
    });
    it("does nothing if main contains no sections", () => {
        document.body.innerHTML = `<main></main>`;
        hydrateToggleButtons();
        expect(document.querySelector(".toggleAllControls")).toBeNull();
    });
    it("creates toggle controls when a section exists", () => {
        document.body.innerHTML = `
      <main>
        <section><h2>Test</h2></section>
      </main>
    `;
        hydrateToggleButtons();
        const controls = document.querySelectorAll(".toggleAllControls");
        expect(controls).toHaveLength(2); // top + bottom
        expect(document.querySelectorAll(".expandAll")).toHaveLength(2);
        expect(document.querySelectorAll(".anchorTarget")).toHaveLength(2);
        expect(document.querySelectorAll(".collapseAll")).toHaveLength(2);
    });
    it("wires expandAll buttons to expandSections()", () => {
        document.body.innerHTML = `
      <main>
        <section><h2>Test</h2></section>
      </main>
    `;
        hydrateToggleButtons();
        const button = document.querySelector(".expandAll");
        button.click();
        expect(expandSections).toHaveBeenCalledTimes(1);
        expect(expandSections).toHaveBeenCalledWith();
    });
    it("wires anchorTarget buttons to expandAnchorSectionCollapseOthers()", () => {
        document.body.innerHTML = `
      <main>
        <section><h2>Test</h2></section>
      </main>
    `;
        hydrateToggleButtons();
        const button = document.querySelector(".anchorTarget");
        button.click();
        expect(expandAnchorSectionCollapseOthers).toHaveBeenCalledTimes(1);
    });
    it("wires collapseAll buttons to collapseSections()", () => {
        document.body.innerHTML = `
      <main>
        <section><h2>Test</h2></section>
      </main>
    `;
        hydrateToggleButtons();
        const button = document.querySelector(".collapseAll");
        button.click();
        expect(collapseSections).toHaveBeenCalledTimes(1);
        expect(collapseSections).toHaveBeenCalledWith();
    });
    it("toggles toggle buttons", () => {
        document.body.innerHTML = `
      <main>
        <section><h2>Test</h2></section>
      </main>
    `;
        hydrateToggleButtons();
        expect(toggleToggleButtons).toHaveBeenCalledOnce();
    });
    it("updates toggle buttons on hashchange", () => {
        document.body.innerHTML = `
      <main>
        <section><h2>Test</h2></section>
      </main>
    `;
        hydrateToggleButtons();
        expect(toggleToggleButtons).toHaveBeenCalledOnce();
        window.dispatchEvent(new HashChangeEvent("hashchange"));
        expect(toggleToggleButtons).toHaveBeenCalledTimes(2);
    });
});
//# sourceMappingURL=hydrateToggleButtons.test.js.map