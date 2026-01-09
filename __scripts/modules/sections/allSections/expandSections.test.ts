import { describe, it, expect, beforeEach, vi, type MockedFunction } from "vitest";
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
  let sectionA: HTMLElement;
  let sectionB: HTMLElement;
  let headingA: HTMLElement;
  let headingB: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
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

    (getDuration as MockedFunction<typeof getDuration>).mockReturnValue(200);
  });

  it("expands all sections when no id is provided", () => {
    expandSections();

    expect(expandSection).toHaveBeenCalledTimes(2);
    expect(expandSection).toHaveBeenCalledWith(headingA);
    expect(expandSection).toHaveBeenCalledWith(headingB);
  });

  it("only expands sections containing the anchor when id is provided", () => {
    expandSections("a");

    const expandSectionMock = (expandSection as MockedFunction<typeof expandSection>).mock.calls;

    expect(expandSectionMock).toHaveLength(1);
    expect(expandSectionMock[0][0]).toBe(headingA);
    expect(expandSectionMock.some(([arg]) => arg === headingB)).toBe(false);
  });

  it("scrolls to the anchor after duration", () => {
    (sectionA as HTMLElement).scrollIntoView = vi.fn();
    const scrollSpy = vi.spyOn(sectionA, "scrollIntoView");

    expandSections("a");
    vi.advanceTimersByTime(200);

    expect(location.hash).toBe("#a");
    expect(scrollSpy).toHaveBeenCalledWith({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  });
});
