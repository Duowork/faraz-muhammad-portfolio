import { describe, expect, it } from 'vitest';
import { formatPostDate, platformLabel, postTime, sortNewestFirst, splitFeatured } from './blog';

/** @param {string} title @param {string} date @param {object} [extra] */
const post = (title, date, extra = {}) => ({
  title,
  date,
  platform: 'medium',
  url: `https://medium.com/${title}`,
  ...extra,
});

describe('blog dates', () => {
  it('formats ISO dates and leaves placeholders alone', () => {
    expect(formatPostDate('2026-03-14')).toBe('14 Mar 2026');
    expect(formatPostDate('[DATE]')).toBe('[DATE]');
    expect(postTime('14/03/2026')).toBeNull();
    expect(postTime('2026-13-45')).toBeNull();
  });
});

describe('ordering', () => {
  it('sorts newest first and keeps undated posts after, in file order', () => {
    const posts = [
      post('a', '[DATE]'),
      post('b', '2025-01-02'),
      post('c', '2026-05-01'),
      post('d', '[DATE]'),
    ];
    expect(sortNewestFirst(posts).map((p) => p.title)).toEqual(['c', 'b', 'a', 'd']);
  });
});

describe('featured post', () => {
  it('uses the first post flagged featured', () => {
    const posts = [
      post('new', '2026-05-01'),
      post('pick', '2024-01-01', { featured: true }),
      post('also', '2025-01-01', { featured: true }),
    ];
    const { featured, rest } = splitFeatured(posts);
    expect(featured.title).toBe('pick');
    expect(rest.map((p) => p.title)).toEqual(['new', 'also']);
  });

  it('falls back to the newest post', () => {
    const { featured, rest } = splitFeatured([
      post('old', '2024-01-01'),
      post('new', '2026-01-01'),
    ]);
    expect(featured.title).toBe('new');
    expect(rest.map((p) => p.title)).toEqual(['old']);
  });

  it('handles an empty list', () => {
    expect(splitFeatured([])).toEqual({ featured: null, rest: [] });
  });
});

describe('platformLabel', () => {
  it('reads the label, or capitalises an unknown key', () => {
    const platforms = { medium: { label: 'Medium', profileUrl: 'https://medium.com/' } };
    expect(platformLabel(platforms, 'medium')).toBe('Medium');
    expect(platformLabel(platforms, 'ghost')).toBe('Ghost');
  });
});
