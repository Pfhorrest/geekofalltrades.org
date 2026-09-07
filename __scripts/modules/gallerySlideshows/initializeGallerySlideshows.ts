import { getDuration } from "../effects/helpers/getDuration";
import getSubgalleryData from "./getSubgalleryData";
import changeGallerySlide from "./changeGallerySlide";

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
 * Checks whether reduced motion should currently be honored, either because
 * the page has explicitly flagged it or because the browser reports the
 * user's OS-level preference for it.
 *
 * @returns True if the slideshow should be paused for reduced motion.
 */
function isReducedMotionPreferred(): boolean {
  return (
    document.documentElement.dataset.reducedMotion === "yes" ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Waits out the pacing delay before the loop's next step, then, if reduced
 * motion is preferred, keeps waiting the same delay on repeat until it no
 * longer is.
 *
 * @param firstItem - The first cycling gallery item, whose `--dur` sets the pacing for every step.
 *
 * @returns A promise that resolves once the pacing delay has elapsed and reduced motion is not (or is no longer) preferred.
 */
async function waitForNextStep(firstItem: HTMLElement): Promise<void> {
  do {
    await delay(getDuration(firstItem) * 4);
  } while (isReducedMotionPreferred());
}

/**
 * Runs the slideshow loop indefinitely, advancing one item per step. Each
 * step's pacing delay and its subgallery fetch (cached after the first
 * successful attempt) run concurrently, so a slow or first-time fetch
 * doesn't add its full duration on top of the pacing floor.
 *
 * @param items - Every cycling gallery item, in the order they should be cycled.
 *
 * @returns A promise that never resolves under normal operation; the loop runs for the lifetime of the page.
 */
async function runSlideshowLoop(items: HTMLElement[]): Promise<void> {
  const firstItem = items[0];
  let index = 0;

  while (true) {
    const item = items[index];

    const [, subgalleryEntries] = await Promise.all([
      waitForNextStep(firstItem),
      getSubgalleryData(item),
    ]);

    if (subgalleryEntries.length > 0) {
      await changeGallerySlide(item, subgalleryEntries);
    }

    index = (index + 1) % items.length;
  }
}

/**
 * Sets up the gallery thumbnail slideshow: continuously cycles the
 * thumbnail, and, if the item has a `.more link`, the title and description,
 * of one `.gallery > .item` at a time through the entries in that item's
 * linked subgallery. Pauses indefinitely whenever reduced motion is
 * preferred, and does nothing if no gallery item links to a subgallery.
 *
 * @returns Nothing. The slideshow loop runs indefinitely in the background once started.
 */
export function initializeGallerySlideshows(): void {
  const items = Array.from(
    document.querySelectorAll<HTMLElement>(".gallery > .item:has(img)"),
  );
  if (items.length === 0) {
    return;
  }

  void runSlideshowLoop(items);
}
