import { describe, it, expect, vi, beforeEach } from "vitest";
import { getPreference } from "./getPreference";

describe("getPreference", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("returns value from localStorage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockReturnValue("dark");

    expect(getPreference("color-scheme")).toBe("dark");
  });

  it("returns null and warns on error", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("nope");
    });

    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});

    expect(getPreference("color-scheme")).toBeNull();
    expect(warn).toHaveBeenCalled();
  });
});
