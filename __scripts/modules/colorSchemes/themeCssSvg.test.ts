// @vitest-environment jsdom

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type MockResponse = {
  ok: boolean;
  text: () => Promise<string>;
};

const svgUrl = "https://example.test/assets/flames-smaller.svg";
const svgSource = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10">
    <defs>
      <radialGradient id="radial-gradient">
        <stop id="radial-gradient-start" offset="0" stop-color="#ff3300" />
        <stop id="radial-gradient-end" offset="1" stop-color="#663300" />
      </radialGradient>
    </defs>
    <path id="flame" fill="#cc5500" d="M0 0 L10 10" />
  </svg>
`;

let responses: Map<string, string>;
let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  vi.resetModules();
  document.head.innerHTML = "";
  document.body.innerHTML = "";

  responses = new Map([[svgUrl, svgSource]]);
  fetchMock = vi.fn(async (input: RequestInfo | URL): Promise<MockResponse> => {
    const source = responses.get(String(input));
    return source === undefined
      ? { ok: false, text: async () => "" }
      : { ok: true, text: async () => source };
  });
  vi.stubGlobal("fetch", fetchMock);

  // jsdom's CSS.supports implementation is incomplete. For these tests, colors
  // are intentionally limited to known CSS color literals in the SVG fixtures.
  vi.stubGlobal("CSS", {
    supports: (_property: string, _value: string): boolean => true,
  });

  // Keep native computed styles for image properties, but reliably expose local
  // custom-property declarations. jsdom does not fully resolve custom-property
  // inheritance the way a browser does.
  const nativeGetComputedStyle = window.getComputedStyle.bind(window);
  vi.stubGlobal("getComputedStyle", (element: Element): CSSStyleDeclaration => {
    const computed = nativeGetComputedStyle(element);
    return {
      getPropertyValue(property: string): string {
        const inlineValue = (element as HTMLElement).style?.getPropertyValue(property) || "";
        if (property.startsWith("--") && inlineValue) return inlineValue;
        return computed.getPropertyValue(property) || inlineValue;
      },
    } as CSSStyleDeclaration;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

async function importThemeCssSvg() {
  return import("./themeCssSvg");
}

function addTarget(
  tagName: string,
  property: "background" | "background-image" | "mask" | "mask-image" | "list-style-image" = "background"
): HTMLElement {
  const element = document.createElement(tagName);
  const cssProperty =
    property === "background" || property === "background-image"
      ? "background-image"
      : property === "mask" || property === "mask-image"
        ? "mask-image"
        : "list-style-image";
  element.style.setProperty(cssProperty, `url("${svgUrl}")`);
  document.body.append(element);
  return element;
}

async function waitForDataUrl(element: HTMLElement, property = "background-image"): Promise<void> {
  await vi.waitFor(() => {
    expect(element.style.getPropertyValue(property)).toContain("data:image/svg+xml;charset=utf-8,");
  });
}

function getDataUrl(element: HTMLElement, property = "background-image"): string {
  const value = element.style.getPropertyValue(property);
  const match = value.match(
    /url\(\s*"(data:image\/svg\+xml;charset=utf-8,[^"]+)"\s*\)/i
  );

  if (!match) {
    throw new Error(`No generated SVG data URL found in ${property}: ${value}`);
  }

  return match[1];
}

function parseDataUrlSvg(dataUrl: string): Document {
  const comma = dataUrl.indexOf(",");
  const encodedSource = dataUrl.slice(comma + 1).split("#", 1)[0];
  return new DOMParser().parseFromString(decodeURIComponent(encodedSource), "image/svg+xml");
}

async function flushAsyncWork(): Promise<void> {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise<void>((resolve) => window.setTimeout(resolve, 0));
}

describe("themeCssSvg", () => {
  it("replaces named SVG colors and generates the expected root default variable", async () => {
    const element = addTarget("h1");
    const variable = "--h1-background-flames-smaller-radial-gradient-end-stop-color";
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(element, "background");
    await waitForDataUrl(element);

    const svg = parseDataUrlSvg(getDataUrl(element));
    expect(svg.querySelector("#radial-gradient-end")?.getAttribute("stop-color")).toBe("#663300");
    expect(document.querySelector("style[data-svg-theme-defaults]")?.textContent).toContain(
      `${variable}: #663300;`
    );
    expect(svg.querySelector("#radial-gradient-end")?.getAttribute("stop-color")).not.toContain("var(");
  });

  it("uses a custom property declared on the consuming element to override the SVG default", async () => {
    const element = addTarget("h1");
    const variable = "--h1-background-flames-smaller-radial-gradient-end-stop-color";
    element.style.setProperty(variable, "#abcdef");
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(element, "background");
    await waitForDataUrl(element);

    const svg = parseDataUrlSvg(getDataUrl(element));
    expect(svg.querySelector("#radial-gradient-end")?.getAttribute("stop-color")).toBe("#abcdef");
    // The inherited/root value remains the original SVG color, not the local override.
    expect(document.querySelector("style[data-svg-theme-defaults]")?.textContent).toContain(
      `${variable}: #663300;`
    );
  });

  it("leaves color declarations on SVG elements without IDs unchanged", async () => {
    responses.set(
      svgUrl,
      `<svg xmlns="http://www.w3.org/2000/svg"><path id="named" fill="#112233"/><path fill="#445566"/></svg>`
    );
    const element = addTarget("h1");
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(element, "background");
    await waitForDataUrl(element);

    const svg = parseDataUrlSvg(getDataUrl(element));
    expect(svg.querySelector("#named")?.getAttribute("fill")).toBe("#112233");
    expect(svg.querySelectorAll("path")[1].getAttribute("fill")).toBe("#445566");
    expect(document.querySelector("style[data-svg-theme-defaults]")?.textContent).toContain(
      "--h1-background-flames-smaller-named-fill: #112233;"
    );
    expect(document.querySelector("style[data-svg-theme-defaults]")?.textContent).not.toContain(
      "445566"
    );
  });

  it("leaves currentColor and internal paint-server references alone", async () => {
    responses.set(
      svgUrl,
      `<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="paint"/></defs><path id="special" fill="url(#paint)" stroke="currentColor"/><path id="literal" fill="#112233"/></svg>`
    );
    const element = addTarget("h1");
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(element, "background");
    await waitForDataUrl(element);

    const svg = parseDataUrlSvg(getDataUrl(element));
    expect(svg.querySelector("#special")?.getAttribute("fill")).toBe("url(#paint)");
    expect(svg.querySelector("#special")?.getAttribute("stroke")).toBe("currentColor");
    expect(svg.querySelector("#literal")?.getAttribute("fill")).toBe("#112233");
  });

  it("themes literal colors declared in an SVG element's inline style", async () => {
    responses.set(
      svgUrl,
      `<svg xmlns="http://www.w3.org/2000/svg"><path id="outline" style="fill: #112233; stroke: #aabbcc" d="M0 0 L1 1"/></svg>`
    );
    const element = addTarget("h1");
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(element, "background");
    await waitForDataUrl(element);

    const svg = parseDataUrlSvg(getDataUrl(element));
    const path = svg.querySelector("#outline");
    expect(path?.getAttribute("style")).toContain("fill: #112233");
    expect(path?.getAttribute("style")).toContain("stroke: #aabbcc");
    expect(document.querySelector("style[data-svg-theme-defaults]")?.textContent).toContain(
      "--h1-background-flames-smaller-outline-fill: #112233;"
    );
    expect(document.querySelector("style[data-svg-theme-defaults]")?.textContent).toContain(
      "--h1-background-flames-smaller-outline-stroke: #aabbcc;"
    );
  });

  it("maps mask-image to the mask variable prefix", async () => {
    const element = addTarget("div", "mask-image");
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(element, "mask-image");
    await waitForDataUrl(element, "mask-image");

    expect(document.querySelector("style[data-svg-theme-defaults]")?.textContent).toContain(
      "--div-mask-flames-smaller-radial-gradient-end-stop-color: #663300;"
    );
  });

  it("fetches a shared SVG only once when used by multiple targets", async () => {
    const heading = addTarget("h1");
    const paragraph = addTarget("p");
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(heading, "background");
    themeCssSvg(paragraph, "background");

    await Promise.all([waitForDataUrl(heading), waitForDataUrl(paragraph)]);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(document.querySelector("style[data-svg-theme-defaults]")?.textContent).toContain(
      "--p-background-flames-smaller-radial-gradient-end-stop-color: #663300;"
    );
  });

  it("leaves non-SVG URLs unchanged and does not fetch them", async () => {
    const element = document.createElement("h1");
    const original = 'url("https://example.test/assets/flames.png")';
    element.style.setProperty("background-image", original);
    document.body.append(element);
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(element, "background");
    await flushAsyncWork();

    expect(element.style.getPropertyValue("background-image")).toContain("flames.png");
    expect(element.style.getPropertyValue("background-image")).not.toContain("data:image/svg+xml");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("preserves the original image when fetching the SVG fails", async () => {
    fetchMock.mockResolvedValue({ ok: false, text: async () => "" });
    const element = addTarget("h1");
    const original = element.style.getPropertyValue("background-image");
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(element, "background");
    await flushAsyncWork();

    expect(element.style.getPropertyValue("background-image")).toBe(original);
    expect(element.style.getPropertyValue("background-image")).not.toContain("data:image/svg+xml");
  });

  it("ignores malformed SVG source and leaves the original URL in place", async () => {
    responses.set(svgUrl, "<svg><path id='broken'></svg>");
    const element = addTarget("h1");
    const original = element.style.getPropertyValue("background-image");
    const { themeCssSvg } = await importThemeCssSvg();

    themeCssSvg(element, "background");
    await flushAsyncWork();

    expect(element.style.getPropertyValue("background-image")).toBe(original);
  });
});
