import { act, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { renderRoute } from '@/test/renderRoute';

/** @param {string} name */
const findTitle = (name) => screen.findByRole('heading', { level: 1, name });

describe('art viewer', () => {
  it('deep-links to the work in the URL', async () => {
    renderRoute('/art/untitled-iv');
    expect(await findTitle('untitled iv')).toBeInTheDocument();
    expect(screen.getByText('04 / 13')).toBeInTheDocument();
    expect(document.title).toBe('untitled iv — Faraz Muhammad');
    expect(
      screen.getByRole('img', { name: 'Illustration of a figure lying in red on a dark floor' }),
    ).toBeInTheDocument();
    expect(screen.getByText('About: untitled iv')).toBeInTheDocument();
  });

  it('moves between works with ← / → and updates the URL', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/art/untitled-iv');
    await findTitle('untitled iv');

    await user.keyboard('{ArrowRight}');
    expect(await findTitle('untitled v')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/art/untitled-v');

    await user.keyboard('{ArrowLeft}{ArrowLeft}');
    expect(await findTitle('untitled iii')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/art/untitled-iii');
  });

  it('wraps around with Prev / Next', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/art/untitled-i');
    await findTitle('untitled i');

    await user.click(screen.getByRole('button', { name: 'Previous piece' }));
    expect(await findTitle('untitled xiii')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/art/untitled-xiii');

    await user.click(screen.getByRole('button', { name: 'Next piece' }));
    expect(await findTitle('untitled i')).toBeInTheDocument();
  });

  it('jumps to a work from its thumbnail and marks it current', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/art/untitled-i');
    await findTitle('untitled i');

    await user.click(screen.getByRole('button', { name: 'Show untitled xii' }));
    expect(await findTitle('untitled xii')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/art/untitled-xii');
    expect(screen.getByRole('button', { name: 'Show untitled xii' })).toHaveAttribute(
      'aria-current',
      'true',
    );
  });

  it('supports the browser back button', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/art/untitled-ii');
    await findTitle('untitled ii');
    await user.keyboard('{ArrowRight}');
    await findTitle('untitled iii');

    await act(() => router.navigate(-1));
    expect(await findTitle('untitled ii')).toBeInTheDocument();
  });

  it('closes to the room with Esc', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/art/untitled-iv');
    await findTitle('untitled iv');

    await user.keyboard('{Escape}');
    expect(await findTitle('Art')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/art');
  });

  it('ignores arrow keys and Esc while typing in the inquiry form', async () => {
    const user = userEvent.setup();
    const { router } = renderRoute('/art/untitled-iv');
    await findTitle('untitled iv');

    await user.click(screen.getByLabelText('Name'));
    await user.keyboard('Ada{ArrowLeft}{ArrowRight}{Escape}');
    expect(router.state.location.pathname).toBe('/art/untitled-iv');
    expect(screen.getByLabelText('Name')).toHaveValue('Ada');
  });

  it('changes work on a horizontal swipe', async () => {
    const { router } = renderRoute('/art/untitled-iv');
    await findTitle('untitled iv');
    const stage = screen.getByRole('img', {
      name: 'Illustration of a figure lying in red on a dark floor',
    }).parentElement;

    fireEvent.pointerDown(stage, { pointerType: 'touch', clientX: 300, clientY: 100 });
    fireEvent.pointerUp(stage, { pointerType: 'touch', clientX: 120, clientY: 110 });
    expect(await findTitle('untitled v')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/art/untitled-v');
  });

  it('returns to the room from "← Art" and "Close ×"', async () => {
    renderRoute('/art/untitled-iv');
    await findTitle('untitled iv');
    expect(screen.getByRole('link', { name: 'Back to Art' })).toHaveAttribute('href', '/art');
    expect(screen.getByRole('link', { name: 'Close piece view' })).toHaveAttribute('href', '/art');
  });
});

describe('wear viewer', () => {
  it('deep-links to a look and lists every look', async () => {
    renderRoute('/wear/look-iii');
    expect(await findTitle('look iii')).toBeInTheDocument();
    expect(screen.getByText('03 / 07')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^Show look/ })).toHaveLength(7);
    expect(screen.getByRole('link', { name: 'Close look viewer' })).toHaveAttribute(
      'href',
      '/wear',
    );
  });
});
