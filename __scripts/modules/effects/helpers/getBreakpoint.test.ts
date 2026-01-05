import { describe, it, expect, beforeEach } from "vitest";
import { getBreakpoint } from "./getBreakpoint";

describe("getBreakpoint", () => {
  beforeEach(() => {
    // Reset styles before each test
    document.documentElement.style.cssText = "";
  });

  it("uses breakpoint 2 by default", () => {
    document.documentElement.style.setProperty("--bp2", "40");
    document.documentElement.style.fontSize = "16px";

    const result = getBreakpoint();

    expect(result).toBe(640); // 40 * 16
  });

  it("uses the specified breakpoint number", () => {
    document.documentElement.style.setProperty("--bp3", "60");
    document.documentElement.style.fontSize = "10px";

    const result = getBreakpoint(3);

    expect(result).toBe(600); // 60 * 10
  });

  it("returns NaN if the breakpoint variable is missing", () => {
    document.documentElement.style.fontSize = "16px";

    const result = getBreakpoint(4);

    expect(Number.isNaN(result)).toBe(true);
  });

  it("returns NaN if font size is missing", () => {
    document.documentElement.style.setProperty("--bp1", "30");

    const result = getBreakpoint(1);

    expect(Number.isNaN(result)).toBe(true);
  });
});
