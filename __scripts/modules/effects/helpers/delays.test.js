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
import { delay, delayForEvent } from "./delays";
describe("delay", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });
    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });
    it("resolves after the requested number of milliseconds", () => __awaiter(void 0, void 0, void 0, function* () {
        let resolved = false;
        const waiting = delay(250).then(() => {
            resolved = true;
        });
        vi.advanceTimersByTime(249);
        yield Promise.resolve();
        expect(resolved).toBe(false);
        vi.advanceTimersByTime(1);
        yield waiting;
        expect(resolved).toBe(true);
    }));
});
describe("delayForEvent", () => {
    let element;
    beforeEach(() => {
        vi.useFakeTimers();
        element = document.createElement("div");
        element.style.setProperty("--dur", "10ms");
    });
    afterEach(() => {
        vi.clearAllTimers();
        vi.useRealTimers();
    });
    function transitionEvent(propertyName) {
        const event = new Event("transitionend");
        Object.defineProperty(event, "propertyName", { value: propertyName });
        return event;
    }
    it("resolves only when the event meets the supplied condition", () => __awaiter(void 0, void 0, void 0, function* () {
        let resolved = false;
        const waiting = delayForEvent(element, "transitionend", (event) => event.propertyName === "height", 100).then(() => {
            resolved = true;
        });
        element.dispatchEvent(transitionEvent("opacity"));
        yield Promise.resolve();
        expect(resolved).toBe(false);
        element.dispatchEvent(transitionEvent("height"));
        yield waiting;
        expect(resolved).toBe(true);
    }));
    it("resolves on the first matching event when no condition is supplied", () => __awaiter(void 0, void 0, void 0, function* () {
        const waiting = delayForEvent(element, "click", undefined, 100);
        element.dispatchEvent(new MouseEvent("click"));
        yield expect(waiting).resolves.toBeUndefined();
    }));
    it("uses twice the element duration as its default timeout", () => __awaiter(void 0, void 0, void 0, function* () {
        let resolved = false;
        const waiting = delayForEvent(element, "transitionend").then(() => {
            resolved = true;
        });
        vi.advanceTimersByTime(19);
        yield Promise.resolve();
        expect(resolved).toBe(false);
        vi.advanceTimersByTime(1);
        yield waiting;
        expect(resolved).toBe(true);
    }));
    it("resolves after an explicit timeout when the event never arrives", () => __awaiter(void 0, void 0, void 0, function* () {
        let resolved = false;
        const waiting = delayForEvent(element, "transitionend", undefined, 75).then(() => {
            resolved = true;
        });
        vi.advanceTimersByTime(74);
        yield Promise.resolve();
        expect(resolved).toBe(false);
        vi.advanceTimersByTime(1);
        yield waiting;
        expect(resolved).toBe(true);
    }));
});
//# sourceMappingURL=delays.test.js.map