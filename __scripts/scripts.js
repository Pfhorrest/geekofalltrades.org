import { initLazyLoading } from "./modules/lazyLoading/lazyLoading";
import { hydrateNavigation } from "./modules/navigation/navigation";
import { hydrateSections } from "./modules/sections/sections";
import { hydrateScrollAnimation } from "./modules/scrollAnimation/hydrateScrollAnimation";
import { hydrateExternalLinks } from "./modules/externalLinks/hydrateExternalLinks";
import { hydrateLightbox } from "./modules/lightbox/hydrateLightbox";
import { hydrateColorSwitcher } from "./modules/colorSchemes/hydrateColorSwitcher";
import { hydrateMotionSwitcher } from "./modules/effects/hydrateMotionSwitcher";
const onReady = (fn) => {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn);
    }
    else {
        fn();
    }
};
onReady(() => {
    initLazyLoading();
    hydrateNavigation();
    hydrateSections();
    hydrateScrollAnimation();
    hydrateExternalLinks();
    hydrateLightbox();
    hydrateColorSwitcher();
    hydrateMotionSwitcher();
});
//# sourceMappingURL=scripts.js.map