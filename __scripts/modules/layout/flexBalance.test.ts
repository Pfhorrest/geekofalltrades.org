import { describe, it, expect, beforeEach, vi, type MockedFunction } from "vitest";
import { enableFlexBalancing } from "./flexBalance";

describe("enableFlexBalancing", () => {
  let container: HTMLElement;
  let items: HTMLElement[];

  beforeEach(() => {
    document.body.innerHTML = "";

    container = document.createElement("div");
    container.className = "balanced-flex";

    items = Array.from({ length: 6 }, () => {
      const el = document.createElement("div");
      container.appendChild(el);
      return el;
    });

    document.body.appendChild(container);

    // Mock layout metrics
    Object.defineProperty(container, "clientWidth", {
      value: 400,
      configurable: true,
    });

    items.forEach((item) => {
      Object.defineProperty(item, "offsetWidth", {
        value: 100,
        configurable: true,
      });
    });

    const g = (globalThis as any);
    g.resizeSpy = vi.fn();
    g.mutationSpy = vi.fn();

    type ObserverInstance = {
      observe: ReturnType<typeof vi.fn>;
    };

    g.ResizeObserver = vi.fn(function (
      this: ObserverInstance,
      cb: ResizeObserverCallback
    ) {
      g.resizeSpy();
      this.observe = vi.fn();
    });

    g.MutationObserver = vi.fn(function (
      this: ObserverInstance,
      cb: MutationCallback
    ) {
      g.mutationSpy();
      this.observe = vi.fn();
    });
  });

  it("does nothing when fewer than two items exist", () => {
    container.innerHTML = "";
    container.appendChild(document.createElement("div"));

    enableFlexBalancing(".balanced-flex");

    expect((container.children[0] as HTMLElement).style.minWidth).toBe("");
  });

  it("clears existing min-width before balancing", () => {
    items.forEach((item) => {
      item.style.minWidth = "50%";
    });

    enableFlexBalancing(".balanced-flex");

    items.forEach((item) => {
      expect(item.style.minWidth).not.toBe("50%");
    });
  });

  it("applies balanced min-width percentages", () => {
    enableFlexBalancing(".balanced-flex");

    // avgItemWidth = 100
    // rowCount ≈ round((100 * 6) / 400) = round(1.5) = 2
    // perRow = ceil(6 / 2) + 0.5 = 3.5
    // minWidth = 100 / 3.5 = 28.5714285714%

    items.forEach((item) => {
      expect(parseFloat(item.style.minWidth)).toBeLessThan(33.34); // 100 / 3
      expect(parseFloat(item.style.minWidth)).toBeGreaterThan(25); // 100 / 4
      expect(item.style.minWidth).toContain("%");
    });
  });

  it("attaches ResizeObserver and MutationObserver", () => {
    enableFlexBalancing(".balanced-flex");

    expect((globalThis as any).resizeSpy).toHaveBeenCalledOnce();
    expect((ResizeObserver as MockedFunction<typeof ResizeObserver>).mock.instances[0].observe).toHaveBeenCalled();
    expect((globalThis as any).mutationSpy).toHaveBeenCalledOnce();
    expect((MutationObserver as MockedFunction<typeof MutationObserver>).mock.instances[0].observe).toHaveBeenCalled();
  });
});
