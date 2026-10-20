/**
 * Progressive enhancement for theming colors inside externally referenced SVG images.
 *
 * Call themeCssSvg(element, property) for each HTML element/CSS property that may
 * contain SVG url() values. The original CSS remains the no-JavaScript fallback.
 *
 * SVG objects must have IDs for their colors to be exposed as CSS custom properties.
 * The HTML element's tag name is used as the leading part of each variable name.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const COLOR_PROPERTIES = [
    "fill",
    "stroke",
    "stop-color",
    "flood-color",
    "lighting-color",
    "color",
];
const fetchedSvg = new Map();
const svgTemplates = new Map();
const rootDefaults = new Map();
const targetStates = new WeakMap();
const registeredTargets = new Map();
let defaultsStyle = null;
let listenersInitialized = false;
/**
 * Determines if a string represents a literal color value.
 *
 * @param value The string to check.
 *
 * @returns True if the string is a literal color value, false otherwise.
 */
const isLiteralColor = (value) => {
    const color = value.trim();
    if (!color)
        return false;
    if (/^(none|currentcolor|inherit|initial|unset|revert|revert-layer|context-fill|context-stroke)$/i.test(color)) {
        return false;
    }
    if (/\bvar\s*\(/i.test(color) || /^url\s*\(/i.test(color))
        return false;
    return typeof CSS !== "undefined" && CSS.supports("color", color);
};
/** Converts a string to a slug suitable for use as a CSS custom property name.
 *
 * @param value The string to convert.
 *
 * @returns The slugified string.
*/
const slug = (value) => {
    return value
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "") || "unnamed";
};
/**
 * Creates a CSS variable name for the given element and property.
 *
 * @param prefix The prefix for the variable name.
 * @param objectId The ID of the SVG object.
 * @param property The SVG color property.
 *
 * @returns The generated CSS variable name.
 */
const createVariableName = (prefix, objectId, property) => {
    // Keep the SVG property name as the suffix: stop-color stays stop-color, etc.
    return `--${prefix}-${slug(objectId)}-${property}`;
};
/**
 * Records a default value for a CSS variable.
 *
 * @param defaults The map of default values.
 * @param priorities The map of variable priorities.
 * @param variable The CSS variable name.
 * @param value The default value.
 * @param priority The priority of the default value.
 */
const recordDefault = (defaults, priorities, variable, value, priority) => {
    // Inline styles outrank stylesheet rules, which outrank presentation attributes.
    if (!priorities.has(variable) || priority >= priorities.get(variable)) {
        defaults.set(variable, value.trim());
        priorities.set(variable, priority);
    }
};
/**
 * Finds all matches of a pattern in a string.
 *
 * @param value The string to search
 * @param pattern The regular expression pattern
 *
 * @returns An array of all matches
 */
const findMatches = (value, pattern) => {
    const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
    const globalPattern = new RegExp(pattern.source, flags);
    const matches = [];
    let match;
    while ((match = globalPattern.exec(value)) !== null)
        matches.push(match);
    return matches;
};
/**
 * Extracts information about an SVG URL.
 *
 * @param rawUrl The raw URL string
 *
 * @returns An object containing the fetch URL, fragment, and parsed URL, or null if parsing fails
 */
const svgUrlInfo = (rawUrl) => {
    try {
        const url = new URL(rawUrl, document.baseURI);
        if (url.protocol !== "http:" && url.protocol !== "https:")
            return null;
        if (!url.pathname.toLowerCase().endsWith(".svg"))
            return null;
        const fragment = url.hash;
        url.hash = "";
        return { fetchUrl: url.href, fragment, url };
    }
    catch (_a) {
        return null;
    }
};
/**
 * Extracts the URL from a regex match.
 *
 * @param match The regex match
 *
 * @returns The extracted URL
 */
const extractUrl = (match) => {
    var _a, _b;
    const quotedDouble = match[1];
    const quotedSingle = match[2];
    const unquoted = match[3];
    return ((_b = (_a = quotedDouble !== null && quotedDouble !== void 0 ? quotedDouble : quotedSingle) !== null && _a !== void 0 ? _a : unquoted) !== null && _b !== void 0 ? _b : "").trim();
};
/**
 * Fetches the content of an SVG file.
 *
 * @param url The URL of the SVG file to fetch
 *
 * @returns A promise resolving to the SVG content or null if the fetch fails
 */
const fetchSvg = (url) => {
    let pending = fetchedSvg.get(url);
    if (!pending) {
        pending = fetch(url)
            .then((response) => (response.ok ? response.text() : null))
            .catch(() => null);
        fetchedSvg.set(url, pending);
    }
    return pending;
};
/**
 * Replaces color declarations in the given element with CSS variables.
 *
 * @param element The element to process.
 * @param prefix The prefix for the CSS variable names.
 * @param defaults The map of default values.
 * @param priorities The map of variable priorities.
 */
const replaceColorDeclarations = (element, prefix, defaults, priorities) => {
    var _a;
    // Anonymous SVG nodes are intentionally left alone. Give each object that should
    // be themeable an id in the SVG source, rather than relying on generated numbering.
    if (!element.id)
        return;
    const svgElement = element;
    const objectId = element.id;
    // Presentation attributes such as fill="#123456" or stop-color="gold".
    for (const property of COLOR_PROPERTIES) {
        const original = element.getAttribute(property);
        if (original === null || !isLiteralColor(original))
            continue;
        // An inline style declaration takes precedence over the presentation attribute.
        if ((_a = svgElement.style) === null || _a === void 0 ? void 0 : _a.getPropertyValue(property))
            continue;
        const variable = createVariableName(prefix, objectId, property);
        recordDefault(defaults, priorities, variable, original, 1);
        element.setAttribute(property, `var(${variable})`);
    }
    // Inline style declarations, common in SVGs exported from illustration software.
    const style = svgElement.style;
    if (style) {
        for (const property of COLOR_PROPERTIES) {
            const original = style.getPropertyValue(property);
            if (!original || !isLiteralColor(original))
                continue;
            const variable = createVariableName(prefix, objectId, property);
            recordDefault(defaults, priorities, variable, original, 3);
            style.setProperty(property, `var(${variable})`, style.getPropertyPriority(property));
        }
    }
};
/**
 * Finds all elements that match the given selector within the root element.
 *
 * @param root The root element to search within.
 * @param selector The CSS selector to match.
 *
 * @returns An array of matching elements.
 */
const matchingElements = (root, selector) => {
    try {
        const matches = Array.from(root.querySelectorAll(selector));
        if (root.matches(selector))
            matches.unshift(root);
        return matches;
    }
    catch (_a) {
        // Some SVG/CSS selector forms may not be supported by querySelectorAll.
        return [];
    }
};
/**
 * Rewrites CSS rules to use themeable variables.
 *
 * @param rules An array of CSS rules to rewrite
 * @param root The root element to search within
 * @param prefix The prefix for the themeable variables
 * @param defaults A map of default values for the themeable variables
 * @param priorities A map of priorities for the themeable variables
 */
const rewriteCssRules = (rules, root, prefix, defaults, priorities) => {
    for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule) {
            // A selector must identify exactly one ID'd SVG object. A broad rule such as
            // "stop { ... }" is ambiguous by design and is not rewritten.
            const matches = matchingElements(root, rule.selectorText);
            if (matches.length !== 1 || !matches[0].id)
                continue;
            const objectId = matches[0].id;
            for (const property of COLOR_PROPERTIES) {
                const original = rule.style.getPropertyValue(property);
                if (!original || !isLiteralColor(original))
                    continue;
                const variable = createVariableName(prefix, objectId, property);
                recordDefault(defaults, priorities, variable, original, 2);
                rule.style.setProperty(property, `var(${variable})`, rule.style.getPropertyPriority(property));
            }
        }
        else if ("cssRules" in rule) {
            // Recurse into @media, @supports, and other grouping rules.
            rewriteCssRules(rule.cssRules, root, prefix, defaults, priorities);
        }
    }
};
/**
 * Rewrites embedded CSS styles to use themeable variables.
 *
 * @param root The root element to search within
 * @param prefix The prefix for the themeable variables
 * @param defaults A map of default values for the themeable variables
 * @param priorities A map of priorities for the themeable variables
 */
