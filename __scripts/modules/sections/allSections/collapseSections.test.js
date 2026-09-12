var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, vi, } from "vitest";
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
HTMLElement.prototype.scrollIntoView = vi.fn().mockResolvedValue(undefined);
describe("collapseSections", () => {
    let sectionA;
    let sectionB;
    let headingA;
    let headingB;
    beforeEach(() => {
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
    it("scrolls to the anchor after duration", () => __awaiter(void 0, void 0, void 0, function* () {
        sectionA.scrollIntoView = vi.fn();
        const scrollSpy = vi.spyOn(sectionA, "scrollIntoView");
        const execution = collapseSections("a");
        yield execution;
        expect(location.hash).toBe("#a");
        expect(scrollSpy).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }));
});
//# sourceMappingURL=collapseSections.test.js.map