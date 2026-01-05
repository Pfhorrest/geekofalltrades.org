import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { slideDown } from "./slideDown";

function mockExpandableHeight(
  el: HTMLElement,
  expandedHeight = 100
): void {
  Object.defineProperty(el, "offsetHeight", {
    configurable: true,
    get() {
      return el.style.display === "none" ? 0 : expandedHeight;
    },
  });
}

describe("slideDown", () => {
  let el: HTMLElement;

  beforeEach(() => {
    document.body.innerHTML = "";
    el = document.createElement("div");
    document.body.appendChild(el);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does nothing if element is already fully expanded", () => {
    mockExpandableHeight(el, 100);

    slideDown(el, 200);

    expect(el.style.height).toBe("");
    expect(el.style.transition).toBe("");
    expect(el.style.overflow).toBe("");
  });

  it("expands a collapsed element", () => {
    el.style.display = "none";
    mockExpandableHeight(el, 100);

    slideDown(el, 300);

    expect(el.style.overflow).toBe("hidden");
    expect(el.style.transition).toContain("300ms");
    expect(el.style.height).toBe("100px");
    expect(el.style.display).not.toBe("none");
  });

  it("cleans up styles on transitionend", () => {
    mockExpandableHeight(el, 100);

    slideDown(el, 150);

    el.dispatchEvent(new Event("transitionend"));

    expect(el.style.height).toBe("");
    expect(el.style.paddingTop).toBe("");
    expect(el.style.paddingBottom).toBe("");
    expect(el.style.rowGap).toBe("");
    expect(el.style.transition).toBe("");
    expect(el.style.overflow).toBe("");
  });

  it("cleans up styles via fallback timeout", () => {
    mockExpandableHeight(el, 100);

    slideDown(el, 200);

    vi.advanceTimersByTime(216);

    expect(el.style.height).toBe("");
    expect(el.style.transition).toBe("");
    expect(el.style.overflow).toBe("");
  });
});
