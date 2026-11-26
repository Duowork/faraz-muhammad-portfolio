import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import PostList from './PostList';

const PLATFORMS = {
  medium: { label: 'Medium', profileUrl: 'https://medium.com/' },
  substack: { label: 'Substack', profileUrl: 'https://substack.com/' },
};

/** @param {number} count */
function makePosts(count) {
  return Array.from({ length: count }, (_, index) => ({
    title: `Post ${index + 1}`,
    date: '2026-01-01',
    platform: index % 2 ? 'substack' : 'medium',
    url: `https://example.test/post-${index + 1}`,
  }));
}

const rows = () => within(screen.getByRole('list')).getAllByRole('listitem');

describe('PostList', () => {
  it('shows every post and no button when there are ten or fewer', () => {
    render(<PostList posts={makePosts(10)} platforms={PLATFORMS} />);
    expect(rows()).toHaveLength(10);
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });

  it('loads ten more at a time and moves focus to the first new post', async () => {
    const user = userEvent.setup();
    render(<PostList posts={makePosts(23)} platforms={PLATFORMS} />);
    expect(rows()).toHaveLength(10);

    await user.click(screen.getByRole('button', { name: 'Load more' }));
    expect(rows()).toHaveLength(20);
    expect(screen.getByRole('link', { name: /Post 11/ })).toHaveFocus();

    await user.click(screen.getByRole('button', { name: 'Load more' }));
    expect(rows()).toHaveLength(23);
    expect(screen.getByRole('link', { name: /Post 21/ })).toHaveFocus();
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });

  it('makes each whole row one external link that names the platform', () => {
    render(<PostList posts={makePosts(2)} platforms={PLATFORMS} />);
    const link = screen.getByRole('link', { name: /Post 2.*Read on Substack/ });
    expect(link).toHaveAttribute('href', 'https://example.test/post-2');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    expect(within(link).getByRole('heading', { level: 3, name: 'Post 2' })).toBeInTheDocument();
    expect(within(link).getByText('1 Jan 2026').tagName).toBe('TIME');
  });
});
