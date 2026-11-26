import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderRoute } from '@/test/renderRoute';

describe('routes', () => {
  it.each([
    ['/', 'Faraz Muhammad', 'Faraz Muhammad'],
    ['/work', 'Work', 'Work — Faraz Muhammad'],
    ['/wear', 'Wear', 'Wear — Faraz Muhammad'],
    ['/art', 'Art', 'Art — Faraz Muhammad'],
    ['/blog', 'Blog', 'Blog — Faraz Muhammad'],
    ['/contact', 'Contact', 'Contact — Faraz Muhammad'],
  ])('%s renders its page and title', async (path, heading, title) => {
    renderRoute(path);
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
    expect(document.title).toBe(title);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it.each(['/nowhere', '/art/untitled-xx', '/wear/look-ix'])(
    '%s shows the 404 page with ways back in',
    async (path) => {
      renderRoute(path);
      expect(await screen.findByRole('heading', { level: 1, name: '404' })).toBeInTheDocument();
      expect(document.title).toBe('Page not found — Faraz Muhammad');
      expect(screen.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Enter Wear' })).toHaveAttribute('href', '/wear');
      expect(screen.getByRole('link', { name: 'Enter Art' })).toHaveAttribute('href', '/art');
    },
  );

  it('marks Gallery as current in both rooms', async () => {
    renderRoute('/wear');
    const nav = await screen.findByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('link', { name: 'Gallery' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(within(nav).getByRole('link', { name: 'Work' })).not.toHaveAttribute('aria-current');
  });

  it('switches rooms with the Wear / Art tabs', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/wear');
    const tabs = await screen.findByRole('navigation', { name: 'Gallery rooms' });
    await user.click(within(tabs).getByRole('link', { name: 'Art' }));
    expect(await screen.findByRole('heading', { level: 1, name: 'Art' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/art');
  });

  it('links each frame in a room to its own viewer URL', async () => {
    renderRoute('/art');
    const frame = await screen.findByRole('link', { name: /figure lying in red on a dark floor/i });
    expect(frame).toHaveAttribute('href', '/art/untitled-iv');
    expect(screen.getByRole('link', { name: 'Inquire about untitled i' })).toHaveAttribute(
      'href',
      '/art/untitled-i#inquire',
    );
  });

  it('opens Instagram links in a new tab', async () => {
    renderRoute('/');
    const [headerLink] = await screen.findAllByRole('link', { name: /@sixhunred/ });
    expect(headerLink).toHaveAttribute('href', 'https://www.instagram.com/sixhunred/');
    expect(headerLink).toHaveAttribute('target', '_blank');
    expect(headerLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('keeps placeholders visible and unlinked until filled', async () => {
    renderRoute('/contact');
    expect(await screen.findByText('[EMAIL]')).not.toHaveAttribute('href');
    expect(screen.getByText('[PRESS EMAIL]')).toBeInTheDocument();
    expect(
      screen.getByText('Download comp card & press kit (PDF)').closest('[aria-disabled]'),
    ).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('work page', () => {
  it('filters brands and campaigns by type', async () => {
    const user = userEvent.setup();
    renderRoute('/work');
    await screen.findByRole('heading', { level: 1, name: 'Work' });
    expect(screen.getAllByText(/^(Runway|Campaign|Editorial) ·/)).toHaveLength(9);

    await user.click(screen.getByRole('button', { name: 'Runway' }));
    expect(screen.getByRole('button', { name: 'Runway' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getAllByText(/^Runway ·/)).toHaveLength(3);
    expect(screen.queryByText(/^Campaign ·/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'All' }));
    expect(screen.getAllByText(/^(Runway|Campaign|Editorial) ·/)).toHaveLength(9);
  });
});
