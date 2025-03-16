/**
 * Creates reduced-motion-switcher buttons and adds event listeners to control them
 *
 * @returns {void}
 */
export const hydrateMotionSwitcher = () => {
  document.addEventListener("DOMContentLoaded", () => {
    decodeURIComponent(document.cookie)
    .split(";")
    .forEach((cookie) => {
        cookie = cookie.trim();
        if (cookie.startsWith("reduced-motion")) {
            document.documentElement.setAttribute(
                "data-reduced-motion",
                cookie.split("=")[1]
            );
        }
    });

    // Get the footer element
    const footer = document.querySelector("footer");
    // Only run if it exists
    if (footer) {
      // Reusable function to create a control with the given class and text
      const createControl = (
        container: string,
        className: string,
        text: string
      ) =>
        document.getElementById(container)?.appendChild(
          Object.assign(document.createElement("a"), {
            className,
            innerText: text,
            role: "button",
          })
        );

      // Set up the reduced-motion-switcher container
      const motionSwitcher = footer.appendChild(
        document.createElement("div")
      );
      motionSwitcher.id = "motionSwitcher";
      motionSwitcher.classList.add("reduced-motion-switcher");

      // Create the controls
      const moreMotion = createControl(
        "motionSwitcher",
        "moreMotion",
        "More Motion"
      );
      // console.log("created moreMotion:", moreMotion);
      const autoMotion = createControl(
        "motionSwitcher",
        "autoMotion",
        "Auto Motion"
      );
      // console.log("created autoMotion:", autoMotion);
      const lessMotion = createControl(
        "motionSwitcher",
        "lessMotion",
        "Less Motion"
      );
      // console.log("created lessMotion:", lessMotion);

      // Add event listeners
      document.querySelectorAll(".moreMotion").forEach((control) => {
        // console.log("Setting up event listener on", control);
        control.addEventListener("click", () => {
          // console.log("Switch to more motion");
          document.documentElement.setAttribute("data-reduced-motion", "no");
          document.cookie =
            "reduced-motion=no; expires=" +
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) +
            "; path=/";
        });
      });
      document.querySelectorAll(".autoMotion").forEach((control) => {
        // console.log("Setting up event listener on", control);
        control.addEventListener("click", () => {
          // console.log("Revert to automatic motion");
          document.documentElement.removeAttribute("data-reduced-motion");
          document.cookie =
            "reduced-motion=no; expires=" +
            new Date(new Date().setFullYear(new Date().getFullYear() - 1)) +
            "; path=/";
        });
      });
      document.querySelectorAll(".lessMotion").forEach((control) => {
        // console.log("Setting up event listener on", control);
        control.addEventListener("click", () => {
          // console.log("Switch to less motion");
          document.documentElement.setAttribute("data-reduced-motion", "yes");
          document.cookie =
            "reduced-motion=yes; expires=" +
            new Date(new Date().setFullYear(new Date().getFullYear() + 1)) +
            "; path=/";
        });
      });
    }
  });
};
