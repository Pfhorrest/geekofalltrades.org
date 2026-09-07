var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getDuration } from "../effects/helpers/getDuration";
import { fadeOut, fadeIn } from "../effects/fade/fadeEffects";
// Which subgallery entry each item most recently displayed, so the next
// call knows which entry comes next. A WeakMap means an item removed from
// the DOM won't keep this state (or itself) alive.
const currentEntryIndices = new WeakMap();
/**
 * Waits for the given number of milliseconds.
 *
 * @param milliseconds - How long to wait.
 *
 * @returns A promise that resolves after the delay.
 */
function delay(milliseconds) {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
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
 * Finds the elements within an item that the slideshow should fade and
 * change: its thumbnail image always, and its title and description too
 * unless the item is marked `.custom`.
 *
 * @param item - The `.gallery > .item` element to inspect.
 *
 * @returns The item's image, title, and description elements. Title and description are `null` for `.custom` items, or if genuinely absent.
 */
function findFadingElements(item) {
    const isCustom = item.classList.contains("custom");
    return {
        img: item.querySelector(":scope > img"),
        title: isCustom ? null : item.querySelector(":scope > .title"),
        description: isCustom
            ? null
            : item.querySelector(":scope > .description"),
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
 * Advances one gallery item's thumbnail, and, unless the item is `.custom`,
 * its title and description, to the next entry in its subgallery. Preloads
 * the next entry's image first, then fades the relevant elements out,
 * swaps their content while invisible, and fades them back in.
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
        const { img, title, description } = findFadingElements(item);
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
            title.textContent = nextEntry.title;
        if (description)
            description.textContent = nextEntry.description;
        for (const el of elementsToFade) {
            fadeIn(el, duration, false);
        }
        yield delay(duration);
    });
}
//# sourceMappingURL=changeGallerySlide.js.map