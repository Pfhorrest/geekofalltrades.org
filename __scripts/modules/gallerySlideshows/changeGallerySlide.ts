import { getDuration } from "../effects/helpers/getDuration";
import { fadeOut, fadeIn } from "../effects/fade/fadeEffects";
import type { SubgalleryEntry } from "./getSubgalleryData";

// Which subgallery entry each item most recently displayed, so the next
// call knows which entry comes next. A WeakMap means an item removed from
// the DOM won't keep this state (or itself) alive.
const currentEntryIndices = new WeakMap<HTMLElement, number>();

/**
 * Waits for the given number of milliseconds.
 *
 * @param milliseconds - How long to wait.
 *
 * @returns A promise that resolves after the delay.
 */
function delay(milliseconds: number): Promise<void> {
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
function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

interface FadingElements {
  img: HTMLImageElement | null;
  title: HTMLElement | null;
  description: HTMLElement | null;
}

/**
 * Finds the elements within an item that the slideshow should fade and
 * change: its thumbnail image always, and its title and description too
 * only if the item has its own `.more` link. Items without one are being
 * cycled via their cover link instead, and keep their existing title and
 * description untouched.
 *
 * @param item - The `.gallery > .item` element to inspect.
 *
 * @returns The item's image, title, and description elements. Title and description are `null` for items with no `.more` link, or if genuinely absent.
 */
function findFadingElements(item: HTMLElement): FadingElements {
  const hasMoreLink = item.querySelector(":scope > .more > a") !== null;
  return {
    img: item.querySelector<HTMLImageElement>(":scope > img"),
    title: hasMoreLink
      ? item.querySelector<HTMLElement>(":scope > .title")
      : null,
    description: hasMoreLink
      ? item.querySelector<HTMLElement>(":scope > .description")
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
function getNextEntry(
  item: HTMLElement,
  subgalleryEntries: SubgalleryEntry[],
): SubgalleryEntry {
  const previousIndex = currentEntryIndices.get(item) ?? -1;
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
export default async function changeGallerySlide(
  item: HTMLElement,
  subgalleryEntries: SubgalleryEntry[],
): Promise<void> {
  if (subgalleryEntries.length === 0) {
    return;
  }

  const { img, title, description } = findFadingElements(item);
  const elementsToFade = [img, title, description].filter(
    (el): el is HTMLElement => el !== null,
  );
  if (elementsToFade.length === 0) {
    return;
  }

  const nextEntry = getNextEntry(item, subgalleryEntries);
  const duration = getDuration(item);

  if (img && nextEntry.imgSrc) {
    await preloadImage(nextEntry.imgSrc);
  }

  // manageDisplay=false on both: these elements need to stay in the
  // layout flow while "hidden," not be pulled out via display:none.
  for (const el of elementsToFade) {
    fadeOut(el, duration, false);
  }
  await delay(duration);

  if (img) {
    img.src = nextEntry.imgSrc;
    img.alt = nextEntry.imgAlt;
  }
  if (title) title.innerHTML = nextEntry.title;
  if (description) description.innerHTML = nextEntry.description;

  for (const el of elementsToFade) {
    fadeIn(el, duration, false);
  }
  await delay(duration);
}
