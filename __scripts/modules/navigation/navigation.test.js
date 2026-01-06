import { describe, it, expect, vi, beforeEach } from "vitest";
import { hydrateNavigation } from "./navigation";
vi.mock("./hydration/hydrateBreadcrumbs", () => ({
    hydrateBreadcrumbs: vi.fn(),
}));
vi.mock("./hydration/hydrateDropdowns", () => ({
    hydrateDropdowns: vi.fn(),
}));
vi.mock("../flexBalance/flexBalance", () => ({
    enableFlexBalancing: vi.fn(),
}));
vi.mock("./highlightCurrent", () => ({
    highlightCurrent: vi.fn(),
}));
vi.mock("./hydration/hydrateH1", () => ({
    hydrateH1: vi.fn(),
}));
import { hydrateBreadcrumbs } from "./hydration/hydrateBreadcrumbs";
import { hydrateDropdowns } from "./hydration/hydrateDropdowns";
import { enableFlexBalancing } from "../flexBalance/flexBalance";
import { highlightCurrent } from "./highlightCurrent";
import { hydrateH1 } from "./hydration/hydrateH1";
describe("hydrateNavigation", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it("runs all hydration functions on DOMContentLoaded", () => {
        hydrateNavigation();
        // Nothing yet
        expect(enableFlexBalancing).not.toHaveBeenCalled();
        expect(highlightCurrent).not.toHaveBeenCalled();
        expect(hydrateH1).not.toHaveBeenCalled();
        expect(hydrateBreadcrumbs).not.toHaveBeenCalled();
        expect(hydrateDropdowns).not.toHaveBeenCalled();
        document.dispatchEvent(new Event("DOMContentLoaded"));
        expect(enableFlexBalancing).toHaveBeenCalledWith("nav > ul");
        expect(highlightCurrent).toHaveBeenCalled();
        expect(hydrateH1).toHaveBeenCalled();
        expect(hydrateBreadcrumbs).toHaveBeenCalled();
        expect(hydrateDropdowns).toHaveBeenCalled();
    });
});
//# sourceMappingURL=navigation.test.js.map