function rewriteEmbeddedStyles(root, prefix, defaults, priorities) {
    for (const styleElement of Array.from(root.querySelectorAll("style"))) {
        try {
            const sheet = new CSSStyleSheet();
            sheet.replaceSync(styleElement.textContent || "");
            rewriteCssRules(sheet.cssRules, root, prefix, defaults, priorities);
            styleElement.textContent = Array.from(sheet.cssRules)
                .map((rule) => rule.cssText)
                .join("\n");
        }
        catch (_a) {
            // Keep the source stylesheet untouched if CSSOM parsing is unavailable.
            // Presentation attributes and inline styles are still enhanced independently.
        }
    }
}
/**
 * Builds an SVG template with themeable color variables.
 *
 * @param xml The XML string representing the SVG
 * @param prefix The prefix for the themeable variables
 *
 * @returns The SVG template or null if parsing fails
 */
const buildSvgTemplate = (xml, prefix) => {
    const document = new DOMParser().parseFromString(xml, "image/svg+xml");
    if (document.querySelector("parsererror") ||
        document.documentElement.localName.toLowerCase() !== "svg") {
        return null;
    }
    const root = document.documentElement;
    const defaults = new Map();
    const defaultPriorities = new Map();
    const elements = [root, ...Array.from(root.querySelectorAll("*"))];
    // Process SVG presentation attributes and inline styles first; their source color
    // has a predictable priority. Embedded rules can then supersede attributes, while
    // inline declarations retain precedence.
    for (const element of elements) {
        replaceColorDeclarations(element, prefix, defaults, defaultPriorities);
    }
    rewriteEmbeddedStyles(root, prefix, defaults, defaultPriorities);
    return {
        source: new XMLSerializer().serializeToString(document),
        defaults,
    };
};
/**
 * Generates the CSS property name for the given SVG theme property.
 *
 * @param property The SVG theme property for which to generate a CSS property name.
 *
 * @returns The generated CSS property name.
 */
