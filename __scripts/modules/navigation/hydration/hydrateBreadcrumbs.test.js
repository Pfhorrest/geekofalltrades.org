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
import { slideUp, slideDown, getDuration, getBreakpoint, delay, } from "../../effects/effects";
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
function flushMicrotasks() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 0; i < 8; i += 1)
            yield Promise.resolve();
    });
}
describe("hydrateBreadcrumbs hover transitions", () => {
    beforeEach(() => {
        document.body.innerHTML = `
      <header><nav>
        <a class="current">One</a><ul></ul>
        <a>Two</a><ul></ul>
      </nav></header>
    `;
        vi.clearAllMocks();
        getBreakpoint.mockReturnValue(768);
        getDuration.mockReturnValue(100);
        Object.defineProperty(window, "innerWidth", {
            value: 1024,
            configurable: true,
        });
    });
    it("does not change breadcrumb state below the breakpoint", () => {
        Object.defineProperty(window, "innerWidth", {
            value: 500,
            configurable: true,
        });
        const breadcrumbs = document.querySelectorAll("header > nav > a");
        const first = breadcrumbs[0];
        const second = breadcrumbs[1];
        hydrateBreadcrumbs();
        second.dispatchEvent(new MouseEvent("mouseenter"));
        // Hovering below the breakpoint must not change either breadcrumb.
        expect(first.classList.contains("current")).toBe(true);
        expect(second.classList.contains("current")).toBe(false);
        expect(delay).not.toHaveBeenCalled();
        expect(slideUp).not.toHaveBeenCalled();
        expect(slideDown).not.toHaveBeenCalled();
    });
    it("does not switch subnavs when the pointer enters a breadcrumb from its own subnav", () => __awaiter(void 0, void 0, void 0, function* () {
        const breadcrumbs = document.querySelectorAll("header > nav > a");
        const first = breadcrumbs[0];
        const firstSubnav = first.nextElementSibling;
        firstSubnav.style.display = "none";
        hydrateBreadcrumbs();
        first.dispatchEvent(new MouseEvent("mouseenter", { relatedTarget: firstSubnav }));
        yield flushMicrotasks();
        expect(slideUp).not.toHaveBeenCalled();
        expect(slideDown).not.toHaveBeenCalled();
    }));
    it("returns to the last subnav when the pointer leaves a breadcrumb and no dropdown is active", () => __awaiter(void 0, void 0, void 0, function* () {
        const breadcrumbs = document.querySelectorAll("header > nav > a");
        const first = breadcrumbs[0];
        const firstSubnav = first.nextElementSibling;
        const lastSubnav = breadcrumbs[1].nextElementSibling;
        lastSubnav.style.display = "none";
        hydrateBreadcrumbs();
        const outside = document.createElement("div");
        first.dispatchEvent(new MouseEvent("mouseleave", { relatedTarget: outside }));
        yield flushMicrotasks();
        expect(first.classList.contains("current")).toBe(false);
        expect(slideUp).toHaveBeenCalledWith(firstSubnav);
        expect(slideDown).toHaveBeenCalledWith(lastSubnav);
    }));
    it("keeps the current breadcrumb when a dropdown is active", () => __awaiter(void 0, void 0, void 0, function* () {
        const nav = document.querySelector("header > nav");
        nav.insertAdjacentHTML("beforeend", '<ul><li class="active"></li></ul>');
        const breadcrumbs = document.querySelectorAll("header > nav > a");
        const first = breadcrumbs[0];
        const lastSubnav = breadcrumbs[1].nextElementSibling;
        lastSubnav.style.display = "none";
        hydrateBreadcrumbs();
        first.dispatchEvent(new MouseEvent("mouseleave", {
            relatedTarget: document.createElement("div"),
        }));
        yield flushMicrotasks();
        expect(first.classList.contains("current")).toBe(true);
        expect(slideDown).not.toHaveBeenCalledWith(lastSubnav);
    }));
    it("returns to the last subnav when the pointer leaves a subnav itself", () => __awaiter(void 0, void 0, void 0, function* () {
        const breadcrumbs = document.querySelectorAll("header > nav > a");
        const first = breadcrumbs[0];
        const firstSubnav = first.nextElementSibling;
        const lastSubnav = breadcrumbs[1].nextElementSibling;
        lastSubnav.style.display = "none";
        hydrateBreadcrumbs();
        first.classList.add("current");
        firstSubnav.dispatchEvent(new MouseEvent("mouseleave", {
            relatedTarget: document.createElement("div"),
        }));
        yield flushMicrotasks();
        expect(first.classList.contains("current")).toBe(false);
        expect(slideUp).toHaveBeenCalledWith(firstSubnav);
        expect(slideDown).toHaveBeenCalledWith(lastSubnav);
    }));
});
//# sourceMappingURL=hydrateBreadcrumbs.test.js.map