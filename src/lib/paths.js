/**
 * Prefixes a root-relative path ("/files/card.pdf") with the build's base path, so it still
 * resolves when the site is served from a sub-path (e.g. a GitHub Pages project site).
 * Absolute URLs and relative paths are returned unchanged.
 * @param {string} path
 */
export function withBase(path) {
  if (!path.startsWith('/') || path.startsWith('//')) return path;
  return `${import.meta.env.BASE_URL}${path.slice(1)}`;
}
