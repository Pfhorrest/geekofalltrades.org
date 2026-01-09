import { describe, it, expect, beforeEach, vi } from "vitest";
import { hydrateSections } from "./sections";

vi.mock("./allSections/toggleButtons/hydrateToggleButtons", () => ({
  hydrateToggleButtons: vi.fn(),
}));

vi.mock("./allSections/allSections", () => ({
  expandAnchorSectionCollapseOthers: vi.fn(),
}));

vi.mock("./allSections/toggleButtons/toggleToggleButtons", () => ({
  toggleToggleButtons: vi.fn(),
}));

vi.mock("./figures", () => ({
  alternateFigures: vi.fn(),
}));

vi.mock("../flexBalance/flexBalance", () => ({
  enableFlexBalancing: vi.fn(),
}));

import { hydrateToggleButtons } from "./allSections/toggleButtons/hydrateToggleButtons";
import { expandAnchorSectionCollapseOthers } from "./allSections/allSections";
import { toggleToggleButtons } from "./allSections/toggleButtons/toggleToggleButtons";
import { alternateFigures } from "./figures";
import { enableFlexBalancing } from "../flexBalance/flexBalance";

describe("hydrateSections", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
  });

  it("runs hydration on DOMContentLoaded", () => {
    hydrateSections();

    document.dispatchEvent(new Event("DOMContentLoaded"));

    expect(enableFlexBalancing).toHaveBeenCalledWith(".gallery");
    expect(hydrateToggleButtons).toHaveBeenCalledOnce();
    expect(expandAnchorSectionCollapseOthers).toHaveBeenCalledOnce();
    expect(alternateFigures).toHaveBeenCalledOnce();
  });

  it("updates toggle buttons on hashchange", () => {
    hydrateSections();

    window.dispatchEvent(new HashChangeEvent("hashchange"));

    // Twice: once for DOMContentLoaded and once for hashchange
    expect(toggleToggleButtons).toHaveBeenCalledTimes(2);
  });
});
