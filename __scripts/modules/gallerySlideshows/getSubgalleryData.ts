/**
 * One entry parsed out of a linked subgallery: the display markup and
 * image data needed to show it as a gallery item's thumbnail.
 */
export interface SubgalleryEntry {
  /** The item's title, as HTML — it may contain inline markup such as `<span class="maybe">`, so apply it via `innerHTML`, not `textContent`. */
  title: string;
  /** The item's description, as HTML (see `title`). */
  description: string;
  imgSrc: string;
  imgAlt: string;
  /** Absolute URL of the item's full-size image, from its cover link's `display` param — needed to keep a cycled item's own cover link in sync. */
  fullImageSrc: string;
  /** Plain-text title from the item's cover link's `title` param — kept separate from `title` above, which is HTML and not suitable for a query string. */
  coverTitle: string;
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
 * Retrieves the subgallery entries linked from a gallery item. The first
 * successful call for a given item fetches and parses the linked page and
 * caches the result for every later call. If a fetch fails, later calls
 * skip re-attempting for a number of cycles that doubles after each
 * further failure, to avoid hammering a broken link.
 *
 * @param item - The `.gallery > .item` element whose linked subgallery should be read.
 *
 * @returns A promise resolving to the item's subgallery entries, in the order they appear on the linked page. Resolves to an empty array if the item has no usable link to a subgallery, if a fetch attempt is currently being skipped for backoff, or if the fetch fails.
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
 * Checks whether a link's resolved destination is a different page from
 * the one currently loaded, as opposed to a same-page lightbox reference
 * like `?display=...&title=...`. Fetching a same-page link would just
 * re-fetch the page this script is already running on.
 *
 * @param link - The anchor element to check.
 *
 * @returns True if the link's resolved pathname differs from the current page's.
 */
function linksToADifferentPage(link: HTMLAnchorElement): boolean {
  return link.pathname !== location.pathname;
}

/**
 * Finds the link a gallery item's subgallery should be fetched from: its
 * `.more` link if it has one, or its cover link if that leads to a
 * genuinely different page rather than a same-page lightbox reference.
 *
 * @param item - The `.gallery > .item` element to inspect.
 *
 * @returns The anchor to fetch the subgallery from, or null if the item has neither a usable `.more` link nor a cover link that leads anywhere new.
 */
function findSubgalleryLink(item: HTMLElement): HTMLAnchorElement | null {
  const moreLink = item.querySelector<HTMLAnchorElement>(":scope > .more > a");
  if (moreLink) {
    return moreLink;
  }

  const coverLink = item.querySelector<HTMLAnchorElement>(":scope > a.cover");
  if (coverLink && linksToADifferentPage(coverLink)) {
    return coverLink;
  }

  return null;
}

/**
 * Fetches and parses the subgallery linked from an item.
 *
 * @param item - The `.gallery > .item` element whose linked subgallery should be fetched.
 *
 * @returns A promise resolving to the parsed subgallery entries. Resolves to an empty array only if the item has no link to follow, or if the linked page genuinely contains no gallery items — a failed fetch or non-OK response throws instead, so the caller can tell the difference and apply backoff.
 */
async function fetchSubgalleryEntries(
  item: HTMLElement,
): Promise<SubgalleryEntry[]> {
  const link = findSubgalleryLink(item);
  if (!link) {
    return [];
  }

  // Ensure a trailing slash, so relative paths within the fetched page
  // resolve against it as a directory rather than treating its last
  // segment as a filename to be dropped.
  const subgalleryUrl = link.href.endsWith("/") ? link.href : `${link.href}/`;

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
 * @param baseUrl - The URL the HTML was fetched from, used to resolve any relative image and cover-link paths it contains.
 *
 * @returns The parsed subgallery entries, in document order.
 */
function parseSubgalleryEntries(
  html: string,
  baseUrl: string,
): SubgalleryEntry[] {
  // Belt and suspenders: ensure a trailing slash here too, in case this
  // function is ever called with a baseUrl from somewhere else.
  const directoryUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const doc = new DOMParser().parseFromString(html, "text/html");
  const items = doc.querySelectorAll<HTMLElement>(".gallery > .item");

  return Array.from(items).map((subItem) => {
    const img = subItem.querySelector<HTMLImageElement>(":scope > img");
    // A document created by DOMParser keeps *this* page's URL as its base,
    // not the URL it was fetched from, so reading `img.src` directly here
    // would resolve against the wrong page. Resolving the raw attribute
    // against directoryUrl ourselves gives the correct, absolute URL instead.
    const imgSrc = img
      ? new URL(img.getAttribute("src") ?? "", directoryUrl).href
      : "";

    // The cover link's "display" param names the full-size image (not the
    // thumbnail) and its "title" param is the plain-text title, both
    // needed to keep this item's own cover link in sync once it's cycled
    // in elsewhere. Read via the raw attribute for the same base-URI
    // reason as the img src above, not the live-resolved .href/.search.
    const cover = subItem.querySelector<HTMLAnchorElement>(":scope > a.cover");
    const coverParams = cover
      ? new URL(cover.getAttribute("href") ?? "", directoryUrl).searchParams
      : null;
    const rawDisplayPath = coverParams?.get("display") ?? "";
    const fullImageSrc = rawDisplayPath
      ? new URL(rawDisplayPath, directoryUrl).href
      : "";
    const coverTitle = coverParams?.get("title") ?? "";

    return {
      // innerHTML, not textContent: a title like `Untitled <span class="maybe">
      // Bee</span>` needs that span to survive so it keeps its
      // styling. This document was never rendered, so innerText (which
      // depends on layout) isn't an option either way.
      title: subItem.querySelector(":scope > .title")?.innerHTML?.trim() ?? "",
      description:
        subItem.querySelector(":scope > .description")?.innerHTML?.trim() ?? "",
      imgSrc,
      imgAlt: img?.getAttribute("alt") ?? "",
      fullImageSrc,
      coverTitle,
    };
  });
}
