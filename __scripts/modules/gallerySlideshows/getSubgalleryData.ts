/**
 * One entry parsed out of a linked subgallery: the display text and image
 * data needed to show it as a gallery item's thumbnail.
 */
export interface SubgalleryEntry {
  title: string;
  description: string;
  imgSrc: string;
  imgAlt: string;
}

/** An item whose subgallery hasn't loaded yet, possibly backing off after a failed attempt. */
interface PendingState {
  status: "pending";
  skip: number;
  skipped: number;
}

/** An item whose subgallery has been fetched and parsed, successfully or as a confirmed empty result. */
interface LoadedState {
  status: "loaded";
  entries: SubgalleryEntry[];
}

type SubgalleryState = PendingState | LoadedState;

// Cache and backoff state, keyed by the .item element that links to the
// subgallery. A WeakMap means an item removed from the DOM won't keep its
// state (or itself) alive.
const subgalleryState = new WeakMap<HTMLElement, SubgalleryState>();

/**
 * Retrieves the subgallery entries linked from a gallery item's `.more`
 * link. The first successful call for a given item fetches and parses the
 * linked page and caches the result for every later call. If a fetch
 * fails, later calls skip re-attempting for a number of cycles that
 * doubles after each further failure, to avoid hammering a broken link.
 *
 * @param item - The `.gallery > .item` element whose linked subgallery should be read.
 *
 * @returns A promise resolving to the item's subgallery entries, in the order they appear on the linked page. Resolves to an empty array if the item has no usable `.more` link, if a fetch attempt is currently being skipped for backoff, or if the fetch fails.
 */
export default async function getSubgalleryData(
  item: HTMLElement,
): Promise<SubgalleryEntry[]> {
  const state = subgalleryState.get(item);

  if (state && state.status === "loaded") {
    return state.entries;
  }

  if (state && state.status === "pending" && state.skipped < state.skip) {
    state.skipped += 1;
    return [];
  }

  try {
    const entries = await fetchSubgalleryEntries(item);
    subgalleryState.set(item, { status: "loaded", entries });
    return entries;
  } catch (error) {
    const previousSkip = state && state.status === "pending" ? state.skip : 0;
    const skip = Math.max(1, previousSkip * 2);
    subgalleryState.set(item, { status: "pending", skip, skipped: 0 });
    console.error("Gallery slideshow: couldn't load a subgallery.", error);
    return [];
  }
}

/**
 * Fetches and parses the subgallery linked from an item's `.more` link.
 *
 * @param item - The `.gallery > .item` element whose linked subgallery should be fetched.
 *
 * @returns A promise resolving to the parsed subgallery entries. Resolves to an empty array only if the item has no `.more` link to follow, or if the linked page genuinely contains no gallery items — a failed fetch or non-OK response throws instead, so the caller can tell the difference and apply backoff.
 */
async function fetchSubgalleryEntries(
  item: HTMLElement,
): Promise<SubgalleryEntry[]> {
  const moreLink = item.querySelector<HTMLAnchorElement>(":scope > .more > a");
  if (!moreLink) {
    return [];
  }

  // Read the resolved URL from the live anchor (`.href`, not
  // `getAttribute('href')`) so a relative link resolves against *this*
  // page, exactly as the browser would if the link were clicked.
  const subgalleryUrl = moreLink.href.endsWith("/") ? moreLink.href : `${moreLink.href}/`;

  const response = await fetch(subgalleryUrl);
  if (!response.ok) {
    throw new Error(
      `${response.status} ${response.statusText} fetching ${subgalleryUrl}`,
    );
  }
  const html = await response.text();
  return parseSubgalleryEntries(html, subgalleryUrl);
}

/**
 * Parses fetched subgallery HTML into entries.
 *
 * @param html - The subgallery page's HTML, as fetched text (never loaded into the live DOM or given a chance to load its own resources).
 * @param baseUrl - The URL the HTML was fetched from, used to resolve any relative image paths it contains.
 *
 * @returns The parsed subgallery entries, in document order.
 */
function parseSubgalleryEntries(
  html: string,
  baseUrl: string,
): SubgalleryEntry[] {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const items = doc.querySelectorAll<HTMLElement>(".gallery > .item");

  return Array.from(items).map((subItem) => {
    const img = subItem.querySelector<HTMLImageElement>(":scope > img");
    // A document created by DOMParser keeps *this* page's URL as its base,
    // not the URL it was fetched from, so reading `img.src` directly here
    // would resolve against the wrong page. Resolving the raw attribute
    // against baseUrl ourselves gives the correct, absolute URL instead.
    console.log("baseUrl", baseUrl);
    if (img) console.log("img src attr", img.getAttribute("src"));
    const imgSrc = img
      ? new URL(
          img.getAttribute("src") ?? "",
          baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`,
        ).href
      : "";

    return {
      // textContent, not innerText: this document was never inserted into
      // a rendered page, and innerText depends on layout, so it would
      // silently come back empty here.
      title:
        subItem.querySelector(":scope > .title")?.textContent?.trim() ?? "",
      description:
        subItem.querySelector(":scope > .description")?.textContent?.trim() ??
        "",
      imgSrc,
      imgAlt: img?.getAttribute("alt") ?? "",
    };
  });
}
