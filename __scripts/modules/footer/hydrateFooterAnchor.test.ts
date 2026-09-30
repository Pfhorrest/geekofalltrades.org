import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";
import { hydrateFooterAnchor } from "./hydrateFooterAnchor";
describe("hydrateFooterAnchor", () => {
  let observerMap = new Map<Element, (entries: any[]) => void>();
  beforeAll(() => {
    vi.stubGlobal(
      "ResizeObserver",
      class ResizeObserver {
        private cb: (entries: any[]) => void;
        constructor(cb: (entries: any[]) => void) {
          this.cb = cb;
        }
        observe(element: Element) {
          // Map this specific element to this observer's callback
          observerMap.set(element, this.cb);
        }
        unobserve(element: Element) {
          observerMap.delete(element);
        }
        disconnect() {
          observerMap.clear();
        }
      },
    );
  });
  beforeEach(() => {
    document.body.innerHTML = "<footer></footer>";
    vi.clearAllMocks();
  });
  it("creates footer anchor", () => {
    hydrateFooterAnchor();
    expect(document.querySelector("#footerAnchor")).toBeTruthy();
  });
  it("scrolls to the bottom on click", () => {
    const scrollY = vi.spyOn(window, "scrollY", "get").mockReturnValue(0);
    hydrateFooterAnchor();
    document
      .querySelector("#footerAnchor")!
      .dispatchEvent(new MouseEvent("click"));
    expect(scrollY).toHaveBeenCalled();
  });
  it("updates --footerHeight on footer resize", () => {
    hydrateFooterAnchor();
    const footer = document.querySelector<HTMLElement>("footer")!;
    const setProperty = vi.spyOn(footer.style, "setProperty");
    vi.spyOn(footer, "offsetHeight", "get").mockReturnValue(480);
    const callback = observerMap.get(footer);
    if (!callback) throw new Error("footer ResizeObserver not found");
    callback([
      {
        target: footer,
        contentRect: {
          height: 480,
        },
        contentBoxSize: [{ blockSize: 480 }],
        borderBoxSize: [{ blockSize: 480 }],
      },
    ]);
    expect(setProperty).toHaveBeenCalledWith("--footerHeight", "480px");
  });
  it("updates --footerAnchorHeight on footerAnchor resize", () => {
    hydrateFooterAnchor();
    const footer = document.querySelector<HTMLElement>("footer")!;
    const footerAnchor = document.querySelector<HTMLElement>("#footerAnchor")!;
    const setProperty = vi.spyOn(footer.style, "setProperty");
    vi.spyOn(footerAnchor, "offsetHeight", "get").mockReturnValue(48);
    const callback = observerMap.get(footerAnchor);
    if (!callback) throw new Error("footerAnchor ResizeObserver not found");
    callback([
      {
        target: footerAnchor,
        contentRect: {
          height: 48,
        },
        contentBoxSize: [{ blockSize: 48 }],
        borderBoxSize: [{ blockSize: 48 }],
      },
    ]);
    expect(setProperty).toHaveBeenCalledWith("--footerAnchorHeight", "48px");
  });
});
