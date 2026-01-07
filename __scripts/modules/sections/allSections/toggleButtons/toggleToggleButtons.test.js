import { describe, it, expect, beforeEach } from "vitest";
import { toggleToggleButtons } from "./toggleToggleButtons";
const setupButtons = () => {
    document.body.innerHTML += `
    <button class="expandAll disabled"></button>
    <button class="collapseAll disabled"></button>
    <button class="anchorTarget disabled"></button>
  `;
};
const setupSections = (states) => {
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
const setHash = (hash) => {
    history.replaceState(null, "", hash);
};
describe("toggleToggleButtons", () => {
    beforeEach(() => {
        document.body.innerHTML = "";
        history.replaceState(null, "", "/");
    });
    describe("expand / collapse all buttons", () => {
        it("enables expandAll when any section is collapsed", () => {
            var _a, _b;
            setupButtons();
            setupSections(["collapsed", "expanded"]);
            toggleToggleButtons();
            expect((_a = document.querySelector(".expandAll")) === null || _a === void 0 ? void 0 : _a.classList.contains("disabled")).toBe(false);
            expect((_b = document.querySelector(".collapseAll")) === null || _b === void 0 ? void 0 : _b.classList.contains("disabled")).toBe(false);
        });
        it("disables expandAll when all sections are expanded", () => {
            var _a, _b;
            setupButtons();
            setupSections(["expanded", "expanded"]);
            toggleToggleButtons();
            expect((_a = document.querySelector(".expandAll")) === null || _a === void 0 ? void 0 : _a.classList.contains("disabled")).toBe(true);
            expect((_b = document.querySelector(".collapseAll")) === null || _b === void 0 ? void 0 : _b.classList.contains("disabled")).toBe(false);
        });
        it("disables collapseAll when all sections are collapsed", () => {
            var _a, _b;
            setupButtons();
            setupSections(["collapsed", "collapsed"]);
            toggleToggleButtons();
            expect((_a = document.querySelector(".expandAll")) === null || _a === void 0 ? void 0 : _a.classList.contains("disabled")).toBe(false);
            expect((_b = document.querySelector(".collapseAll")) === null || _b === void 0 ? void 0 : _b.classList.contains("disabled")).toBe(true);
        });
        it("disables both buttons when no sections exist", () => {
            var _a, _b;
            setupButtons();
            toggleToggleButtons();
            expect((_a = document.querySelector(".expandAll")) === null || _a === void 0 ? void 0 : _a.classList.contains("disabled")).toBe(true);
            expect((_b = document.querySelector(".collapseAll")) === null || _b === void 0 ? void 0 : _b.classList.contains("disabled")).toBe(true);
        });
    });
    describe("anchorTarget with no hash", () => {
        it("disables anchorTarget and clears its label", () => {
            setupButtons();
            setupSections(["expanded"]);
            toggleToggleButtons();
            const anchorTarget = document.querySelector(".anchorTarget");
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
            const anchorTarget = document.querySelector(".anchorTarget");
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
            const anchorTarget = document.querySelector(".anchorTarget");
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
            const anchorTarget = document.querySelector(".anchorTarget");
            expect(anchorTarget.classList.contains("disabled")).toBe(true);
            expect(anchorTarget.textContent).toBe("Already Visible");
        });
        it("treats a missing anchor as no hash", () => {
            setupButtons();
            setupSections(["collapsed"]);
            setHash("#does-not-exist");
            toggleToggleButtons();
            const anchorTarget = document.querySelector(".anchorTarget");
            expect(anchorTarget.classList.contains("disabled")).toBe(true);
            expect(anchorTarget.textContent).toBe("\u00A0");
        });
    });
});
//# sourceMappingURL=toggleToggleButtons.test.js.map