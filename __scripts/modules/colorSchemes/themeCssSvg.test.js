// @vitest-environment jsdom
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
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
let responses;
let fetchMock;
beforeEach(() => {
    vi.resetModules();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
    responses = new Map([[svgUrl, svgSource]]);
    fetchMock = vi.fn((input) => __awaiter(void 0, void 0, void 0, function* () {
        const source = responses.get(String(input));
        return source === undefined
            ? { ok: false, text: () => __awaiter(void 0, void 0, void 0, function* () { return ""; }) }
            : { ok: true, text: () => __awaiter(void 0, void 0, void 0, function* () { return source; }) };
    }));
    vi.stubGlobal("fetch", fetchMock);
    // jsdom's CSS.supports implementation is incomplete. For these tests, colors
    // are intentionally limited to known CSS color literals in the SVG fixtures.
    vi.stubGlobal("CSS", {
        supports: (_property, _value) => true,
    });
    // Keep native computed styles for image properties, but reliably expose local
    // custom-property declarations. jsdom does not fully resolve custom-property
    // inheritance the way a browser does.
    const nativeGetComputedStyle = window.getComputedStyle.bind(window);
    vi.stubGlobal("getComputedStyle", (element) => {
        const computed = nativeGetComputedStyle(element);
        return {
            getPropertyValue(property) {
                var _a;
                const inlineValue = ((_a = element.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(property)) || "";
                if (property.startsWith("--") && inlineValue)
                    return inlineValue;
                return computed.getPropertyValue(property) || inlineValue;
            },
        };
    });
});
afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});
function importThemeCssSvg() {
    return __awaiter(this, void 0, void 0, function* () {
        return import("./themeCssSvg");
    });
}
function addTarget(tagName, property = "background") {
    const element = document.createElement(tagName);
    const cssProperty = property === "background" || property === "background-image"
        ? "background-image"
        : property === "mask" || property === "mask-image"
            ? "mask-image"
            : "list-style-image";
    element.style.setProperty(cssProperty, `url("${svgUrl}")`);
    document.body.append(element);
    return element;
}
function waitForDataUrl(element_1) {
    return __awaiter(this, arguments, void 0, function* (element, property = "background-image") {
        yield vi.waitFor(() => {
            expect(element.style.getPropertyValue(property)).toContain("data:image/svg+xml;charset=utf-8,");
        });
    });
}
function getDataUrl(element, property = "background-image") {
    const value = element.style.getPropertyValue(property);
    const match = value.match(/url\(\s*"(data:image\/svg\+xml;charset=utf-8,[^"]+)"\s*\)/i);
    if (!match) {
        throw new Error(`No generated SVG data URL found in ${property}: ${value}`);
    }
    return match[1];
}
function parseDataUrlSvg(dataUrl) {
    const comma = dataUrl.indexOf(",");
    const encodedSource = dataUrl.slice(comma + 1).split("#", 1)[0];
    return new DOMParser().parseFromString(decodeURIComponent(encodedSource), "image/svg+xml");
}
function flushAsyncWork() {
    return __awaiter(this, void 0, void 0, function* () {
        yield Promise.resolve();
        yield Promise.resolve();
        yield new Promise((resolve) => window.setTimeout(resolve, 0));
    });
}
describe("themeCssSvg", () => {
    it("replaces named SVG colors and generates the expected root default variable", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        const element = addTarget("h1");
        const variable = "--h1-background-flames-smaller-radial-gradient-end-stop-color";
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(element, "background");
        yield waitForDataUrl(element);
        const svg = parseDataUrlSvg(getDataUrl(element));
        expect((_a = svg.querySelector("#radial-gradient-end")) === null || _a === void 0 ? void 0 : _a.getAttribute("stop-color")).toBe("#663300");
        expect((_b = document.querySelector("style[data-svg-theme-defaults]")) === null || _b === void 0 ? void 0 : _b.textContent).toContain(`${variable}: #663300;`);
        expect((_c = svg.querySelector("#radial-gradient-end")) === null || _c === void 0 ? void 0 : _c.getAttribute("stop-color")).not.toContain("var(");
    }));
    it("uses a custom property declared on the consuming element to override the SVG default", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        const element = addTarget("h1");
        const variable = "--h1-background-flames-smaller-radial-gradient-end-stop-color";
        element.style.setProperty(variable, "#abcdef");
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(element, "background");
        yield waitForDataUrl(element);
        const svg = parseDataUrlSvg(getDataUrl(element));
        expect((_a = svg.querySelector("#radial-gradient-end")) === null || _a === void 0 ? void 0 : _a.getAttribute("stop-color")).toBe("#abcdef");
        // The inherited/root value remains the original SVG color, not the local override.
        expect((_b = document.querySelector("style[data-svg-theme-defaults]")) === null || _b === void 0 ? void 0 : _b.textContent).toContain(`${variable}: #663300;`);
    }));
    it("leaves color declarations on SVG elements without IDs unchanged", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        responses.set(svgUrl, `<svg xmlns="http://www.w3.org/2000/svg"><path id="named" fill="#112233"/><path fill="#445566"/></svg>`);
        const element = addTarget("h1");
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(element, "background");
        yield waitForDataUrl(element);
        const svg = parseDataUrlSvg(getDataUrl(element));
        expect((_a = svg.querySelector("#named")) === null || _a === void 0 ? void 0 : _a.getAttribute("fill")).toBe("#112233");
        expect(svg.querySelectorAll("path")[1].getAttribute("fill")).toBe("#445566");
        expect((_b = document.querySelector("style[data-svg-theme-defaults]")) === null || _b === void 0 ? void 0 : _b.textContent).toContain("--h1-background-flames-smaller-named-fill: #112233;");
        expect((_c = document.querySelector("style[data-svg-theme-defaults]")) === null || _c === void 0 ? void 0 : _c.textContent).not.toContain("445566");
    }));
    it("leaves currentColor and internal paint-server references alone", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c;
        responses.set(svgUrl, `<svg xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="paint"/></defs><path id="special" fill="url(#paint)" stroke="currentColor"/><path id="literal" fill="#112233"/></svg>`);
        const element = addTarget("h1");
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(element, "background");
        yield waitForDataUrl(element);
        const svg = parseDataUrlSvg(getDataUrl(element));
        expect((_a = svg.querySelector("#special")) === null || _a === void 0 ? void 0 : _a.getAttribute("fill")).toBe("url(#paint)");
        expect((_b = svg.querySelector("#special")) === null || _b === void 0 ? void 0 : _b.getAttribute("stroke")).toBe("currentColor");
        expect((_c = svg.querySelector("#literal")) === null || _c === void 0 ? void 0 : _c.getAttribute("fill")).toBe("#112233");
    }));
    it("themes literal colors declared in an SVG element's inline style", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        responses.set(svgUrl, `<svg xmlns="http://www.w3.org/2000/svg"><path id="outline" style="fill: #112233; stroke: #aabbcc" d="M0 0 L1 1"/></svg>`);
        const element = addTarget("h1");
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(element, "background");
        yield waitForDataUrl(element);
        const svg = parseDataUrlSvg(getDataUrl(element));
        const path = svg.querySelector("#outline");
        expect(path === null || path === void 0 ? void 0 : path.getAttribute("style")).toContain("fill: #112233");
        expect(path === null || path === void 0 ? void 0 : path.getAttribute("style")).toContain("stroke: #aabbcc");
        expect((_a = document.querySelector("style[data-svg-theme-defaults]")) === null || _a === void 0 ? void 0 : _a.textContent).toContain("--h1-background-flames-smaller-outline-fill: #112233;");
        expect((_b = document.querySelector("style[data-svg-theme-defaults]")) === null || _b === void 0 ? void 0 : _b.textContent).toContain("--h1-background-flames-smaller-outline-stroke: #aabbcc;");
    }));
    it("maps mask-image to the mask variable prefix", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const element = addTarget("div", "mask-image");
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(element, "mask-image");
        yield waitForDataUrl(element, "mask-image");
        expect((_a = document.querySelector("style[data-svg-theme-defaults]")) === null || _a === void 0 ? void 0 : _a.textContent).toContain("--div-mask-flames-smaller-radial-gradient-end-stop-color: #663300;");
    }));
    it("rebuilds registered SVGs when the preferred color scheme changes", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const changeListeners = [];
        const originalMatchMediaDescriptor = Object.getOwnPropertyDescriptor(window, "matchMedia");
        Object.defineProperty(window, "matchMedia", {
            configurable: true,
            value: vi.fn(() => ({
                addEventListener: (_eventName, listener) => {
                    changeListeners.push(listener);
                },
            })),
        });
        vi.stubGlobal("requestAnimationFrame", (callback) => {
            callback(0);
            return 1;
        });
        try {
            const element = addTarget("h1");
            const variable = "--h1-background-flames-smaller-radial-gradient-end-stop-color";
            const { themeCssSvg } = yield importThemeCssSvg();
            themeCssSvg(element, "background");
            yield waitForDataUrl(element);
            const originalDataUrl = getDataUrl(element);
            expect((_a = parseDataUrlSvg(originalDataUrl)
                .querySelector("#radial-gradient-end")) === null || _a === void 0 ? void 0 : _a.getAttribute("stop-color")).toBe("#663300");
            // A theme change should re-resolve the already-registered SVG against the
            // consuming element's current custom property value.
            element.style.setProperty(variable, "#abcdef");
            expect(changeListeners).toHaveLength(1);
            changeListeners[0](new Event("change"));
            yield vi.waitFor(() => {
                var _a;
                const refreshedDataUrl = getDataUrl(element);
                expect(refreshedDataUrl).not.toBe(originalDataUrl);
                expect((_a = parseDataUrlSvg(refreshedDataUrl)
                    .querySelector("#radial-gradient-end")) === null || _a === void 0 ? void 0 : _a.getAttribute("stop-color")).toBe("#abcdef");
            });
        }
        finally {
            if (originalMatchMediaDescriptor) {
                Object.defineProperty(window, "matchMedia", originalMatchMediaDescriptor);
            }
            else {
                Reflect.deleteProperty(window, "matchMedia");
            }
        }
    }));
    it("fetches a shared SVG only once when used by multiple targets", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const heading = addTarget("h1");
        const paragraph = addTarget("p");
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(heading, "background");
        themeCssSvg(paragraph, "background");
        yield Promise.all([waitForDataUrl(heading), waitForDataUrl(paragraph)]);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect((_a = document.querySelector("style[data-svg-theme-defaults]")) === null || _a === void 0 ? void 0 : _a.textContent).toContain("--p-background-flames-smaller-radial-gradient-end-stop-color: #663300;");
    }));
    it("leaves non-SVG URLs unchanged and does not fetch them", () => __awaiter(void 0, void 0, void 0, function* () {
        const element = document.createElement("h1");
        const original = 'url("https://example.test/assets/flames.png")';
        element.style.setProperty("background-image", original);
        document.body.append(element);
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(element, "background");
        yield flushAsyncWork();
        expect(element.style.getPropertyValue("background-image")).toContain("flames.png");
        expect(element.style.getPropertyValue("background-image")).not.toContain("data:image/svg+xml");
        expect(fetchMock).not.toHaveBeenCalled();
    }));
    it("preserves the original image when fetching the SVG fails", () => __awaiter(void 0, void 0, void 0, function* () {
        fetchMock.mockResolvedValue({ ok: false, text: () => __awaiter(void 0, void 0, void 0, function* () { return ""; }) });
        const element = addTarget("h1");
        const original = element.style.getPropertyValue("background-image");
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(element, "background");
        yield flushAsyncWork();
        expect(element.style.getPropertyValue("background-image")).toBe(original);
        expect(element.style.getPropertyValue("background-image")).not.toContain("data:image/svg+xml");
    }));
    it("ignores malformed SVG source and leaves the original URL in place", () => __awaiter(void 0, void 0, void 0, function* () {
        responses.set(svgUrl, "<svg><path id='broken'></svg>");
        const element = addTarget("h1");
        const original = element.style.getPropertyValue("background-image");
        const { themeCssSvg } = yield importThemeCssSvg();
        themeCssSvg(element, "background");
        yield flushAsyncWork();
        expect(element.style.getPropertyValue("background-image")).toBe(original);
    }));
});
//# sourceMappingURL=themeCssSvg.test.js.map