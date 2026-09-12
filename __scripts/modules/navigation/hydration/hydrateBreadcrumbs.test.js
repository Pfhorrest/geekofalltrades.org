var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, vi, } from "vitest";
import { hydrateBreadcrumbs } from "./hydrateBreadcrumbs";
import { slideUp, slideDown, getDuration, getBreakpoint, } from "../../effects/effects";
vi.mock("../../effects/effects", () => ({
    slideUp: vi.fn(),
    slideDown: vi.fn(),
    getDuration: vi.fn(),
    getBreakpoint: vi.fn(),
    delay: vi.fn().mockResolvedValue(undefined),
}));
describe("hydrateBreadcrumbs", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        vi.clearAllMocks();
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
    it("slides down a subnav on breadcrumb hover after delay", () => __awaiter(void 0, void 0, void 0, function* () {
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
        // Wait duration before switchSubnav is called
        yield Promise.resolve();
        // Wait for Promise.all within switchSubnav(?)
        yield Promise.resolve();
        yield Promise.resolve();
        expect(slideDown).toHaveBeenCalledWith(firstSubnav);
    }));
    it("slides up other subnavs when switching", () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield Promise.resolve(); // Wait duration before switchSubnav is called
        yield Promise.resolve(); // Wait for switchSubnav to finish
        // Hover second breadcrumb
        secondBreadcrumb.dispatchEvent(new MouseEvent("mouseenter"));
        yield Promise.resolve(); // Wait duration before switchSubnav is called
        // slideUp happens immediately
        expect(slideUp).toHaveBeenCalledWith(firstSubnav);
    }));
    it("does nothing below breakpoint", () => __awaiter(void 0, void 0, void 0, function* () {
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
        yield Promise.resolve();
        expect(slideUp).not.toHaveBeenCalled();
        expect(slideDown).not.toHaveBeenCalled();
    }));
});
//# sourceMappingURL=hydrateBreadcrumbs.test.js.map