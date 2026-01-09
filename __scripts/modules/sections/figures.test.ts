import { describe, it, expect, beforeEach } from "vitest";
import { alternateFigures } from "./figures";

describe("alternateFigures", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("alternates --fig-index on figures inside sections", () => {
    document.body.innerHTML = `
      <section>
        <figure id="a"></figure>
        <figure id="b"></figure>
        <figure id="c"></figure>
      </section>
    `;

    alternateFigures();

    const a = document.getElementById("a")!;
    const b = document.getElementById("b")!;
    const c = document.getElementById("c")!;

    expect(a.style.getPropertyValue("--fig-index")).toBe("0");
    expect(b.style.getPropertyValue("--fig-index")).toBe("1");
    expect(c.style.getPropertyValue("--fig-index")).toBe("0");
  });

  it("ignores figures outside of sections", () => {
    document.body.innerHTML = `
      <figure id="outside"></figure>
      <section>
        <figure id="inside"></figure>
      </section>
    `;

    alternateFigures();

    const outside = document.getElementById("outside")!;
    const inside = document.getElementById("inside")!;

    expect(outside.style.getPropertyValue("--fig-index")).toBe("");
    expect(inside.style.getPropertyValue("--fig-index")).toBe("0");
  });
});
