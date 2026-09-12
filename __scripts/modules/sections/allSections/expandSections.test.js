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
import { expandSections } from "./expandSections";
// Mocks
vi.mock("../../effects/effects", () => ({
    getDuration: vi.fn(),
}));
vi.mock("../someSection/expandSection", () => ({
    expandSection: vi.fn(),
}));
import { getDuration } from "../../effects/effects";
import { expandSection } from "../someSection/expandSection";
describe("expandSections", () => {
    let sectionA;
    let sectionB;
    let headingA;
    let headingB;
    HTMLElement.prototype.scrollIntoView = vi.fn().mockResolvedValue(undefined);
    beforeEach(() => {
        vi.clearAllMocks();
        document.body.innerHTML = "";
        sectionA = document.createElement("section");
        sectionA.id = "a";
        headingA = document.createElement("h2");
        sectionA.appendChild(headingA);
        sectionB = document.createElement("section");
        sectionB.id = "b";
        headingB = document.createElement("h2");
        sectionB.appendChild(headingB);
        document.body.append(sectionA, sectionB);
        getDuration.mockReturnValue(200);
    });
    it("expands all sections when no id is provided", () => {
        expandSections();
        expect(expandSection).toHaveBeenCalledTimes(2);
        expect(expandSection).toHaveBeenCalledWith(headingA);
        expect(expandSection).toHaveBeenCalledWith(headingB);
    });
    it("only expands sections containing the anchor when id is provided", () => {
        expandSections("a");
        const expandSectionMock = expandSection.mock.calls;
        expect(expandSectionMock).toHaveLength(1);
        expect(expandSectionMock[0][0]).toBe(headingA);
        expect(expandSectionMock.some(([arg]) => arg === headingB)).toBe(false);
    });
    it("scrolls to the anchor after duration", () => __awaiter(void 0, void 0, void 0, function* () {
        sectionA.scrollIntoView = vi.fn();
        const scrollSpy = vi.spyOn(sectionA, "scrollIntoView");
        const execution = expandSections("a");
        yield execution;
        expect(location.hash).toBe("#a");
        expect(scrollSpy).toHaveBeenCalledWith({
            behavior: "smooth",
            block: "center",
            inline: "center",
        });
    }));
});
//# sourceMappingURL=expandSections.test.js.map