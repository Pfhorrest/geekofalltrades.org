import { describe, it, expect, beforeEach, vi } from "vitest";
import { toggleSection } from "./someSection";
// Mock dependencies
vi.mock("./collapseSection", () => ({
    collapseSection: vi.fn(),
}));
vi.mock("./expandSection", () => ({
    expandSection: vi.fn(),
}));
import { collapseSection } from "./collapseSection";
import { expandSection } from "./expandSection";
describe("toggleSection", () => {
    let section;
    let heading;
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = "";
        section = document.createElement("section");
        section.id = "test-section";
        heading = document.createElement("h2");
        heading.textContent = "Heading";
        section.appendChild(heading);
        document.body.appendChild(section);
        // Reset hash safely
        location.hash = "";
    });
    it("expands the section if it is collapsed", () => {
        section.classList.add("collapsed");
        toggleSection(heading);
        expect(expandSection).toHaveBeenCalledOnce();
        expect(expandSection).toHaveBeenCalledWith(heading);
        expect(collapseSection).not.toHaveBeenCalled();
    });
    it("collapses the section if it is not collapsed", () => {
        toggleSection(heading);
        expect(collapseSection).toHaveBeenCalledOnce();
        expect(collapseSection).toHaveBeenCalledWith(heading);
        expect(expandSection).not.toHaveBeenCalled();
    });
    it("sets location.hash to the section id", () => {
        toggleSection(heading);
        expect(location.hash).toBe("#test-section");
    });
    it("clears location.hash if the section has no id", () => {
        section.removeAttribute("id");
        toggleSection(heading);
        expect(location.hash).toBe("");
    });
    it("does nothing gracefully if element is not inside a section", () => {
        const orphan = document.createElement("h2");
        toggleSection(orphan);
        expect(expandSection).not.toHaveBeenCalled();
        expect(collapseSection).not.toHaveBeenCalled();
        expect(location.hash).toBe("");
    });
});
//# sourceMappingURL=someSection.test.js.map