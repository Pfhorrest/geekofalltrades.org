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

  it("resolves after the requested number of milliseconds", async () => {
    let resolved = false;
    const waiting = delay(250).then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(249);
    await Promise.resolve();
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(1);
    await waiting;
    expect(resolved).toBe(true);
  });
});

describe("delayForEvent", () => {
  let element: HTMLElement;

  beforeEach(() => {
    vi.useFakeTimers();
    element = document.createElement("div");
    element.style.setProperty("--dur", "10ms");
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  function transitionEvent(propertyName: string): Event {
    const event = new Event("transitionend");
    Object.defineProperty(event, "propertyName", { value: propertyName });
    return event;
  }

  it("resolves only when the event meets the supplied condition", async () => {
    let resolved = false;
    const waiting = delayForEvent(
      element,
      "transitionend",
      (event) => event.propertyName === "height",
      100,
    ).then(() => {
      resolved = true;
    });

    element.dispatchEvent(transitionEvent("opacity"));
    await Promise.resolve();
    expect(resolved).toBe(false);

    element.dispatchEvent(transitionEvent("height"));
    await waiting;
    expect(resolved).toBe(true);
  });

  it("resolves on the first matching event when no condition is supplied", async () => {
    const waiting = delayForEvent(element, "click", undefined, 100);

    element.dispatchEvent(new MouseEvent("click"));

    await expect(waiting).resolves.toBeUndefined();
  });

  it("uses twice the element duration as its default timeout", async () => {
    let resolved = false;
    const waiting = delayForEvent(element, "transitionend").then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(19);
    await Promise.resolve();
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(1);
    await waiting;
    expect(resolved).toBe(true);
  });

  it("resolves after an explicit timeout when the event never arrives", async () => {
    let resolved = false;
    const waiting = delayForEvent(element, "transitionend", undefined, 75).then(() => {
      resolved = true;
    });

    vi.advanceTimersByTime(74);
    await Promise.resolve();
    expect(resolved).toBe(false);

    vi.advanceTimersByTime(1);
    await waiting;
    expect(resolved).toBe(true);
  });
});
