var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { slideDown } from "./slideDown";
function mockExpandableHeight(el, expandedHeight = 100) {
    Object.defineProperty(el, "offsetHeight", {
        configurable: true,
        get() {
            return getComputedStyle(el).display === "none" ? 0 : expandedHeight;
        },
    });
}
function transitionEnd(propertyName) {
    const event = new Event("transitionend");
    Object.defineProperty(event, "propertyName", { value: propertyName });
    return event;
}
describe("slideDown", () => {
    let el;
    beforeEach(() => {
        document.body.innerHTML = "";
        document.head.querySelectorAll("style[data-slide-down-test]").forEach((style) => style.remove());
        el = document.createElement("div");
        document.body.appendChild(el);
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });
    it("does nothing if the element is already fully expanded", () => __awaiter(void 0, void 0, void 0, function* () {
        mockExpandableHeight(el, 100);
        yield slideDown(el, 200);
        expect(el.style.height).toBe("");
        expect(el.style.transition).toBe("");
        expect(el.style.overflow).toBe("");
    }));
    it("expands a collapsed element", () => {
        el.style.display = "none";
        mockExpandableHeight(el, 100);
        void slideDown(el, 300);
        expect(el.style.overflow).toBe("hidden");
        expect(el.style.transition).toContain("300ms");
        expect(el.style.height).toBe("100px");
        expect(el.style.display).not.toBe("none");
    });
    it("cleans up styles only after the height transition ends", () => __awaiter(void 0, void 0, void 0, function* () {
        el.style.display = "none";
        el.style.setProperty("--dur", "10ms");
        mockExpandableHeight(el, 100);
        const animation = slideDown(el, 150);
        el.dispatchEvent(transitionEnd("opacity"));
        yield Promise.resolve();
        expect(el.style.height).toBe("100px");
        el.dispatchEvent(transitionEnd("height"));
        yield animation;
        expect(el.style.height).toBe("");
        expect(el.style.paddingTop).toBe("");
        expect(el.style.paddingBottom).toBe("");
        expect(el.style.rowGap).toBe("");
        expect(el.style.transition).toBe("");
        expect(el.style.overflow).toBe("");
    }));
    it("cleans up styles via the fallback timeout", () => __awaiter(void 0, void 0, void 0, function* () {
        el.style.display = "none";
        el.style.setProperty("--dur", "10ms");
        mockExpandableHeight(el, 100);
        const animation = slideDown(el, 200);
        vi.advanceTimersByTime(20);
        yield animation;
        expect(el.style.height).toBe("");
        expect(el.style.transition).toBe("");
        expect(el.style.overflow).toBe("");
    }));
    it("uses the element's --display value when a stylesheet keeps it hidden", () => {
        document.head.insertAdjacentHTML("beforeend", '<style data-slide-down-test>.forced-hidden { display: none; }</style>');
        el.classList.add("forced-hidden");
        el.style.setProperty("--display", "grid");
        mockExpandableHeight(el, 100);
        void slideDown(el, 100);
        expect(el.style.display).toBe("grid");
        expect(el.style.height).toBe("100px");
    });
    it("falls back to block display when a stylesheet keeps the element hidden without --display", () => {
        document.head.insertAdjacentHTML("beforeend", '<style data-slide-down-test>.forced-hidden { display: none; }</style>');
        el.classList.add("forced-hidden");
        mockExpandableHeight(el, 100);
        void slideDown(el, 100);
        expect(el.style.display).toBe("block");
        expect(el.style.height).toBe("100px");
    });
    it("temporarily collapses padding and row gap for a zero-height flex item", () => {
        const parent = document.createElement("div");
        parent.style.display = "flex";
        document.body.appendChild(parent);
        parent.appendChild(el);
        el.style.display = "none";
        el.style.paddingTop = "8px";
        el.style.rowGap = "6px";
        el.style.paddingBottom = "4px";
        const flexStartMeasurements = [];
        Object.defineProperty(el, "offsetHeight", {
            configurable: true,
            get() {
                if (el.style.height === "0px") {
                    flexStartMeasurements.push(`${el.style.paddingTop},${el.style.rowGap},${el.style.paddingBottom}`);
                }
                return getComputedStyle(el).display === "none" ? 0 : 100;
            },
        });
        void slideDown(el, 100);
        // The zero-height flex-item path resets these to zero before animating,
        // then restores their natural values for the expansion.
        expect(flexStartMeasurements).toContain("0px,0px,0px");
        expect(el.style.paddingTop).toBe("8px");
        expect(el.style.rowGap).toBe("6px");
        expect(el.style.paddingBottom).toBe("4px");
        expect(el.style.height).toBe("100px");
    });
});
//# sourceMappingURL=slideDown.test.js.map