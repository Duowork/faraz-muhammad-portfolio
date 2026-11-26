const PLACEHOLDER_PATTERN = /^\s*\[[^\]]*\]\s*$/;

/**
 * True for unfilled content such as "[EMAIL]" or "[YEAR]".
 * @param {unknown} value
 */
export function isPlaceholder(value) {
  return typeof value === 'string' && PLACEHOLDER_PATTERN.test(value);
}

/**
 * True when a content value is present and no longer a placeholder.
 * @param {unknown} value
 * @returns {value is string}
 */
export function isFilled(value) {
  return typeof value === 'string' && value.trim() !== '' && !isPlaceholder(value);
}
