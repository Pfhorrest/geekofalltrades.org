/**
 * Watches for "off-screen" elements entering or leaving the viewport.
 * and toggles their "off-screen" class accordingly, triggering
 * appropriate CSS transitions from hidden to visible styles
 */
export const offScreenObserver = new IntersectionObserver(
  (entries: IntersectionObserverEntry[]) => {
    // Loop over all entries of elements entering or leaving the viewport
    // console.groupCollapsed("offScreenObserver called with entries:", entries);
    entries.forEach((entry) => {
      // If they've been marked as off-screen...
      // const elementName =
      //   entry.target.tagName.toLowerCase() +
      //   (entry.target.classList.length > 0
      //     ? "." + Array.from(entry.target.classList).join(".")
      //     : "") +
      //   (entry.target.id ? "#" + entry.target.id : "");
      // console.log(`${elementName}:`, entry.target);
      if (entry.target.classList.contains("off-screen")) {
        // console.log(`${elementName} is off-screen`);
        // ...and are now entering the viewport...
        if (entry.isIntersecting) {
          // console.log(`${elementName} is intersecting...`);
          // ...remove the "off-screen" class, triggering the animation-in
          // console.log(`so removing 'off-screen' from ${elementName}`);
          entry.target.classList.remove("off-screen");
        }
        // But If they're not marked as off-screen...
      } else {
        // console.log(`${elementName} is not off-screen`);
        // ...and they're leaving the viewport...
        if (!entry.isIntersecting) {
          // console.log(`${elementName} is not intersecting...`);
          // ...add the "off-screen" class, triggering the animation-out
          // console.log(`so adding 'off-screen' to ${elementName}`);
          entry.target.classList.add("off-screen");
        }
      }
    });
  }
);