const cssProperty = (property) => {
    switch (property) {
        case "background":
        case "background-image":
            return "background-image";
        case "mask":
        case "mask-image":
            return "mask-image";
        case "list-style-image":
            return "list-style-image";
    }
};
/**
 * Gets the target state for a given element and key.
 *
 * @param element The element for which to get the state
 * @param key The key for which to get the state
 *
 * @returns The target state or undefined if not found
 */
const getTargetState = (element, key) => {
    var _a;
    return (_a = targetStates.get(element)) === null || _a === void 0 ? void 0 : _a.get(key);
};
/**
 * Saves the target state for a given element and key.
 *
 * @param element The element for which to save the state
 * @param key The key for which to save the state
 * @param property The CSS property for which to save the state
 *
 * @returns The saved target state
 */
const saveTargetState = (element, key, property) => {
    let states = targetStates.get(element);
    if (!states) {
        states = new Map();
        targetStates.set(element, states);
    }
    const existing = states.get(key);
    if (existing)
        return existing;
    const state = {
        originalInlineValue: element.style.getPropertyValue(property),
        originalInlinePriority: element.style.getPropertyPriority(property),
        generatedValue: null,
    };
    states.set(key, state);
    return state;
};
/**
 * Restores the original CSS property value for a given element and state.
 *
 * @param element The element for which to restore the property
 * @param property The CSS property to restore
 *
 * @param state The target state
 */
const restoreOriginalProperty = (element, property, state) => {
    if (state.originalInlineValue) {
        element.style.setProperty(property, state.originalInlineValue, state.originalInlinePriority);
    }
    else {
        element.style.removeProperty(property);
    }
    state.generatedValue = null;
};
/**
 * Checks if a string contains an SVG URL.
 *
 * @param value The string to check
 *
 * @returns True if the string contains an SVG URL, false otherwise
 */
