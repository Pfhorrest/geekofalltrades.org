import { hydrateBreadcrumbs } from "./hydration/hydrateBreadcrumbs";
import { hydrateDropdowns } from "./hydration/hydrateDropdowns";
import { enableFlexBalancing } from "../flexBalance/flexBalance";
import { highlightCurrent } from "./highlightCurrent";
import { hydrateH1 } from "./hydration/hydrateH1";
export const hydrateNavigation = () => {
    enableFlexBalancing("nav > ul");
    highlightCurrent();
    hydrateH1();
    hydrateBreadcrumbs();
    hydrateDropdowns();
};
//# sourceMappingURL=navigation.js.map