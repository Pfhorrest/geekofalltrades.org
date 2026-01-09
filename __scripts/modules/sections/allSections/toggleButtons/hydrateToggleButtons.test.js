import { describe, it, expect, beforeEach, vi } from "vitest";
import { hydrateToggleButtons } from "./hydrateToggleButtons";
import { expandSections, collapseSections, expandAnchorSectionCollapseOthers, } from "../allSections";
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
        location.hash = "";
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
    it("sets anchor control text to location.hash", () => {
        location.hash = "#my-section";
        document.body.innerHTML = `
      <main>
        <section id="my-section"><h2>Test</h2></section>
      </main>
    `;
        hydrateToggleButtons();
        document.querySelectorAll(".anchorTarget").forEach((el) => {
            expect(el.textContent).toBe("Test");
        });
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
});
//# sourceMappingURL=hydrateToggleButtons.test.js.map