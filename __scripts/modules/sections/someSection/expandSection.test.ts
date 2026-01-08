import { describe, it, expect, beforeEach, vi } from "vitest";
import { expandSection } from "./expandSection";

// Mock dependencies
vi.mock("../../effects/effects", () => ({
  fadeIn: vi.fn(),
  getDuration: vi.fn(),
}));

vi.mock("../allSections/toggleButtons/toggleToggleButtons", () => ({
  toggleToggleButtons: vi.fn(),
}));

import { fadeIn, getDuration } from "../../effects/effects";
import { toggleToggleButtons } from "../allSections/toggleButtons/toggleToggleButtons";

describe("expandSection", () => {
  let outerSection: HTMLElement;
  let innerSection: HTMLElement;
  let outerHeading: HTMLElement;
  let innerHeading: HTMLElement;
  let outerContent: HTMLElement;
  let innerContent: HTMLElement;
  let trigger: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();

    document.body.innerHTML = "";

    outerSection = document.createElement("section");
    outerSection.className = "toggleable collapsed";

    outerHeading = document.createElement("h2");
    outerHeading.textContent = "Outer";

    outerContent = document.createElement("div");
    outerContent.textContent = "Outer content";

    innerSection = document.createElement("section");
    innerSection.className = "toggleable collapsed";

    innerHeading = document.createElement("h3");
    innerHeading.textContent = "Inner";

    innerContent = document.createElement("div");
    innerContent.textContent = "Inner content";

    trigger = document.createElement("button");

    innerSection.append(innerHeading, innerContent, trigger);
    outerSection.append(outerHeading, outerContent, innerSection);
    document.body.appendChild(outerSection);

    // Mock layout heights
    Object.defineProperty(innerSection, "offsetHeight", {
      value: 150,
      configurable: true,
    });

    Object.defineProperty(outerSection, "offsetHeight", {
      value: 300,
      configurable: true,
    });

    (getDuration as any).mockReturnValue(200);
  });

  it("does nothing if element is not inside a section", () => {
    const orphan = document.createElement("div");

    expandSection(orphan);

    expect(fadeIn).not.toHaveBeenCalled();
    expect(toggleToggleButtons).not.toHaveBeenCalled();
  });

  it("removes collapsed class from the section and its toggleable ancestors", () => {
    expandSection(trigger);

    expect(innerSection.classList.contains("collapsed")).toBe(false);
    expect(outerSection.classList.contains("collapsed")).toBe(false);
  });

  it("updates heading title and aria-expanded on expanded sections", () => {
    expandSection(trigger);

    expect(innerHeading.title).toBe("Collapse section");
    expect(innerHeading.ariaExpanded).toBe("true");

    expect(outerHeading.title).toBe("Collapse section");
    expect(outerHeading.ariaExpanded).toBe("true");
  });

  it("sets min-height to 0px before expansion and then to inherent height", () => {
    expandSection(trigger);

    expect(innerSection.style.minHeight).toBe("150px");
    expect(outerSection.style.minHeight).toBe("300px");
  });

  it("fades in non-heading, non-description children after duration", () => {
    expandSection(trigger);

    vi.advanceTimersByTime(200);

    expect(fadeIn).toHaveBeenCalledTimes(4);

    expect(fadeIn).toHaveBeenCalledWith(outerContent, 200);
    expect(fadeIn).toHaveBeenCalledWith(innerSection, 200);
    expect(fadeIn).toHaveBeenCalledWith(innerContent, 200);
    expect(fadeIn).toHaveBeenCalledWith(trigger, 200);

    expect(fadeIn).not.toHaveBeenCalledWith(innerHeading, expect.anything());
    expect(fadeIn).not.toHaveBeenCalledWith(outerHeading, expect.anything());
  });

  it("restores child display styles after measuring height", () => {
    innerContent.style.display = "inline-block";

    expandSection(trigger);

    expect(innerContent.style.display).toBe("inline-block");
    expect(
      innerContent.hasAttribute("data-collapsed-display-value")
    ).toBe(false);
  });

  it("toggles toggle buttons after expansion completes", () => {
    expandSection(trigger);

    vi.advanceTimersByTime(200);

    expect(toggleToggleButtons).toHaveBeenCalledTimes(2);
  });
});