const hasSvgUrl = (value) => {
    const pattern = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi;
    return findMatches(value, pattern).some((match) => svgUrlInfo(extractUrl(match)) !== null);
};
/**
 * Generates a prefix for the element based on its tag name.
 *
 * @param element The HTML element for which to generate a prefix.
 *
 * @returns The generated prefix.
 */
const elementPrefix = (element) => {
    // The function receives an element rather than its originating CSS selector, so use
    // its tag name (e.g. h1) to keep variable names stable and easy to predict.
    return slug(element.localName);
};
/**
 * Generates a prefix for the property based on its type.
 *
 * @param property The SVG theme property for which to generate a prefix.
 *
 * @returns The generated prefix.
 */
const propertyPrefix = (property) => {
    // Both shorthand and longhand spellings address the same image layer.
    if (property === "background" || property === "background-image")
        return "background";
    if (property === "mask" || property === "mask-image")
        return "mask";
    return property;
};
/**
 * Generates a slug for the given asset URL.
 *
 * @param url The URL of the asset.
 *
 * @returns The generated slug.
 */
const assetSlug = (url) => {
    const filename = url.pathname.split("/").pop() || "svg";
    return slug(filename.replace(/\.svg$/i, ""));
};
/**
 * Fetches the SVG template for a given URL and prefix.
 *
 * @param url The URL of the SVG file to fetch
 * @param prefix The prefix for the template
 *
 * @returns A promise resolving to the SVG template or null if the fetch fails
 */
const getSvgTemplate = (url, prefix) => {
    const key = `${url}\n${prefix}`;
    let pending = svgTemplates.get(key);
    if (!pending) {
        pending = fetchSvg(url).then((source) => source === null ? null : buildSvgTemplate(source, prefix));
        svgTemplates.set(key, pending);
    }
    return pending;
};
/**
 * Registers the default color values for the SVG theme.
 *
 * @param defaults A map of default values for the themeable variables
 */
const registerDefaults = (defaults) => {
    if (!defaultsStyle) {
        defaultsStyle = document.createElement("style");
        defaultsStyle.dataset.svgThemeDefaults = "true";
        // Put defaults early; local declarations on the consuming element can override them.
        document.head.insertBefore(defaultsStyle, document.head.firstChild);
    }
    for (const [name, value] of defaults) {
        if (!rootDefaults.has(name))
            rootDefaults.set(name, value);
    }
    defaultsStyle.textContent = `:root {\n${Array.from(rootDefaults)
        .map(([name, value]) => `  ${name}: ${value};`)
        .join("\n")}\n}`;
};
/**
 * Resolves the template for a given element.
 *
 * @param template The SVG template
 * @param element The element for which to resolve the template
 *
 * @returns The resolved SVG string
 */
const resolveTemplate = (template, element) => {
    const computed = getComputedStyle(element);
    return template.source.replace(/var\(\s*(--[a-z0-9_-]+)\s*\)/gi, (whole, variable) => {
        if (!template.defaults.has(variable))
            return whole;
        return computed.getPropertyValue(variable).trim() || template.defaults.get(variable);
    });
};
/**
 * Creates a data URL for an SVG string and fragment.
 *
 * @param svg The SVG string
 * @param fragment The fragment identifier
 *
 * @returns The data URL
 */
