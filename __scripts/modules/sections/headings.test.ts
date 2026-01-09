import { describe, it, expect, beforeEach, vi } from "vitest";
import { toggleSection } from "./someSection/someSection";
import { hydrateSectionHeadings } from "./headings";

vi.mock("./someSection/someSection", () => ({
  toggleSection: vi.fn(),
}));

describe("hydrateSectionHeadings", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = "";
  });

  it("hydrates headings of sections with non-heading content", () => {
    document.body.innerHTML = `
      <section id="a">
        <h2>A</h2>
        <p>Content</p>
      </section>
    `;

    hydrateSectionHeadings();

    const heading = document.querySelector("h2")!;
    const section = document.querySelector("section")!;

    expect(heading.role).toBe("button");
    expect(heading.title).toBe("Collapse section");
    expect(heading.ariaExpanded).toBe("true");
    expect(heading.style.cursor).toBe("pointer");

    expect(section.classList.contains("toggleable")).toBe(true);
  });

  it("does not hydrate sections with only headings/descriptions", () => {
    document.body.innerHTML = `
      <section>
        <h2>Heading</h2>
        <p class="description">Description</p>
      </section>
    `;

    hydrateSectionHeadings();

    const heading = document.querySelector("h2")!;
    const section = document.querySelector("section")!;

    expect(heading.role).not.toBe("button");
    expect(section.classList.contains("toggleable")).toBe(false);
  });

  it("toggles section when heading is clicked", () => {
    document.body.innerHTML = `
      <section>
        <h2>Heading</h2>
        <div>Content</div>
      </section>
    `;

    hydrateSectionHeadings();

    const heading = document.querySelector("h2")!;
    heading.click();

    expect(toggleSection).toHaveBeenCalledOnce();
    expect(toggleSection).toHaveBeenCalledWith(heading);
  });
});
