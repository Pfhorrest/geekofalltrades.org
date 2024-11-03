/**
 * Creates color-scheme-switcher buttons and adds event listeners to control them
 *
 * @returns {void}
 */
export const hydrateSwitcherButtons = () => {
  document.addEventListener("DOMContentLoaded", () => {
    // Get the footer element
    const footer = document.querySelector("footer");
    // Only run if it exists
    if (footer) {
      // Set up the color-scheme-switcher container
      const colorSchemeSwitcher = footer.appendChild(
        document.createElement("div")
      );
      colorSchemeSwitcher.classList.add("colorSchemeSwitcher");

      // Reusable function to create a control with the given class and text
      const createControl = (className: string, text: string) =>
        colorSchemeSwitcher.appendChild(
          Object.assign(document.createElement("a"), {
            className,
            innerText: text,
            role: "button",
          })
        );

      // Create the controls
      const expandControl = createControl("lightMode", "Light Mode");
      // console.log("created lightMode:", lightMode);
      const anchorControl = createControl("autoMode", "Auto Mode");
      // console.log("created autoMode:", autoMode);
      const collapseControl = createControl("darkMode", "Dark Mode");
      // console.log("created darkMode:", darkMode);

      // Add event listeners
      document.querySelectorAll(".lightMode").forEach((control) => {
        // console.log("Setting up event listener on", control);
        control.addEventListener("click", () => {
          // console.log("Switch to light mode");
          document.documentElement.setAttribute("data-color-scheme", "light");
          document.cookie =
            "color-scheme=light; expires=" +
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) +
            "; path=/";
        });
      });
      document.querySelectorAll(".autoMode").forEach((control) => {
        // console.log("Setting up event listener on", control);
        control.addEventListener("click", () => {
          // console.log("Revert to automatic mode");
          document.documentElement.removeAttribute("data-color-scheme");
          document.cookie =
            "color-scheme=light; expires=" +
            new Date(new Date().setFullYear(new Date().getFullYear() - 1)) +
            "; path=/";
        });
      });
      document.querySelectorAll(".darkMode").forEach((control) => {
        // console.log("Setting up event listener on", control);
        control.addEventListener("click", () => {
          // console.log("Switch to dark mode");
          document.documentElement.setAttribute("data-color-scheme", "dark");
          document.cookie =
            "color-scheme=dark; expires=" +
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) +
            "; path=/";
        });
      });
    }
  });
};
