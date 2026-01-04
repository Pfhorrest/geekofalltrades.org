import { describe, it, expect, beforeEach } from "vitest";
import { highlightCurrent } from "./navigation";

describe("highlightCurrent", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    Object.defineProperty(window, "location", {
      writable: true,
      value: { href: "https://example.com/" },
    });
  });

  const setupNav = (links: string[]) => {
    const header = document.createElement("header");
    const nav = document.createElement("nav");
    const ul = document.createElement("ul");

    links.forEach((href) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = href;
      a.textContent = href;
      li.appendChild(a);
      ul.appendChild(li);
    });

    nav.appendChild(ul);
    header.appendChild(nav);
    document.body.appendChild(header);

    return ul.querySelectorAll("li");
  };

  it("marks the matching nav item as current", () => {
    window.location.href = "https://example.com/photos/2025/";

    const items = setupNav([
      "https://example.com/photos/2025/",
      "https://example.com/about/",
    ]);

    highlightCurrent();

    expect(items[0].classList.contains("current")).toBe(true);
    expect(items[1].classList.contains("current")).toBe(false);
  });

  it("ignores trailing slashes when matching", () => {
    window.location.href = "https://example.com/photos";

    const items = setupNav([
      "https://example.com/",
      "https://example.com/photos/",
    ]);

    highlightCurrent();

    expect(items[1].classList.contains("current")).toBe(true);
  });

  it("matches parent paths using startsWith", () => {
    window.location.href = "https://example.com/photos/2025/03/";

    const items = setupNav([
      "https://example.com/",
      "https://example.com/photos/",
      "https://example.com/photos/2024/",
    ]);

    highlightCurrent();

    expect(items[0].classList.contains("current")).toBe(true);
    expect(items[1].classList.contains("current")).toBe(true);
    expect(items[2].classList.contains("current")).toBe(false);
  });

  it("does nothing if no header nav exists", () => {
    expect(() => highlightCurrent()).not.toThrow();
  });
});
