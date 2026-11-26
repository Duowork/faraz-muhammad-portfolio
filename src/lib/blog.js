/**
 * Blog helpers: date handling, ordering and choosing the featured post.
 *
 * @typedef {object} Post
 * @property {string} title
 * @property {string} date      ISO "YYYY-MM-DD", or a placeholder such as "[DATE]"
 * @property {string} platform  Key into the platforms map, e.g. "medium" | "substack"
 * @property {string} url       The post on its home platform
 * @property {boolean} [featured]
 * @property {string} [excerpt]  Featured post only
 * @property {{ image: string, alt: string } | null} [cover]  Featured post only
 *
 * @typedef {Record<string, { label: string, profileUrl: string }>} Platforms
 */

/** Posts shown in "More writing" before (and per) "Load more". */
export const BLOG_PAGE_SIZE = 10;

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DATE_FORMAT = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

/**
 * Timestamp of an ISO date, or null for placeholders and anything unparseable.
 * @param {unknown} date
 */
export function postTime(date) {
  if (typeof date !== 'string' || !ISO_DATE.test(date)) return null;
  const time = Date.parse(`${date}T00:00:00Z`);
  return Number.isNaN(time) ? null : time;
}

/**
 * "2026-03-14" → "14 Mar 2026". Placeholders are returned unchanged.
 * @param {string} date
 */
export function formatPostDate(date) {
  const time = postTime(date);
  return time === null ? date : DATE_FORMAT.format(time);
}

/**
 * Newest first. Posts without a real date keep their file order, after the dated ones.
 * @param {Post[]} posts
 */
export function sortNewestFirst(posts) {
  const dated = posts
    .filter((post) => postTime(post.date) !== null)
    .sort((a, b) => postTime(b.date) - postTime(a.date));
  const undated = posts.filter((post) => postTime(post.date) === null);
  return [...dated, ...undated];
}

/**
 * The featured post is the first one flagged `featured: true`, or else the newest.
 * The rest are returned newest first.
 * @param {Post[]} posts
 * @returns {{ featured: Post | null, rest: Post[] }}
 */
export function splitFeatured(posts) {
  const sorted = sortNewestFirst(posts);
  const featured = posts.find((post) => post.featured) ?? sorted[0] ?? null;
  return { featured, rest: sorted.filter((post) => post !== featured) };
}

/**
 * Display name of a platform key, e.g. "medium" → "Medium".
 * @param {Platforms} platforms
 * @param {string} key
 */
export function platformLabel(platforms, key) {
  return platforms[key]?.label ?? key.charAt(0).toUpperCase() + key.slice(1);
}
