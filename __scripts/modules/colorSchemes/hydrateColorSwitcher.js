/**
 * Creates color-scheme-switcher buttons and adds event listeners to control them
 *
 * @returns {void}
 */
export const hydrateColorSwitcher = () => {
    document.addEventListener("DOMContentLoaded", () => {
        // Get the footer element
        const footer = document.querySelector("footer");
        // Only run if it exists
        if (footer) {
            // Reusable function to create a control with the given class and text
            const createControl = (container, className, text) => document.getElementById(container)?.appendChild(Object.assign(document.createElement("a"), {
                className,
                innerText: text,
                role: "button",
            }));
            // Set up the color-scheme-switcher container
            const lightOrDarkSwitcher = footer.appendChild(document.createElement("div"));
            lightOrDarkSwitcher.id = "lightOrDarkSwitcher";
            lightOrDarkSwitcher.classList.add("color-scheme-switcher");
            // Create the controls
            const lightMode = createControl("lightOrDarkSwitcher", "lightMode", "Light Mode");
            // console.log("created lightMode:", lightMode);
            const autoMode = createControl("lightOrDarkSwitcher", "autoMode", "Auto Mode");
            // console.log("created autoMode:", autoMode);
            const darkMode = createControl("lightOrDarkSwitcher", "darkMode", "Dark Mode");
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
            // Set up the color-scheme-switcher container
            const themeSwitcher = footer.appendChild(document.createElement("div"));
            themeSwitcher.id = "themeSwitcher";
            themeSwitcher.classList.add("color-scheme-switcher");
            // Create the controls
            const grays = createControl("themeSwitcher", "grays-theme", "Grays");
            // console.log("created Grays:", grays);
            const warmer = createControl("themeSwitcher", "warmer-theme", "Warmer");
            // console.log("created Warmer:", warmer);
            const natural = createControl("themeSwitcher", "natural-theme", "Natural");
            // console.log("created Natural:", natural);
            const cooler = createControl("themeSwitcher", "cooler-theme", "Cooler");
            // console.log("created Cooler:", cooler);
            const alien = createControl("themeSwitcher", "alien-theme", "Alien");
            // console.log("created Alien:", alien);
            // Add event listeners
            document.querySelectorAll(".grays-theme").forEach((control) => {
                // console.log("Setting up event listener on", control);
                control.addEventListener("click", () => {
                    // console.log("Switch to grays theme");
                    document.documentElement.setAttribute("data-theme", "grays");
                    document.cookie =
                        "theme=grays; expires=" +
                            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) +
                            "; path=/";
                });
            });
            document.querySelectorAll(".warmer-theme").forEach((control) => {
                // console.log("Setting up event listener on", control);
                control.addEventListener("click", () => {
                    // console.log("Switch to warmer theme");
                    document.documentElement.setAttribute("data-theme", "warmer");
                    document.cookie =
                        "theme=warmer; expires=" +
                            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) +
                            "; path=/";
                });
            });
            document.querySelectorAll(".natural-theme").forEach((control) => {
                // console.log("Setting up event listener on", control);
                control.addEventListener("click", () => {
                    // console.log("Switch to natural theme");
                    document.documentElement.setAttribute("data-theme", "natural");
                    document.cookie =
                        "theme=natural; expires=" +
                            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) +
                            "; path=/";
                });
            });
            document.querySelectorAll(".cooler-theme").forEach((control) => {
                // console.log("Setting up event listener on", control);
                control.addEventListener("click", () => {
                    // console.log("Switch to cooler theme");
                    document.documentElement.setAttribute("data-theme", "cooler");
                    document.cookie =
                        "theme=cooler; expires=" +
                            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) +
                            "; path=/";
                });
            });
            document.querySelectorAll(".alien-theme").forEach((control) => {
                // console.log("Setting up event listener on", control);
                control.addEventListener("click", () => {
                    // console.log("Switch to alien theme");
                    document.documentElement.setAttribute("data-theme", "alien");
                    document.cookie =
                        "theme=alien; expires=" +
                            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) +
                            "; path=/";
                });
            });
        }
    });
};
//# sourceMappingURL=hydrateColorSwitcher.js.map