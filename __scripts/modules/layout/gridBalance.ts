/**
 * Balances the items in the given grid container by distributing them evenly across rows.
 * @param {HTMLElement} container - The container element to balance.
 *
 * @returns {void}
 */
const balanceGridRows = (container: HTMLElement): void => {
  const items = Array.from(container.children) as HTMLElement[];

  // Clear existing inline styles
  container.style.removeProperty("grid-template-columns");
  items.forEach((item) => {
    item.style.removeProperty("grid-column-start");
  });

  // Get computed row count
  const containerComputedStyle = getComputedStyle(container);
  const containerRows = containerComputedStyle.gridTemplateRows;
    const getGridRowSpan = (element: HTMLElement) => {
      const style = window.getComputedStyle(element);
      const row = style.getPropertyValue("grid-row");
      const rowStart = style.getPropertyValue("grid-row-start");
      const rowEnd = style.getPropertyValue("grid-row-end");
      if (row.startsWith("span")) {
        return parseInt(rowStart.replace("span", "").trim(), 10);
      }
      if (!isNaN(parseInt(rowEnd, 10)) && !isNaN(parseInt(rowStart, 10))) {
        return Math.abs(parseInt(rowEnd, 10) - parseInt(rowStart, 10));
      }
      return 1;
    };
  const tallestItem = items.sort((a, b) => {
    return getGridRowSpan(a) - getGridRowSpan(b);
  })[0];
  const tallestItemRowSpan = getGridRowSpan(tallestItem);
  // console.log(`Tallest item row span: ${tallestItemRowSpan}`);
  const rowCount = containerRows.split(" ").length;
  // console.log(`Total row count: ${rowCount}`);
  const itemRowCount = rowCount / tallestItemRowSpan;
  // console.log(`Item-row count: ${itemRowCount}`);

  // Calculate balanced distribution
  const colCount = Math.ceil(items.length / itemRowCount);
  console.log(
    `Balancing ${items.length} items into ${itemRowCount} rows of up to ${colCount} items each.`,
  );

  // Set grid-template-columns to enforce distribution
  container.style.gridTemplateColumns = `repeat(${colCount}, 1fr)`;
  console.log(`New grid template columns: ${container.style.gridTemplateColumns}`);

  // Approximately center the last row
  const remainder = items.length % colCount;
  console.log(`Remainder: ${remainder}`);
  if (remainder > 0) {
    const indexOfFirstItemOfLastRow = items.length - remainder;
    console.log(
      `Index of first item of last row: ${indexOfFirstItemOfLastRow}`,
    );
    const firstItemOfLastRow = items[indexOfFirstItemOfLastRow];
    console.log(`First item of last row:`, firstItemOfLastRow);
    const lastRowGridColumnStart = Math.floor((colCount - remainder) / 2) + 1;
    console.log(`Last row grid column start: ${lastRowGridColumnStart}`);
    firstItemOfLastRow.style.gridColumnStart = `${lastRowGridColumnStart}`;
  }
};

/**
 * Enables grid balancing for all elements that match the given selector.
 * @param {string} [selector=".balanced-grid"] - The CSS selector to match.
 * @returns {void}
 */
export const enableGridBalancing = (selector: string): void => {
  const containers = Array.from(
    document.querySelectorAll(selector),
  ) as HTMLElement[];

  for (const container of containers) {
    const doBalance = () => balanceGridRows(container);

    // Initial run
    doBalance();

    // ResizeObserver for layout-affecting container changes
    const resizeObserver = new ResizeObserver(doBalance);
    resizeObserver.observe(container);

    // MutationObserver for children
    const mutationObserver = new MutationObserver(doBalance);
    mutationObserver.observe(container, {
      childList: true,
      attributes: false,
      subtree: false,
    });
  }
};
