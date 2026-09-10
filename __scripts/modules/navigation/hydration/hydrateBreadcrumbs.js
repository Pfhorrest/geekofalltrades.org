var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { slideUp, slideDown, getDuration, getBreakpoint, } from "../../effects/effects";
import { delay } from "../../effects/helpers/helpers";
/**
 * Adds event listeners to show parent breadcrumbs' subnavs on hover.
 *
 * @returns {void}
 */
export const hydrateBreadcrumbs = () => {
    // Get the breakpoint above which any of this matters
    const breakpoint = getBreakpoint();
    // Get the last subnav
    const lastSubnav = document.querySelector("header > nav > a:last-of-type + ul");
    // If there are no subnavs, never mind
    if (!lastSubnav) {
        // console.error("No subnav elements found.");
        return;
    }
    // Get the transition duration of the last subnav
    const transitionDuration = getDuration(lastSubnav);
    // Set the hover delay to twice that
    const hoverDelayDuration = Math.max(2 * transitionDuration, 100);
    // Resuable function to switch subnavs
    let switchSubnav = (targetSubnav) => __awaiter(void 0, void 0, void 0, function* () {
        // Slide up any open subnavs
        const promisedSlideUp = Array.from(document.querySelectorAll("header > nav > a + ul"))
            .filter((subnav) => subnav != targetSubnav)
            .map((subnav) => {
            // const subnavLink = subnav.previousElementSibling as HTMLAnchorElement;
            // console.log(
            //   "about to slide up subnav",
            //   `'${subnavLink.innerText}'` || subnav
            // );
            return slideUp(subnav);
        });
        // Wait the transition duration and then show the target subnav
        yield Promise.all(promisedSlideUp);
        // const targetSubnavLink =
        //   targetSubnav.previousElementSibling as HTMLAnchorElement;
        // console.log(
        //   "about to slide down subnav:",
        //   `'${targetSubnavLink.innerText}'` || targetSubnav
        // );
        if (getComputedStyle(targetSubnav).display == "none") {
            slideDown(targetSubnav);
        }
    });
    // For every breadcrumb
    let breadcrumbs = document.querySelectorAll("header > nav > a");
    breadcrumbs.forEach((breadcrumb) => {
        // If it has a subnav
        const nextSibling = breadcrumb.nextElementSibling;
        if (nextSibling instanceof HTMLElement &&
            nextSibling.tagName.toLowerCase() == "ul") {
            const thisSubnav = nextSibling;
            // Listen for when the mouse enters the breadcrumb
            breadcrumb.addEventListener("mouseenter", (e) => __awaiter(void 0, void 0, void 0, function* () {
                // Mark that the mouse is in the breadcrumb
                breadcrumb.mouseIn = true;
                // Add 'current' class to this breadcrumb
                breadcrumb.classList.add("current");
                // Remove 'current' class from other breadcrumbs
                breadcrumbs.forEach((b) => {
                    if (b != breadcrumb) {
                        b.classList.remove("current");
                    }
                });
                // console.log(`Mouse entered breadcrumb '${breadcrumb.innerText}'`);
                if (window.innerWidth >= breakpoint) {
                    // If we're above the breakpoint, wait the hover delay then...
                    yield delay(hoverDelayDuration);
                    // If the mouse is still in the breadcrumb,
                    // and didn't just come in from its subnav...
                    if (e.relatedTarget != thisSubnav && breadcrumb.mouseIn) {
                        // console.log(`switching to '${breadcrumb.innerText}' subnav`);
                        switchSubnav(thisSubnav);
                    }
                }
            }));
            // Listen for when the mouse leaves the breadcrumb
            breadcrumb.addEventListener("mouseleave", (e) => __awaiter(void 0, void 0, void 0, function* () {
                breadcrumb.mouseIn = false;
                // console.log(`Mouse left breadcrumb '${breadcrumb.innerText}'`);
                if (window.innerWidth >= breakpoint &&
                    e.relatedTarget instanceof HTMLElement &&
                    e.relatedTarget.closest("ul") != thisSubnav) {
                    // If it's to something other than its subnav, remove 'current' class
                    // console.log("...into something other than its subnav, so....");
                    // Check if any dropdowns are open
                    const anOpenDropdown = document.querySelector("header > nav > ul > li.active");
                    yield delay(hoverDelayDuration);
                    if (!breadcrumb.mouseIn && !thisSubnav.mouseIn && !anOpenDropdown) {
                        // console.log(
                        //   "removing 'current' class from breadcrumb",
                        //   `'${breadcrumb.innerText}'`
                        // );
                        breadcrumb.classList.remove("current");
                        // And if the mouse isn't in any breadcrumb now, revert to last subnav
                        if (!Array.from(document.querySelectorAll("header > nav > a")).some((breadcrumb) => breadcrumb.mouseIn)) {
                            // console.log("Reverting to last subnav");
                            switchSubnav(lastSubnav);
                        }
                    }
                }
            }));
            // Listen for when the mouse leaves the subnav
            thisSubnav.addEventListener("mouseleave", (e) => __awaiter(void 0, void 0, void 0, function* () {
                thisSubnav.mouseIn = false;
                // console.log("Mouse left subnav");
                if (window.innerWidth >= breakpoint && e.relatedTarget != breadcrumb) {
                    // If it's to something other than its breadcrumb, revert to last subnav
                    // console.log("...into something other than a breadcrumb, so....");
                    // Check if any dropdowns are open
                    const anOpenDropdown = document.querySelector("header > nav > ul > li.active");
                    yield delay(hoverDelayDuration);
                    if (!Array.from(document.querySelectorAll("header > nav > a")).some((breadcrumb) => breadcrumb.mouseIn) &&
                        !thisSubnav.mouseIn &&
                        !anOpenDropdown) {
                        // console.log(
                        //   "removing 'current' class from breadcrumb",
                        //   `'${breadcrumb.innerText}'`
                        // );
                        breadcrumb.classList.remove("current");
                        // console.log("Reverting to last subnav");
                        switchSubnav(lastSubnav);
                    }
                }
            }));
        }
        else {
            // console.error(`No subnav found for '${breadcrumb.innerText}'`);
        }
    });
};
//# sourceMappingURL=hydrateBreadcrumbs.js.map