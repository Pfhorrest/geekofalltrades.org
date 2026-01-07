import { describe, it, expect, beforeEach, vi } from "vitest";
import { collapseSection } from "./collapseSection";
// Mock dependencies
vi.mock("../../effects/effects", () => ({
    fadeOut: vi.fn(),
    getDuration: vi.fn(),
}));
vi.mock("../allSections/toggleButtons/toggleToggleButtons", () => ({
    toggleToggleButtons: vi.fn(),
}));
import { fadeOut, getDuration } from "../../effects/effects";
import { toggleToggleButtons } from "../allSections/toggleButtons/toggleToggleButtons";
describe("collapseSection", () => {
    let section;
    let heading;
    let description;
    let content1;
    let content2;
    let trigger;
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        document.body.innerHTML = "";
        section = document.createElement("section");
        heading = document.createElement("h2");
        heading.textContent = "Section heading";
        description = document.createElement("div");
        description.className = "description";
        content1 = document.createElement("p");
        content2 = document.createElement("div");
        trigger = document.createElement("button");
        section.append(heading, description, content1, content2, trigger);
        document.body.appendChild(section);
        // Mock layout height
        Object.defineProperty(section, "offsetHeight", {
            value: 300,
            configurable: true,
        });
        getDuration.mockReturnValue(200);
    });
    it("does nothing if element is not inside a section", () => {
        const orphan = document.createElement("div");
        collapseSection(orphan);
        expect(fadeOut).not.toHaveBeenCalled();
        expect(toggleToggleButtons).not.toHaveBeenCalled();
    });
    it("marks the section as collapsed and updates trigger attributes", () => {
        collapseSection(trigger);
        expect(section.classList.contains("collapsed")).toBe(true);
        expect(trigger.title).toBe("Expand section");
        expect(trigger.ariaExpanded).toBe("false");
    });
    it("sets section min-height to its current height before collapsing", () => {
        collapseSection(trigger);
        expect(section.style.minHeight).toBe("300px");
    });
    it("fades out non-heading, non-description children", () => {
        collapseSection(trigger);
        expect(fadeOut).toHaveBeenCalledTimes(3);
        expect(fadeOut).toHaveBeenCalledWith(content1, 200);
        expect(fadeOut).toHaveBeenCalledWith(content2, 200);
        expect(fadeOut).toHaveBeenCalledWith(trigger, 200);
        expect(fadeOut).not.toHaveBeenCalledWith(heading, expect.anything());
        expect(fadeOut).not.toHaveBeenCalledWith(description, expect.anything());
    });
    it("collapses section min-height after duration", () => {
        collapseSection(trigger);
        vi.advanceTimersByTime(200);
        expect(section.style.minHeight).toBe("0px");
    });
    it("removes min-height property after collapse completes", () => {
        collapseSection(trigger);
        vi.advanceTimersByTime(200); // collapse
        vi.advanceTimersByTime(200); // cleanup
        expect(section.style.minHeight).toBe("");
    });
    it("toggles toggle buttons after collapsing", () => {
        collapseSection(trigger);
        vi.advanceTimersByTime(200);
        expect(toggleToggleButtons).toHaveBeenCalledOnce();
    });
});
//# sourceMappingURL=collapseSection.test.js.map