import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { enableGridBalancing } from "./gridBalance";
class MockResizeObserver {
    constructor(callback) {
        this.observe = vi.fn();
        this.disconnect = vi.fn();
        this.unobserve = vi.fn();
        this.callback = callback;
        MockResizeObserver.instances.push(this);
    }
}
MockResizeObserver.instances = [];
class MockMutationObserver {
    constructor(callback) {
        this.observe = vi.fn();
        this.disconnect = vi.fn();
        this.takeRecords = vi.fn(() => []);
        this.callback = callback;
        MockMutationObserver.instances.push(this);
    }
}
MockMutationObserver.instances = [];
const mockComputedStyle = (element) => {
    if (element instanceof HTMLElement && element.dataset.gridRows) {
        return {
            gridTemplateRows: element.dataset.gridRows,
            getPropertyValue: () => "",
        };
    }
    return {
        gridTemplateRows: "none",
        getPropertyValue: (property) => {
            var _a, _b, _c;
            if (!(element instanceof HTMLElement))
                return "";
            switch (property) {
                case "grid-row":
                    return (_a = element.dataset.gridRow) !== null && _a !== void 0 ? _a : "";
                case "grid-row-start":
                    return (_b = element.dataset.gridRowStart) !== null && _b !== void 0 ? _b : "auto";
                case "grid-row-end":
                    return (_c = element.dataset.gridRowEnd) !== null && _c !== void 0 ? _c : "auto";
                default:
                    return "";
            }
        },
    };
};
const makeGrid = (itemCount, rowCount = 2) => {
    const container = document.createElement("div");
    container.className = "balanced-grid";
    container.dataset.gridRows = Array(rowCount).fill("100px").join(" ");
    for (let i = 0; i < itemCount; i++) {
        container.appendChild(document.createElement("div"));
    }
    document.body.appendChild(container);
    return container;
};
describe("enableGridBalancing", () => {
    beforeEach(() => {
        MockResizeObserver.instances = [];
        MockMutationObserver.instances = [];
        vi.stubGlobal("ResizeObserver", MockResizeObserver);
        vi.stubGlobal("MutationObserver", MockMutationObserver);
        vi.stubGlobal("getComputedStyle", mockComputedStyle);
        vi.spyOn(window, "getComputedStyle").mockImplementation(mockComputedStyle);
        vi.spyOn(console, "log").mockImplementation(() => { });
    });
    afterEach(() => {
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
        document.body.innerHTML = "";
    });
    it("uses the default .balanced-grid selector", () => {
        const grid = makeGrid(4);
        enableGridBalancing(".balanced-grid");
        expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
    });
    it("balances items across the available rows", () => {
        const grid = makeGrid(7, 3);
        enableGridBalancing(".balanced-grid");
        expect(grid.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
    });
    it("centers a single item in the last row", () => {
        const grid = makeGrid(7, 3);
        const lastItem = grid.lastElementChild;
        enableGridBalancing(".balanced-grid");
        expect(lastItem.style.gridColumnStart).toBe("2");
    });
    it("positions an incomplete last row using its remainder", () => {
        const grid = makeGrid(8, 3);
        const firstLastRowItem = grid.children[6];
        enableGridBalancing(".balanced-grid");
        // Two items in a three-column grid start at column 1.
        expect(firstLastRowItem.style.gridColumnStart).toBe("1");
    });
    it("does not offset the last row when the grid is evenly divisible", () => {
        const grid = makeGrid(6, 3);
        enableGridBalancing(".balanced-grid");
        expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
        expect(grid.children[4].style.gridColumnStart).toBe("");
    });
    it("clears previously assigned inline styles before balancing", () => {
        const grid = makeGrid(6, 3);
        grid.style.gridTemplateColumns = "repeat(99, 1fr)";
        for (const child of Array.from(grid.children)) {
            child.style.gridColumnStart = "99";
        }
        enableGridBalancing(".balanced-grid");
        expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
        for (const child of Array.from(grid.children)) {
            expect(child.style.gridColumnStart).toBe("");
        }
    });
    it("only balances elements matching the supplied selector", () => {
        const balanced = makeGrid(4);
        const other = makeGrid(4);
        other.className = "other-grid";
        enableGridBalancing(".other-grid");
        expect(other.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
        expect(balanced.style.gridTemplateColumns).toBe("");
    });
    it("observes each matching container for size and child changes", () => {
        const first = makeGrid(4);
        const second = makeGrid(6);
        enableGridBalancing(".balanced-grid");
        expect(MockResizeObserver.instances).toHaveLength(2);
        expect(MockMutationObserver.instances).toHaveLength(2);
        expect(MockResizeObserver.instances[0].observe).toHaveBeenCalledWith(first);
        expect(MockResizeObserver.instances[1].observe).toHaveBeenCalledWith(second);
        expect(MockMutationObserver.instances[0].observe).toHaveBeenCalledWith(first, {
            childList: true,
            attributes: false,
            subtree: false,
        });
    });
    it("rebalances when a resize is observed", () => {
        const grid = makeGrid(4);
        enableGridBalancing(".balanced-grid");
        expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
        grid.appendChild(document.createElement("div"));
        grid.appendChild(document.createElement("div"));
        MockResizeObserver.instances[0].callback([], MockResizeObserver.instances[0]);
        expect(grid.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
    });
    it("rebalances when children are added", () => {
        const grid = makeGrid(4);
        enableGridBalancing(".balanced-grid");
        grid.appendChild(document.createElement("div"));
        MockMutationObserver.instances[0].callback([], MockMutationObserver.instances[0]);
        expect(grid.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
    });
    it("accounts for items spanning multiple rows uniformly", () => {
        const grid = makeGrid(5, 4);
        for (const child of Array.from(grid.children)) {
            child.dataset.gridRow = "1 / 3";
            child.dataset.gridRowStart = "1";
            child.dataset.gridRowEnd = "3";
        }
        enableGridBalancing(".balanced-grid");
        expect(grid.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
    });
    it("handles a single item spanning multiple rows", () => {
        const grid = makeGrid(5, 4);
        const spanningItem = grid.children[0];
        spanningItem.dataset.gridRow = "1 / 3";
        spanningItem.dataset.gridRowStart = "1";
        spanningItem.dataset.gridRowEnd = "3";
        enableGridBalancing(".balanced-grid");
        expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
    });
});
//# sourceMappingURL=gridBalance.test.js.map