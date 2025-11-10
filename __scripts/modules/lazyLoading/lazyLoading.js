/**
 *  Lazy-load <img> and <picture> elements using IntersectionObserver.
 *  Keeps above-the-fold images visible immediately.
 *
 *  @returns {void}
 */
export const initLazyLoading = () => {
    const placeholder = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";
    // Query all <img> and <picture> elements
    const lazyElements = document.querySelectorAll("img, picture");
    lazyElements.forEach((el) => {
        // Add native lazy loading as a progressive enhancement
        if (el instanceof HTMLImageElement) {
            el.loading = "lazy";
        }
        else {
            const img = el.querySelector("img");
            if (img)
                img.loading = "lazy";
        }
        // Detect if image is already visible
        const rect = el.getBoundingClientRect();
        const inViewport = rect.top < window.innerHeight &&
            rect.bottom > 0 &&
            rect.left < window.innerWidth &&
            rect.right > 0;
        if (!inViewport) {
            // Handle <picture> elements
            if (el instanceof HTMLPictureElement) {
                const img = el.querySelector("img");
                const sources = el.querySelectorAll("source");
                // Move <source> srcsets to data-srcset
                sources.forEach((source) => {
                    if (source.srcset) {
                        source.dataset.srcset = source.srcset;
                        source.removeAttribute("srcset");
                    }
                });
                if (img) {
                    if (img.src) {
                        img.dataset.src = img.src;
                        img.src = placeholder;
                    }
                    if (img.srcset) {
                        img.dataset.srcset = img.srcset;
                        img.removeAttribute("srcset");
                    }
                }
            }
            // Handle standalone <img> elements
            else if (el instanceof HTMLImageElement) {
                if (el.src) {
                    el.dataset.src = el.src;
                    el.src = placeholder;
                }
                if (el.srcset) {
                    el.dataset.srcset = el.srcset;
                    el.removeAttribute("srcset");
                }
            }
        }
    });
    // Set up IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting)
                return;
            const el = entry.target;
            if (el instanceof HTMLPictureElement) {
                const img = el.querySelector("img");
                const sources = el.querySelectorAll("source");
                sources.forEach((source) => {
                    if (source.dataset.srcset) {
                        source.srcset = source.dataset.srcset;
                        delete source.dataset.srcset;
                    }
                });
                if (img) {
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        delete img.dataset.src;
                    }
                    if (img.dataset.srcset) {
                        img.srcset = img.dataset.srcset;
                        delete img.dataset.srcset;
                    }
                }
            }
            else if (el instanceof HTMLImageElement) {
                if (el.dataset.src) {
                    el.src = el.dataset.src;
                    delete el.dataset.src;
                }
                if (el.dataset.srcset) {
                    el.srcset = el.dataset.srcset;
                    delete el.dataset.srcset;
                }
            }
            observer.unobserve(el);
        });
    }, {
        rootMargin: "100px",
    });
    lazyElements.forEach((el) => observer.observe(el));
};
//# sourceMappingURL=lazyLoading.js.map