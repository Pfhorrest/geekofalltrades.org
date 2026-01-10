/**
 * Makes external links open in new windows or tabs.
 *
 * @returns {void}
 */
export const hydrateExternalLinks = (): void => {
  // console.log("hydrateExternalLinks");
  // Get all links with rel="external" or hrefs linking to external sites.
  const links = document.querySelectorAll<HTMLAnchorElement>(
    'a[rel="external"], a[href^="http"]:not([href*="' +
      location.hostname +
      '"])'
  );
  // console.log(`Found ${links.length} external links`);
  // Loop over each link and add an event listener to it.
  links.forEach((link: HTMLAnchorElement) => {
    // console.log(`Processing link: ${link.href}`);
    // Add an event listener to the link that listens for the click event.
    link.addEventListener("click", (event: MouseEvent) => {
      // console.log(`Link clicked: ${link.href}`);
      // Prevent the default behavior of the link (navigating to the linked page).
      event.preventDefault();
      // Open the link in a new window or tab.
      window.open(link.href, "_blank");
    });
    // Add a title attribute to indicate the link will open in a new window.
    link.title = "Opens in a new window";
  });
};