const makeDataUrl = (svg, fragment) => {
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}${fragment}`;
};
/**
 * Transforms a CSS property value by resolving SVG URLs.
 *
 * @param value The CSS property value
 * @param element The element for which to transform the property
 * @param property The SVG theme property
 *
 * @returns A promise resolving to the transformed value and a flag indicating whether it was changed
 */
const transformPropertyValue = (value, element, property) => __awaiter(void 0, void 0, void 0, function* () {
    const urlPattern = /url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi;
    const matches = findMatches(value, urlPattern);
    if (!matches.some((match) => svgUrlInfo(extractUrl(match)) !== null)) {
        return { value, changed: false };
    }
    const prefix = `${elementPrefix(element)}-${propertyPrefix(property)}`;
    const replacements = new Map();
    for (const match of matches) {
        const info = svgUrlInfo(extractUrl(match));
        if (!info || match.index === undefined)
            continue;
        const asset = assetSlug(info.url);
        const template = yield getSvgTemplate(info.fetchUrl, `${prefix}-${asset}`);
        if (!template || template.defaults.size === 0)
            continue;
        registerDefaults(template.defaults);
        const svg = resolveTemplate(template, element);
        replacements.set(match.index, `url("${makeDataUrl(svg, info.fragment)}")`);
    }
    if (replacements.size === 0)
        return { value, changed: false };
    let result = "";
    let lastIndex = 0;
    for (const match of matches) {
        if (match.index === undefined)
            continue;
        const replacement = replacements.get(match.index);
        if (replacement === undefined)
            continue;
        result += value.slice(lastIndex, match.index) + replacement;
        lastIndex = match.index + match[0].length;
    }
    result += value.slice(lastIndex);
    return { value: result, changed: true };
});
/**
 * Processes a target element and its associated CSS property.
 *
 * @param target The target element and property to process
 *
 * @returns A promise resolving when the processing is complete
 */
const processTarget = (target) => __awaiter(void 0, void 0, void 0, function* () {
    const { element, property: targetProperty } = target;
    const property = cssProperty(targetProperty);
    const key = property;
    let state = getTargetState(element, key);
    // Temporarily expose the original cascade so a theme change can select a different URL.
    if (state === null || state === void 0 ? void 0 : state.generatedValue)
        restoreOriginalProperty(element, property, state);
    const sourceValue = getComputedStyle(element).getPropertyValue(property);
    if (!hasSvgUrl(sourceValue))
        return;
    state = state || saveTargetState(element, key, property);
    const transformed = yield transformPropertyValue(sourceValue, element, targetProperty);
    if (!transformed.changed)
        return;
    element.style.setProperty(property, transformed.value, state.originalInlinePriority);
    state.generatedValue = transformed.value;
});
/**
 * Refreshes all registered targets.
 *
 * @returns A promise resolving when the refresh is complete
 */
const refreshAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const targets = [];
    for (const byProperty of registeredTargets.values()) {
        for (const target of byProperty.values())
            targets.push(target);
    }
    yield Promise.all(targets.map((target) => processTarget(target)));
});
/**
 * Schedules a refresh of all registered targets.
 */
const scheduleRefresh = () => {
    requestAnimationFrame(() => {
        void refreshAll();
    });
};
/**
 * Initializes the event listeners for theme changes.
 *
 * @returns A promise resolving when the listeners are initialized
 */
const initializeListeners = () => {
    var _a;
    if (listenersInitialized || !document.head || !document.body)
        return;
    listenersInitialized = true;
    // The site's theme switcher updates html[data-theme] and html[data-color-scheme].
    const rootObserver = new MutationObserver(scheduleRefresh);
    rootObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["data-theme", "data-color-scheme", "class", "style"],
    });
    window.addEventListener("resize", scheduleRefresh, { passive: true });
    if (typeof window.matchMedia === "function") {
        const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
        (_a = colorScheme.addEventListener) === null || _a === void 0 ? void 0 : _a.call(colorScheme, "change", scheduleRefresh);
    }
};
/**
 * Theme SVG colors in external SVG URLs found in `property` on `element`.
 *
 * Example: themeCssSvg(document.querySelector("h1")!, "background");
 *
 * @param element The HTML element to theme
 * @param property The CSS property to theme
 */
export const themeCssSvg = (element, property) => {
    initializeListeners();
    let byProperty = registeredTargets.get(element);
    if (!byProperty) {
        byProperty = new Map();
        registeredTargets.set(element, byProperty);
    }
    let target = byProperty.get(property);
    if (!target) {
        target = { element, property };
        byProperty.set(property, target);
    }
    void processTarget(target);
};
//# sourceMappingURL=themeCssSvg.js.map