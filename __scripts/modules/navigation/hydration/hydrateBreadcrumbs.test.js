import { describe, it, expect, beforeEach, vi } from "vitest";
import { hydrateBreadcrumbs } from "./hydrateBreadcrumbs";
import { slideUp, slideDown, getDuration, getBreakpoint, } from "../../effects/effects";
vi.mock("../../effects/effects", () => ({
    slideUp: vi.fn(),
    slideDown: vi.fn(),
    getDuration: vi.fn(),
    getBreakpoint: vi.fn(),
}));
describe("hydrateBreadcrumbs", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        vi.clearAllMocks();
        vi.useFakeTimers();
        // Default mocks
        getBreakpoint.mockReturnValue(768);
        getDuration.mockReturnValue(100);
        Object.defineProperty(window, "innerWidth", {
            value: 1024,
            configurable: true,
        });
    });
    it("does nothing if no subnavs exist", () => {
        document.body.innerHTML = `
      <header>
        <nav>
          <a>Home</a>
        </nav>
      </header>
    `;
        hydrateBreadcrumbs();
        expect(slideUp).not.toHaveBeenCalled();
        expect(slideDown).not.toHaveBeenCalled();
    });
    it("slides down a subnav on breadcrumb hover after delay", () => {
        document.body.innerHTML = `
      <header>
        <nav>
          <a>One</a>
          <ul></ul>
          <a>Two</a>
          <ul></ul>
        </nav>
      </header>
    `;
        hydrateBreadcrumbs();
        const breadcrumbs = document.querySelectorAll("header > nav > a");
        const firstBreadcrumb = breadcrumbs[0];
        const firstSubnav = firstBreadcrumb.nextElementSibling;
        firstBreadcrumb.dispatchEvent(new MouseEvent("mouseenter"));
        firstSubnav.style.display = "none";
        // hoverDelay = 2 * getDuration
        // + transitionDuration = 3 * getDuration
        vi.advanceTimersByTime(getDuration(firstSubnav) * 3);
        expect(slideDown).toHaveBeenCalledWith(firstSubnav);
    });
    it("slides up other subnavs when switching", () => {
        document.body.innerHTML = `
      <header>
        <nav>
          <a>One</a>
          <ul></ul>
          <a>Two</a>
          <ul></ul>
        </nav>
      </header>
    `;
        hydrateBreadcrumbs();
        const breadcrumbs = document.querySelectorAll("header > nav > a");
        const firstBreadcrumb = breadcrumbs[0];
        const firstSubnav = firstBreadcrumb.nextElementSibling;
        const secondBreadcrumb = breadcrumbs[1];
        const secondSubnav = secondBreadcrumb.nextElementSibling;
        [firstSubnav, secondSubnav].forEach((subnav) => {
            subnav.style.display = "none";
        });
        // Hover first breadcrumb
        firstBreadcrumb.dispatchEvent(new MouseEvent("mouseenter"));
        // hoverDelay = 2 * getDuration
        vi.advanceTimersByTime(getDuration(firstSubnav) * 2);
        // Hover second breadcrumb
        secondBreadcrumb.dispatchEvent(new MouseEvent("mouseenter"));
        // slideUp happens immediately
        expect(slideUp).toHaveBeenCalledWith(firstSubnav);
    });
    it("does nothing below breakpoint", () => {
        Object.defineProperty(window, "innerWidth", {
            value: 500,
            configurable: true,
        });
        document.body.innerHTML = `
      <header>
        <nav>
          <a>One</a>
          <ul></ul>
        </nav>
      </header>
    `;
        hydrateBreadcrumbs();
        const breadcrumb = document.querySelector("header > nav > a");
        breadcrumb.dispatchEvent(new MouseEvent("mouseenter"));
        vi.runAllTimers();
        expect(slideUp).not.toHaveBeenCalled();
        expect(slideDown).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=hydrateBreadcrumbs.test.js.map