import { describe, it, expect, beforeEach, vi } from "vitest";
import { expandAnchorSectionCollapseOthers } from "./allSections";

// Mocks
vi.mock("./collapseSections", () => ({
  collapseSections: vi.fn(),
}));

vi.mock("./expandSections", () => ({
  expandSections: vi.fn(),
}));

vi.mock("../allSections/toggleButtons/toggleToggleButtons", () => ({
  toggleToggleButtons: vi.fn(),
}));

import { collapseSections } from "./collapseSections";
import { expandSections } from "./expandSections";
import { toggleToggleButtons } from "../allSections/toggleButtons/toggleToggleButtons";

describe("expandAnchorSectionCollapseOthers", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
    location.hash = "";
  });

  it("expands and collapses sections when an anchor exists", () => {
    const section = document.createElement("section");
    section.id = "target";
    document.body.appendChild(section);

    location.hash = "#target";

    expandAnchorSectionCollapseOthers();

    expect(collapseSections).toHaveBeenCalledWith("target");
    expect(expandSections).toHaveBeenCalledWith("target");
    expect(toggleToggleButtons).not.toHaveBeenCalled();
  });

  it("only toggles buttons when no anchor exists", () => {
    expandAnchorSectionCollapseOthers();

    expect(collapseSections).not.toHaveBeenCalled();
    expect(expandSections).not.toHaveBeenCalled();
    expect(toggleToggleButtons).toHaveBeenCalledOnce();
  });
});
