import { describe, it, expect, beforeEach, vi } from "vitest";
import { collapseSections } from "./collapseSections";
// Mocks
vi.mock("../../effects/effects", () => ({
    getDuration: vi.fn(),
}));
vi.mock("../someSection/collapseSection", () => ({
    collapseSection: vi.fn(),
}));
import { getDuration } from "../../effects/effects";
import { collapseSection } from "../someSection/collapseSection";
describe("collapseSections", () => {
    let sectionA;
    let sectionB;
    let headingA;
    let headingB;
    beforeEach(() => {
        vi.useFakeTimers();
        vi.clearAllMocks();
        document.body.innerHTML = "";
        sectionA = document.createElement("section");
        sectionA.id = "a";
        headingA = document.createElement("h2");
        headingA.textContent = "A";
        sectionA.appendChild(headingA);
        sectionB = document.createElement("section");
        sectionB.id = "b";
        headingB = document.createElement("h2");
        headingB.textContent = "B";
        sectionB.appendChild(headingB);
        document.body.append(sectionA, sectionB);
        getDuration.mockReturnValue(200);
    });
    it("collapses all sections when no id is provided", () => {
        collapseSections();
        expect(collapseSection).toHaveBeenCalledTimes(2);
        expect(collapseSection).toHaveBeenCalledWith(headingA);
        expect(collapseSection).toHaveBeenCalledWith(headingB);
    });
    it("does not collapse the section containing the anchor", () => {
        collapseSections("a");
        expect(collapseSection).toHaveBeenCalledTimes(1);
        expect(collapseSection).toHaveBeenCalledWith(headingB);
        expect(collapseSection).not.toHaveBeenCalledWith(headingA);
    });
    it("scrolls to the anchor after duration", () => {
        sectionA.scrollIntoView = vi.fn();
        const scrollSpy = vi.spyOn(sectionA, "scrollIntoView");
        collapseSections("a");
        vi.advanceTimersByTime(200);
        expect(location.hash).toBe("#a");
        expect(scrollSpy).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    });
});
//# sourceMappingURL=collapseSections.test.js.map