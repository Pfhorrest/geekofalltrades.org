/**
 *  Highlights the current navigation item based on the URL
 *
 *  @returns {void}
 */
export const highlightCurrent = () => {
    // console.log("highlighting current link...");
    const items = document.querySelectorAll("header > nav ul > li");
    items.forEach((item) => {
        const link = item.querySelector("a");
        if (!link)
            return;
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
//# sourceMappingURL=highlightCurrent.js.map