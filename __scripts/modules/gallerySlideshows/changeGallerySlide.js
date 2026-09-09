var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDuration, delay } from "../effects/helpers/helpers";
import { fadeOut, fadeIn } from "../effects/fade/fadeEffects";
// Which subgallery entry each item most recently displayed, so the next
// call knows which entry comes next. A WeakMap means an item removed from
// the DOM won't keep this state (or itself) alive.
const currentEntryIndices = new WeakMap();
/**
 * Preloads an image so that swapping an `<img>`'s src to it won't leave it
 * visibly blank or half-loaded while it fades back in. Resolves once
 * loading has settled, one way or the other, so a broken link can't hang
 * the slideshow indefinitely.
 *
 * @param src - The image URL to preload.
 *
 * @returns A promise that resolves once the image has either loaded or failed.
 */
function preloadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
    });
}
/**
 * Encodes a value for use in the cover link's query string, leaving `/`
 * unescaped and spaces as `+` (both safe within a URL's query component),
 * everything else percent-encoded as usual.
 *
 * @param value - The raw value to encode.
 *
 * @returns The encoded value, ready to appear after a `=` in a query string.
 */
function encodeCoverQueryValue(value) {
    return encodeURIComponent(value).replace(/%2F/g, "/").replace(/%20/g, "+");
}
/**
 * Finds the elements within an item that the slideshow should touch: its
 * thumbnail image always, and, only if the item has its own `.more` link,
 * its title, description, and cover link. Items without a `.more` link are
 * being cycled via their cover link instead (see getSubgalleryData), so
 * that link is left alone rather than overwritten with lightbox-style
 * `display`/`title` data it was never meant to hold.
 *
 * @param item - The `.gallery > .item` element to inspect.
 *
 * @returns The item's image, title, description, and cover elements. Title, description, and cover are `null` for items with no `.more` link, or if genuinely absent.
 */
function findItemElements(item) {
    const hasMoreLink = item.querySelector(":scope > .more > a") !== null;
    return {
        img: item.querySelector(":scope > img"),
        title: hasMoreLink
            ? item.querySelector(":scope > .title")
            : null,
        description: hasMoreLink
            ? item.querySelector(":scope > .description")
            : null,
        cover: hasMoreLink
            ? item.querySelector(":scope > a.cover")
            : null,
    };
}
/**
 * Works out the next subgallery entry to show for an item, advancing (and
 * wrapping around) its stored position in the entry array.
 *
 * @param item - The `.gallery > .item` element being advanced.
 * @param subgalleryEntries - The item's subgallery entries, in display order.
 *
 * @returns The entry to display next.
 */
function getNextEntry(item, subgalleryEntries) {
    var _a;
    const previousIndex = (_a = currentEntryIndices.get(item)) !== null && _a !== void 0 ? _a : -1;
    const nextIndex = (previousIndex + 1) % subgalleryEntries.length;
    currentEntryIndices.set(item, nextIndex);
    return subgalleryEntries[nextIndex];
}
/**
 * Advances one gallery item's thumbnail, and, if the item has its own
 * `.more` link, its title, description, and cover link, to the next entry
 * in its subgallery. Preloads the next entry's image first, then fades the
 * relevant elements out, swaps their content while invisible, waits for
 * the live image to finish decoding, and fades everything back in.
 *
 * @param item - The `.gallery > .item` element to advance.
 * @param subgalleryEntries - The item's subgallery entries, as returned by getSubgalleryData, in display order.
 *
 * @returns A promise that resolves once preloading, the fade-out, the content swap, and the fade-in have all completed. Resolves immediately if there are no entries to show or no elements to change.
 */
export default function changeGallerySlide(item, subgalleryEntries) {
    return __awaiter(this, void 0, void 0, function* () {
        if (subgalleryEntries.length === 0) {
            return;
        }
        const { img, title, description, cover } = findItemElements(item);
        const elementsToFade = [img, title, description].filter((el) => el !== null);
        if (elementsToFade.length === 0) {
            return;
        }
        const nextEntry = getNextEntry(item, subgalleryEntries);
        const duration = getDuration(item);
        if (img && nextEntry.imgSrc) {
            yield preloadImage(nextEntry.imgSrc);
        }
        // manageDisplay=false on both: these elements need to stay in the
        // layout flow while "hidden," not be pulled out via display:none.
        for (const el of elementsToFade) {
            fadeOut(el, duration, false);
        }
        yield delay(duration);
        if (img) {
            img.src = nextEntry.imgSrc;
            img.alt = nextEntry.imgAlt;
        }
        if (title)
            title.innerHTML = nextEntry.title;
        if (description)
            description.innerHTML = nextEntry.description;
        if (cover && nextEntry.fullImageSrc) {
            // Keep the lightbox link in sync with what's now on screen, so
            // clicking the thumbnail doesn't open the image/title that used to be
            // there before the slideshow moved on.
            const displayValue = encodeCoverQueryValue(nextEntry.fullImageSrc);
            const titleValue = encodeCoverQueryValue(nextEntry.coverTitle);
            cover.href = `?display=${displayValue}&title=${titleValue}`;
        }
        if (img) {
            // Preloading gets the bytes into cache, but assigning a src to *this*
            // element still requires the browser to decode and composite it for
            // this specific element, which can take a beat even from cache. decode()
            // resolves once that's genuinely finished, so waiting for it here is
            // what actually guarantees the fade-in never catches the element still
            // showing the previous image. A decode failure (e.g. a broken link)
            // shouldn't stall the slideshow, so it's swallowed rather than awaited
            // as a hard requirement.
            yield img.decode().catch(() => { });
        }
        for (const el of elementsToFade) {
            fadeIn(el, duration, false);
        }
        yield delay(duration);
    });
}
//# sourceMappingURL=changeGallerySlide.js.map