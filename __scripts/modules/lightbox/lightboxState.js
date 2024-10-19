/**
 * Global variables for lightbox
 *
 * Each gets its variable if accessed with no argument,
 * or sets its value if an argument is passed
 */
export const slides = (() => {
    let v;
    return (n) => (n && n.length > 0 ? (v = n) : v);
})();
export const slideIndex = (() => {
    let v = 0;
    return (n) => (n != null ? (v = n) : v);
})();
export const slideDuration = (() => {
    let v = 500;
    return (n) => (n != null ? (v = n) : v);
})();
//# sourceMappingURL=lightboxState.js.map