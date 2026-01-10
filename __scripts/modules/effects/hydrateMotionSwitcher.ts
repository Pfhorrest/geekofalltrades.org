import { setPreference } from "../preferences/setPreference.js";
import { deletePreference } from "..//preferences/deletePreference.js";

/**
 * Creates reduced-motion-switcher buttons and adds event listeners to control them
 *
 * @returns {void}
 */
export const hydrateMotionSwitcher = () => {
  const html: HTMLElement = document.documentElement;

  // // Default to reduced-motion if there is no attribute already set
  // if (!html.hasAttribute("data-reduced-motion")) {
  //   html.setAttribute("data-reduced-motion", "yes-auto");
  // }

  // Measure FPS and set reduced-motion attribute if necessary

  // Initialize time, frame count, fps, etc
  let fpsTimer: number = 30;
  // console.log("fpsTimer:", fpsTimer);
  let fpsTimerDelay: number = fpsTimer;
  // console.log("fpsTimerDelay:", fpsTimerDelay);
  let fpsTimestamp: number = performance.now();
  // console.log("fpsTimestamp:", fpsTimestamp);
  let fpsTimeStampInitial: number = fpsTimestamp;
  // console.log("fpsTimeStampInitial:", fpsTimeStampInitial);
  let fpsTimeSinceInitial: number = fpsTimestamp - fpsTimeStampInitial;
  // console.log("fpsTimeSinceInitial:", fpsTimeSinceInitial);
  let frameCount: number = 0;
  // console.log("frameCount:", frameCount);
  let fps: number = 0;
  // console.log("fps:", fps);
  let fpsThreshold: number = 30;
  // console.log("fpsThreshold:", fpsThreshold);

  // Function to measure the frames per second
  const measureFPS = () => {
    // Every loop, get the current time and increment the frame count
    const now: number = performance.now();
    // console.log("now:", now);
    frameCount++;
    // console.log("frameCount:", frameCount);

    // // To purposefully slow things down for testing
    // const win = window as any;
    // if (!win._leak) win._leak = [];
    // const slowFactor = 10;
    // const junk = new Array(slowFactor*100000).fill(Math.random());
    // win._leak.push(junk);

    // If a second has passed, update the fps
    if (now - fpsTimestamp >= 1000 * fpsTimer) {
      // console.log(`${fpsTimer}s passed`);
      fpsTimeSinceInitial = fpsTimestamp - fpsTimeStampInitial;
      // console.log("fpsTimeSinceInitial:", fpsTimeSinceInitial);
      // fps = frameCount / fpsTimeSinceInitial * 1000;
      fps = (frameCount / (now - fpsTimestamp)) * 1000;
      // console.log("fps:", fps);
      frameCount = 0;
      // console.log("frameCount:", frameCount);
      fpsTimestamp = now;
      // console.log("fpsTimestamp:", fpsTimestamp);

      // Based on the fps, set the data-reduced-motion attribute
      const reducedMotion: string =
        html.getAttribute("data-reduced-motion") || "";
      // Only do this if reduced-motion is auto
      if (!["yes", "no"].includes(reducedMotion)) {
        setPreference("reduced-motion", "yes-auto");
        // console.log("reduced-motion is auto, checking fps...");
        if (fps < fpsThreshold) {
          // Upon failure...
          // console.log("fps < 30, setting reduced-motion to yes-auto");
          html.setAttribute("data-reduced-motion", "yes-auto");
          setPreference("reduced-motion", "yes-auto");
          // Increase delay *geometrically* on failure
          // so if we fail a lot we retry much more slowly.
          // Minimum of 3 to ensure increase at the threshold of oscillation,
          // because that, minus 1, times 2, is still greater than that.
          fpsTimerDelay = Math.max(3, fpsTimerDelay * 2);
          // console.log("fpsTimerDelay:", fpsTimerDelay);
          // Delayed cycle after failure
          fpsTimer = Math.max(1, fpsTimerDelay);
          // console.log("fpsTimer:", fpsTimer);
        } else if (fps >= fpsThreshold) {
          // Upon pass...
          // console.log("fps >= 30, setting reduced-motion to no-auto");
          html.setAttribute("data-reduced-motion", "no-auto");
          setPreference("reduced-motion", "no-auto");
          // Decrease delay *linearly* on pass
          // so if we pass a lot we retry gradually more quickly.
          // Minimum of 2 to ensure increase at the threshold of oscillation,
          // because that, times 2, minus 1, is still greater than that.
          fpsTimerDelay = Math.max(2, fpsTimerDelay - 1);
          // console.log("fpsTimerDelay:", fpsTimerDelay);
          // Rapid cycle after pass
          fpsTimer = 1;
          // console.log("fpsTimer:", fpsTimer);
        }
      }
    }

    // Do it again next frame
    // console.log("looping fps counter...");
    requestAnimationFrame(measureFPS);
  };

  // Start the loop
  // console.log("starting fps counter...");
  measureFPS();

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
    const motionSwitcher = footer.appendChild(document.createElement("div"));
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
        setPreference("reduced-motion", "no");
      });
    });
    document.querySelectorAll(".autoMotion").forEach((control) => {
      // console.log("Setting up event listener on", control);
      control.addEventListener("click", () => {
        // console.log("Revert to automatic motion");
        document.documentElement.removeAttribute("data-reduced-motion");
        deletePreference("reduced-motion");
      });
    });
    document.querySelectorAll(".lessMotion").forEach((control) => {
      // console.log("Setting up event listener on", control);
      control.addEventListener("click", () => {
        // console.log("Switch to less motion");
        document.documentElement.setAttribute("data-reduced-motion", "yes");
        setPreference("reduced-motion", "yes");
      });
    });
  }
};
