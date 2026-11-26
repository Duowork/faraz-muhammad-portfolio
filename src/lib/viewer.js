/**
 * Wraps an index into [0, total), so Prev on the first item lands on the last.
 * @param {number} index
 * @param {number} total
 */
export function wrapIndex(index, total) {
  return ((index % total) + total) % total;
}

/**
 * Counter text, e.g. "04 / 13".
 * @param {number} index Zero-based
 * @param {number} total
 */
export function formatCounter(index, total) {
  const pad = (value) => String(value).padStart(2, '0');
  return `${pad(index + 1)} / ${pad(total)}`;
}

/**
 * The item at `index` and its two neighbours (wrapping), which the viewer keeps loaded.
 * @param {number} index
 * @param {number} total
 */
export function neighbourIndexes(index, total) {
  return [index, wrapIndex(index + 1, total), wrapIndex(index - 1, total)];
}
