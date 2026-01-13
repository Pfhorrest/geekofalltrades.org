import { describe, it, expect, vi, beforeEach } from "vitest";
import { deletePreference } from "./deletePreference";
describe("deletePreference", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });
    it("removes value from localStorage", () => {
        const spy = vi.spyOn(Storage.prototype, "removeItem");
        deletePreference("theme");
        expect(spy).toHaveBeenCalledWith("theme");
    });
    it("warns on failure", () => {
        vi.spyOn(Storage.prototype, "removeItem").mockImplementation(() => {
            throw new Error("nope");
        });
        const warn = vi.spyOn(console, "warn").mockImplementation(() => { });
        deletePreference("theme");
        expect(warn).toHaveBeenCalled();
    });
});
//# sourceMappingURL=deletePreference.test.js.map