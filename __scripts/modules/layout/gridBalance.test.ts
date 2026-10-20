import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { enableGridBalancing } from "./gridBalance";

class MockResizeObserver {
  static instances: MockResizeObserver[] = [];
  callback: ResizeObserverCallback;
  observe = vi.fn();
  disconnect = vi.fn();
  unobserve = vi.fn();

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
    MockResizeObserver.instances.push(this);
  }
}

class MockMutationObserver {
  static instances: MockMutationObserver[] = [];
  callback: MutationCallback;
  observe = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);

  constructor(callback: MutationCallback) {
    this.callback = callback;
    MockMutationObserver.instances.push(this);
  }
}

const mockComputedStyle = (element: Element) => {
  if (element instanceof HTMLElement && element.dataset.gridRows) {
    return {
      gridTemplateRows: element.dataset.gridRows,
      getPropertyValue: () => "",
    };
  }

  return {
    gridTemplateRows: "none",
    getPropertyValue: (property: string) => {
      if (!(element instanceof HTMLElement)) return "";

      switch (property) {
        case "grid-row":
          return element.dataset.gridRow ?? "";
        case "grid-row-start":
          return element.dataset.gridRowStart ?? "auto";
        case "grid-row-end":
          return element.dataset.gridRowEnd ?? "auto";
        default:
          return "";
      }
    },
  };
};

const makeGrid = (itemCount: number, rowCount = 2): HTMLElement => {
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
    vi.spyOn(window, "getComputedStyle").mockImplementation(
      mockComputedStyle as typeof window.getComputedStyle,
    );

    vi.spyOn(console, "log").mockImplementation(() => {});
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
    const lastItem = grid.lastElementChild as HTMLElement;

    enableGridBalancing(".balanced-grid");

    expect(lastItem.style.gridColumnStart).toBe("2");
  });

  it("positions an incomplete last row using its remainder", () => {
    const grid = makeGrid(8, 3);
    const firstLastRowItem = grid.children[6] as HTMLElement;

    enableGridBalancing(".balanced-grid");

    // Two items in a three-column grid start at column 1.
    expect(firstLastRowItem.style.gridColumnStart).toBe("1");
  });

  it("does not offset the last row when the grid is evenly divisible", () => {
    const grid = makeGrid(6, 3);

    enableGridBalancing(".balanced-grid");

    expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
    expect((grid.children[4] as HTMLElement).style.gridColumnStart).toBe("");
  });

  it("clears previously assigned inline styles before balancing", () => {
    const grid = makeGrid(6, 3);
    grid.style.gridTemplateColumns = "repeat(99, 1fr)";

    for (const child of Array.from(grid.children) as HTMLElement[]) {
      child.style.gridColumnStart = "99";
    }

    enableGridBalancing(".balanced-grid");

    expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");

    for (const child of Array.from(grid.children) as HTMLElement[]) {
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
    expect(MockResizeObserver.instances[1].observe).toHaveBeenCalledWith(
      second,
    );

    expect(MockMutationObserver.instances[0].observe).toHaveBeenCalledWith(
      first,
      {
        childList: true,
        attributes: false,
        subtree: false,
      },
    );
  });

  it("rebalances when a resize is observed", () => {
    const grid = makeGrid(4);

    enableGridBalancing(".balanced-grid");
    expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");

    grid.appendChild(document.createElement("div"));
    grid.appendChild(document.createElement("div"));

    MockResizeObserver.instances[0].callback(
      [],
      MockResizeObserver.instances[0] as unknown as ResizeObserver,
    );

    expect(grid.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
  });

  it("rebalances when children are added", () => {
    const grid = makeGrid(4);

    enableGridBalancing(".balanced-grid");

    grid.appendChild(document.createElement("div"));

    MockMutationObserver.instances[0].callback(
      [],
      MockMutationObserver.instances[0] as unknown as MutationObserver,
    );

    expect(grid.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
  });

  it("accounts for items spanning multiple rows uniformly", () => {
    const grid = makeGrid(5, 4);

    for (const child of Array.from(grid.children) as HTMLElement[]) {
      child.dataset.gridRow = "1 / 3";
      child.dataset.gridRowStart = "1";
      child.dataset.gridRowEnd = "3";
    }

    enableGridBalancing(".balanced-grid");

    expect(grid.style.gridTemplateColumns).toBe("repeat(3, 1fr)");
  });

  it("handles a single item spanning multiple rows", () => {
    const grid = makeGrid(5, 4);
    const spanningItem = grid.children[0] as HTMLElement;

    spanningItem.dataset.gridRow = "1 / 3";
    spanningItem.dataset.gridRowStart = "1";
    spanningItem.dataset.gridRowEnd = "3";

    enableGridBalancing(".balanced-grid");

    expect(grid.style.gridTemplateColumns).toBe("repeat(2, 1fr)");
  });
});
