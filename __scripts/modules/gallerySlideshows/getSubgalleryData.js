var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Cache and backoff state, keyed by the .item element that links to the
// subgallery. A WeakMap means an item removed from the DOM won't keep its
// state (or itself) alive.
const subgalleryState = new WeakMap();
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
export default function getSubgalleryData(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const state = subgalleryState.get(item);
        if (state && state.status === "loaded") {
            return state.entries;
        }
        if (state && state.status === "pending" && state.skipped < state.skip) {
            state.skipped += 1;
            return [];
        }
        try {
            const entries = yield fetchSubgalleryEntries(item);
            subgalleryState.set(item, { status: "loaded", entries });
            return entries;
        }
        catch (error) {
            const previousSkip = state && state.status === "pending" ? state.skip : 0;
            const skip = Math.max(1, previousSkip * 2);
            subgalleryState.set(item, { status: "pending", skip, skipped: 0 });
            console.error("Gallery slideshow: couldn't load a subgallery.", error);
            return [];
        }
    });
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
function linksToADifferentPage(link) {
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
function findSubgalleryLink(item) {
    const moreLink = item.querySelector(":scope > .more > a");
    if (moreLink) {
        return moreLink;
    }
    const coverLink = item.querySelector(":scope > a.cover");
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
function fetchSubgalleryEntries(item) {
    return __awaiter(this, void 0, void 0, function* () {
        const link = findSubgalleryLink(item);
        if (!link) {
            return [];
        }
        // Ensure a trailing slash, so relative paths within the fetched page
        // resolve against it as a directory rather than treating its last
        // segment as a filename to be dropped.
        const subgalleryUrl = link.href.endsWith("/") ? link.href : `${link.href}/`;
        const response = yield fetch(subgalleryUrl);
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText} fetching ${subgalleryUrl}`);
        }
        const html = yield response.text();
        return parseSubgalleryEntries(html, subgalleryUrl);
    });
}
/**
 * Parses fetched subgallery HTML into entries.
 *
 * @param html - The subgallery page's HTML, as fetched text (never loaded into the live DOM or given a chance to load its own resources).
 * @param baseUrl - The URL the HTML was fetched from, used to resolve any relative image paths it contains.
 *
 * @returns The parsed subgallery entries, in document order.
 */
function parseSubgalleryEntries(html, baseUrl) {
    // Belt and suspenders: ensure a trailing slash here too, in case this
    // function is ever called with a baseUrl from somewhere else.
    const directoryUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
    const doc = new DOMParser().parseFromString(html, "text/html");
    const items = doc.querySelectorAll(".gallery > .item");
    return Array.from(items).map((subItem) => {
        var _a, _b, _c, _d;
        var _e, _f, _g, _h;
        const img = subItem.querySelector(":scope > img");
        // A document created by DOMParser keeps *this* page's URL as its base,
        // not the URL it was fetched from, so reading `img.src` directly here
        // would resolve against the wrong page. Resolving the raw attribute
        // against directoryUrl ourselves gives the correct, absolute URL instead.
        const imgSrc = img
            ? new URL((_e = img.getAttribute("src")) !== null && _e !== void 0 ? _e : "", directoryUrl).href
            : "";
        return {
            // innerHTML, not textContent: a title like `Untitled <span class="maybe">
            // Bee</span>` needs that span to survive so it keeps its
            // styling. This document was never rendered, so innerText (which
            // depends on layout) isn't an option either way.
            title: (_f = (_b = (_a = subItem.querySelector(":scope > .title")) === null || _a === void 0 ? void 0 : _a.innerHTML) === null || _b === void 0 ? void 0 : _b.trim()) !== null && _f !== void 0 ? _f : "",
            description: (_g = (_d = (_c = subItem.querySelector(":scope > .description")) === null || _c === void 0 ? void 0 : _c.innerHTML) === null || _d === void 0 ? void 0 : _d.trim()) !== null && _g !== void 0 ? _g : "",
            imgSrc,
            imgAlt: (_h = img === null || img === void 0 ? void 0 : img.getAttribute("alt")) !== null && _h !== void 0 ? _h : "",
        };
    });
}
//# sourceMappingURL=getSubgalleryData.js.map