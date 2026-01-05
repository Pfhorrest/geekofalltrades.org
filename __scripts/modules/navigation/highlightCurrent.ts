/**
 *  Highlights the current navigation item based on the URL
 *
 *  @returns {void}
 */
export const highlightCurrent = (): void => {
  // console.log("highlighting current link...");
  const items = document.querySelectorAll<HTMLElement>("header > nav ul > li");
  items.forEach((item) => {
    const link = item.querySelector<HTMLAnchorElement>("a");
    if (!link) return;
    const trimmedLocationHref = window.location.href.replace(/\/$/, "");
    const trimmedLinkHref = link.href.replace(/\/$/, "");
    if (trimmedLocationHref.startsWith(trimmedLinkHref)) {
      // console.log(
      //   `${trimmedLocationHref} starts with ${trimmedLinkHref}`
      // );
      item.classList.add("current");
      // } else {
      //   console.log(
      //     `${trimmedLocationHref} does not start with ${trimmedLinkHref}`
      //   );
    }
  });
};