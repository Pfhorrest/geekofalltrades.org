import { describe, it, expect, beforeEach } from "vitest";
import { toggleToggleButtons } from "./toggleToggleButtons";

const setupButtons = () => {
  document.body.innerHTML += `
    <button class="expandAll disabled"></button>
    <button class="collapseAll disabled"></button>
    <button class="anchorTarget disabled"></button>
  `;
};

const setupSections = (states: ("collapsed" | "expanded")[]) => {
  states.forEach((state, i) => {
    const section = document.createElement("section");
    section.classList.add("toggleable");
    if (state === "collapsed") {
      section.classList.add("collapsed");
    }
    section.id = `section-${i}`;
    document.body.appendChild(section);
  });
};

const setHash = (hash: string) => {
  history.replaceState(null, "", hash);
};

describe("toggleToggleButtons", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    history.replaceState(null, "", "/");
  });

  describe("expand / collapse all buttons", () => {
    it("enables expandAll when any section is collapsed", () => {
      setupButtons();
      setupSections(["collapsed", "expanded"]);

      toggleToggleButtons();

      expect(
        document.querySelector(".expandAll")?.classList.contains("disabled")
      ).toBe(false);
      expect(
        document.querySelector(".collapseAll")?.classList.contains("disabled")
      ).toBe(false);
    });

    it("disables expandAll when all sections are expanded", () => {
      setupButtons();
      setupSections(["expanded", "expanded"]);

      toggleToggleButtons();

      expect(
        document.querySelector(".expandAll")?.classList.contains("disabled")
      ).toBe(true);
      expect(
        document.querySelector(".collapseAll")?.classList.contains("disabled")
      ).toBe(false);
    });

    it("disables collapseAll when all sections are collapsed", () => {
      setupButtons();
      setupSections(["collapsed", "collapsed"]);

      toggleToggleButtons();

      expect(
        document.querySelector(".expandAll")?.classList.contains("disabled")
      ).toBe(false);
      expect(
        document.querySelector(".collapseAll")?.classList.contains("disabled")
      ).toBe(true);
    });

    it("disables both buttons when no sections exist", () => {
      setupButtons();

      toggleToggleButtons();

      expect(
        document.querySelector(".expandAll")?.classList.contains("disabled")
      ).toBe(true);
      expect(
        document.querySelector(".collapseAll")?.classList.contains("disabled")
      ).toBe(true);
    });
  });

  describe("anchorTarget with no hash", () => {
    it("disables anchorTarget and clears its label", () => {
      setupButtons();
      setupSections(["expanded"]);

      toggleToggleButtons();

      const anchorTarget = document.querySelector<HTMLElement>(".anchorTarget")!;
      expect(anchorTarget.classList.contains("disabled")).toBe(true);
      expect(anchorTarget.textContent).toBe("\u00A0");
    });
  });

  describe("anchorTarget with hash", () => {
    it("enables when anchor is inside a collapsed section", () => {
      setupButtons();

      const section = document.createElement("section");
      section.classList.add("toggleable", "collapsed");
      section.innerHTML = `<div id="target"><h2>Target Heading</h2></div>`;
      document.body.appendChild(section);

      setHash("#target");

      toggleToggleButtons();

      const anchorTarget = document.querySelector<HTMLElement>(".anchorTarget")!;
      expect(anchorTarget.classList.contains("disabled")).toBe(false);
      expect(anchorTarget.textContent).toBe("Target Heading");
    });

    it("enables when other collapsed sections exist", () => {
      setupButtons();

      const collapsed = document.createElement("section");
      collapsed.classList.add("toggleable", "collapsed");
      document.body.appendChild(collapsed);

      const expanded = document.createElement("section");
      expanded.classList.add("toggleable");
      expanded.innerHTML = `<div id="target"><h2>Visible Heading</h2></div>`;
      document.body.appendChild(expanded);

      setHash("#target");

      toggleToggleButtons();

      const anchorTarget = document.querySelector<HTMLElement>(".anchorTarget")!;
      expect(anchorTarget.classList.contains("disabled")).toBe(true);
      expect(anchorTarget.textContent).toBe("Visible Heading");
    });

    it("disables when all sections are expanded and anchor is visible", () => {
      setupButtons();

      const section = document.createElement("section");
      section.classList.add("toggleable");
      section.innerHTML = `<div id="target"><h2>Already Visible</h2></div>`;
      document.body.appendChild(section);

      setHash("#target");

      toggleToggleButtons();

      const anchorTarget = document.querySelector<HTMLElement>(".anchorTarget")!;
      expect(anchorTarget.classList.contains("disabled")).toBe(true);
      expect(anchorTarget.textContent).toBe("Already Visible");
    });

    it("treats a missing anchor as no hash", () => {
      setupButtons();
      setupSections(["collapsed"]);

      setHash("#does-not-exist");

      toggleToggleButtons();

      const anchorTarget = document.querySelector<HTMLElement>(".anchorTarget")!;
      expect(anchorTarget.classList.contains("disabled")).toBe(true);
      expect(anchorTarget.textContent).toBe("\u00A0");
    });
  });
});
