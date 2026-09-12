import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  type MockedFunction,
} from "vitest";
import { hydrateBreadcrumbs } from "./hydrateBreadcrumbs";
import {
  slideUp,
  slideDown,
  getDuration,
  getBreakpoint,
  delay,
} from "../../effects/effects";

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
    (getBreakpoint as MockedFunction<typeof getBreakpoint>).mockReturnValue(
      768,
    );
    (getDuration as MockedFunction<typeof getDuration>).mockReturnValue(100);

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

  it("slides down a subnav on breadcrumb hover after delay", async () => {
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
    const firstSubnav = firstBreadcrumb.nextElementSibling as HTMLElement;
    firstBreadcrumb.dispatchEvent(new MouseEvent("mouseenter"));
    firstSubnav.style.display = "none";

    // Wait duration before switchSubnav is called
    await Promise.resolve();

    // Wait for Promise.all within switchSubnav(?)
    await Promise.resolve();
    await Promise.resolve();

    expect(slideDown).toHaveBeenCalledWith(firstSubnav);
  });

  it("slides up other subnavs when switching", async () => {
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
    const firstSubnav = firstBreadcrumb.nextElementSibling as HTMLElement;
    const secondBreadcrumb = breadcrumbs[1];
    const secondSubnav = secondBreadcrumb.nextElementSibling as HTMLElement;
    [firstSubnav, secondSubnav].forEach((subnav) => {
      subnav.style.display = "none";
    });

    // Hover first breadcrumb
    firstBreadcrumb.dispatchEvent(new MouseEvent("mouseenter"));

    await Promise.resolve(); // Wait duration before switchSubnav is called
    await Promise.resolve(); // Wait for switchSubnav to finish

    // Hover second breadcrumb
    secondBreadcrumb.dispatchEvent(new MouseEvent("mouseenter"));

    await Promise.resolve(); // Wait duration before switchSubnav is called

    // slideUp happens immediately
    expect(slideUp).toHaveBeenCalledWith(firstSubnav);
  });

  it("does nothing below breakpoint", async () => {
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

    const breadcrumb = document.querySelector("header > nav > a")!;
    breadcrumb.dispatchEvent(new MouseEvent("mouseenter"));

    await Promise.resolve();

    expect(slideUp).not.toHaveBeenCalled();
    expect(slideDown).not.toHaveBeenCalled();
  });
});
