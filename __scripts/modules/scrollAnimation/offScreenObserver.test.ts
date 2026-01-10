import { describe, it, expect, beforeEach, vi } from "vitest";

describe("offScreenObserver", () => {
  let observerCallback!: IntersectionObserverCallback;
  let observer!: IntersectionObserver;

  beforeEach(async () => {
    vi.resetModules();

    class MockIntersectionObserver implements IntersectionObserver {
      root: Element | Document | null = null;
      rootMargin = "";
      thresholds: readonly number[] = [];

      constructor(callback: IntersectionObserverCallback) {
        observerCallback = callback;
      }

      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
      takeRecords = vi.fn(() => []);
    }

    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);

    // IMPORTANT: import AFTER mocking the constructor
    await import("./offScreenObserver");
  });

  const makeEntry = (
    target: Element,
    isIntersecting: boolean
  ): IntersectionObserverEntry =>
    ({
      target,
      isIntersecting,
      boundingClientRect: target.getBoundingClientRect(),
      intersectionRect: target.getBoundingClientRect(),
      rootBounds: null,
      intersectionRatio: isIntersecting ? 1 : 0,
      time: performance.now(),
    } as IntersectionObserverEntry);

  it("removes 'off-screen' class when element enters viewport", () => {
    const element = document.createElement("div");
    element.classList.add("off-screen");

    observerCallback([makeEntry(element, true)], observer);

    expect(element.classList.contains("off-screen")).toBe(false);
  });

  it("adds 'off-screen' class when element leaves viewport", () => {
    const element = document.createElement("div");

    observerCallback([makeEntry(element, false)], observer);

    expect(element.classList.contains("off-screen")).toBe(true);
  });

  it("does nothing when element is intersecting and already visible", () => {
    const element = document.createElement("div");

    observerCallback([makeEntry(element, true)], observer);

    expect(element.classList.contains("off-screen")).toBe(false);
  });

  it("does nothing when element is not intersecting and already off-screen", () => {
    const element = document.createElement("div");
    element.classList.add("off-screen");

    observerCallback([makeEntry(element, false)], observer);

    expect(element.classList.contains("off-screen")).toBe(true);
  });
});
