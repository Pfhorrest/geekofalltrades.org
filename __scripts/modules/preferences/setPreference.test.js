import { describe, it, expect, vi, beforeEach } from "vitest";
import { setPreference } from "./setPreference";
describe("setPreference", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    it("stores value in localStorage", () => {
        const spy = vi.spyOn(Storage.prototype, "setItem");
        setPreference("theme", "alien");
        expect(spy).toHaveBeenCalledWith("theme", "alien");
    });
    it("warns on failure", () => {
        vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
            throw new Error("nope");
        });
        const warn = vi.spyOn(console, "warn").mockImplementation(() => { });
        setPreference("theme", "alien");
        expect(warn).toHaveBeenCalled();
    });
});
//# sourceMappingURL=setPreference.test.js.map