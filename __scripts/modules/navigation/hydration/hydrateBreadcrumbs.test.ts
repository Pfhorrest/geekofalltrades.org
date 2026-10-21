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

async function flushMicrotasks(): Promise<void> {
  for (let i = 0; i < 8; i += 1) await Promise.resolve();
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
    (getBreakpoint as MockedFunction<typeof getBreakpoint>).mockReturnValue(
      768,
    );
    (getDuration as MockedFunction<typeof getDuration>).mockReturnValue(100);
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

  it("does not switch subnavs when the pointer enters a breadcrumb from its own subnav", async () => {
    const breadcrumbs = document.querySelectorAll("header > nav > a");
    const first = breadcrumbs[0];
    const firstSubnav = first.nextElementSibling as HTMLElement;
    firstSubnav.style.display = "none";

    hydrateBreadcrumbs();
    first.dispatchEvent(
      new MouseEvent("mouseenter", { relatedTarget: firstSubnav }),
    );
    await flushMicrotasks();

    expect(slideUp).not.toHaveBeenCalled();
    expect(slideDown).not.toHaveBeenCalled();
  });

  it("returns to the last subnav when the pointer leaves a breadcrumb and no dropdown is active", async () => {
    const breadcrumbs = document.querySelectorAll("header > nav > a");
    const first = breadcrumbs[0];
    const firstSubnav = first.nextElementSibling as HTMLElement;
    const lastSubnav = breadcrumbs[1].nextElementSibling as HTMLElement;
    lastSubnav.style.display = "none";

    hydrateBreadcrumbs();
    const outside = document.createElement("div");
    first.dispatchEvent(
      new MouseEvent("mouseleave", { relatedTarget: outside }),
    );
    await flushMicrotasks();

    expect(first.classList.contains("current")).toBe(false);
    expect(slideUp).toHaveBeenCalledWith(firstSubnav);
    expect(slideDown).toHaveBeenCalledWith(lastSubnav);
  });

  it("keeps the current breadcrumb when a dropdown is active", async () => {
    const nav = document.querySelector("header > nav")!;
    nav.insertAdjacentHTML("beforeend", '<ul><li class="active"></li></ul>');
    const breadcrumbs = document.querySelectorAll("header > nav > a");
    const first = breadcrumbs[0];
    const lastSubnav = breadcrumbs[1].nextElementSibling as HTMLElement;
    lastSubnav.style.display = "none";

    hydrateBreadcrumbs();
    first.dispatchEvent(
      new MouseEvent("mouseleave", {
        relatedTarget: document.createElement("div"),
      }),
    );
    await flushMicrotasks();

    expect(first.classList.contains("current")).toBe(true);
    expect(slideDown).not.toHaveBeenCalledWith(lastSubnav);
  });

  it("returns to the last subnav when the pointer leaves a subnav itself", async () => {
    const breadcrumbs = document.querySelectorAll("header > nav > a");
    const first = breadcrumbs[0];
    const firstSubnav = first.nextElementSibling as HTMLElement;
    const lastSubnav = breadcrumbs[1].nextElementSibling as HTMLElement;
    lastSubnav.style.display = "none";

    hydrateBreadcrumbs();
    first.classList.add("current");
    firstSubnav.dispatchEvent(
      new MouseEvent("mouseleave", {
        relatedTarget: document.createElement("div"),
      }),
    );
    await flushMicrotasks();

    expect(first.classList.contains("current")).toBe(false);
    expect(slideUp).toHaveBeenCalledWith(firstSubnav);
    expect(slideDown).toHaveBeenCalledWith(lastSubnav);
  });
});
