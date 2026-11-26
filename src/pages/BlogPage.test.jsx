import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderRoute } from '@/test/renderRoute';

describe('blog page', () => {
  it('sits between Gallery and Contact in the nav and is marked current', async () => {
    renderRoute('/blog');
    const nav = await screen.findByRole('navigation', { name: 'Main' });
    const labels = within(nav)
      .getAllByRole('link')
      .map((link) => link.textContent);
    expect(labels.slice(0, 5)).toEqual(['About', 'Work', 'Gallery', 'Blog', 'Contact']);
    expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute('aria-current', 'page');
  });

  it('shows the placeholder featured post as one link to its platform', async () => {
    renderRoute('/blog');
    const featured = await screen.findByRole('link', { name: /FEATURED POST TITLE/ });
    expect(featured).toHaveAttribute('href', 'https://medium.com/');
    expect(featured).toHaveAttribute('target', '_blank');
    expect(featured).toHaveTextContent('Featured · Medium · [DATE]');
    expect(featured).toHaveTextContent('Read on Medium');
    expect(featured).toHaveTextContent('[EXCERPT: one or two lines from the piece.]');
  });

  it('lists the other posts under "More writing"', async () => {
    renderRoute('/blog');
    const section = await screen.findByRole('region', { name: 'More writing' });
    const rows = within(section).getAllByRole('listitem');
    expect(rows).toHaveLength(5);
    expect(within(rows[1]).getByRole('link')).toHaveAttribute('href', 'https://substack.com/');
    expect(within(rows[1]).getByRole('link', { name: /Read on Substack/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Load more' })).not.toBeInTheDocument();
  });

  it('links the band buttons to each platform profile', async () => {
    renderRoute('/blog');
    expect(await screen.findByText('Follow the writing.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /^Medium/ })).toHaveAttribute(
      'href',
      'https://medium.com/',
    );
    expect(screen.getByRole('link', { name: /^Substack/ })).toHaveAttribute(
      'href',
      'https://substack.com/',
    );
  });

  it('has one h1 and the standard landmarks', async () => {
    renderRoute('/blog');
    await screen.findByRole('heading', { level: 1, name: 'Blog' });
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
