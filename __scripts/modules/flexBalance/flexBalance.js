/**
 * Balances the items in the given container by distributing them evenly across rows.
 * @param {HTMLElement} container - The container element to balance.
 * @returns {void}
 */
const balanceFlexRows = (container) => {
    const items = Array.from(container.children);
    if (items.length < 2)
        return;
    items.forEach((item) => {
        // Hide items to prevent visible reflow during measurement
        item.style.visibility = "hidden";
        // Clear existing min-widths
        item.style.minWidth = "auto";
    });
    // Measure natural top offsets using off-DOM clone
    const containerWidth = container.clientWidth;
    const avgItemWidth = items.reduce((sum, item) => sum + item.offsetWidth, 0) / items.length;
    let rowCount = Math.max(1, Math.round((avgItemWidth * items.length) / containerWidth));
    if (rowCount <= 1)
        return;
    // Calculate balanced distribution
    const perRow = Math.ceil(items.length / rowCount) + 1; // +1 to account for gaps
    // console.log(`Balancing ${items.length} items into ${rowCount} rows of up to ${perRow - 1} items each.`);
    items.forEach((item) => {
        // Set min-width to enforce distribution
        item.style.minWidth = `${100 / perRow}%`;
        // Show items again
        item.style.visibility = "visible";
    });
};
/**
 * Enables flex balancing for all elements that match the given selector.
 * @param {string} [selector=".balanced-flex"] - The CSS selector to match.
 * @returns {void}
 */
export const enableFlexBalancing = (selector) => {
    const containers = Array.from(document.querySelectorAll(selector));
    for (const container of containers) {
        const doBalance = () => balanceFlexRows(container);
        // Initial run
        doBalance();
        // ResizeObserver for layout-affecting container changes
        const resizeObserver = new ResizeObserver(doBalance);
        resizeObserver.observe(container);
        // MutationObserver for children and attributes
        const mutationObserver = new MutationObserver(doBalance);
        mutationObserver.observe(container, {
            childList: true,
            attributes: true,
            subtree: false
        });
    }
};
//# sourceMappingURL=flexBalance.js.map