import { useEffect } from 'react';
import { site } from '@/content';

/**
 * "Art — Faraz Muhammad", or just "Faraz Muhammad" for the home page.
 * @param {string} [title]
 */
export function formatTitle(title) {
  return title ? `${title} — ${site.name}` : site.name;
}

/**
 * Sets the document title for the current page.
 * @param {string} [title] Page name; omit on the home page.
 */
export function usePageTitle(title) {
  useEffect(() => {
    document.title = formatTitle(title);
  }, [title]);
}
