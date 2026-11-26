import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderRoute } from '@/test/renderRoute';

const ENDPOINT = 'https://forms.test/submit';

/** The spam timer rejects instant submissions; let "time pass" before sending. */
function fakeClock() {
  let now = 1_000_000;
  vi.spyOn(Date, 'now').mockImplementation(() => now);
  return { advance: (ms) => (now += ms) };
}

/** @param {import('@testing-library/user-event').UserEvent} user */
async function fillMessage(
  user,
  { name = 'Ada Obi', email = 'ada@studio.test', message = 'Hello' } = {},
) {
  await user.type(screen.getByLabelText('Name'), name);
  await user.type(screen.getByLabelText('Email'), email);
  await user.type(screen.getByLabelText('Message'), message);
}

describe('contact form', () => {
  let clock;
  beforeEach(() => {
    clock = fakeClock();
  });

  it('shows errors, keeps typed values and focuses the first invalid field', async () => {
    const user = userEvent.setup();
    renderRoute('/contact');
    await screen.findByRole('heading', { level: 1, name: 'Contact' });

    await user.type(screen.getByLabelText('Email'), 'not-an-email');
    clock.advance(5000);
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('Please add your name.')).toBeInTheDocument();
    expect(screen.getByText('Please check your email address.')).toBeInTheDocument();
    expect(screen.getByText('Please write a message.')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByLabelText('Name')).toHaveFocus();
    expect(screen.getByLabelText('Email')).toHaveValue('not-an-email');
  });

  it('sends to the endpoint and thanks the sender', async () => {
    vi.stubEnv('VITE_FORM_ENDPOINT', ENDPOINT);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderRoute('/contact');
    await screen.findByRole('heading', { level: 1, name: 'Contact' });

    await fillMessage(user);
    await user.selectOptions(screen.getByLabelText("I'm writing about"), 'Press');
    clock.advance(5000);
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('Thank you.')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveFocus();
    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, request] = fetchMock.mock.calls[0];
    expect(url).toBe(ENDPOINT);
    expect(JSON.parse(request.body)).toEqual({
      _subject: 'Website message: Press',
      form: 'contact',
      topic: 'Press',
      name: 'Ada Obi',
      email: 'ada@studio.test',
      message: 'Hello',
    });
  });

  it('explains when sending is not set up, keeping the message', async () => {
    vi.stubEnv('VITE_FORM_ENDPOINT', '');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const user = userEvent.setup();
    renderRoute('/contact');
    await screen.findByRole('heading', { level: 1, name: 'Contact' });

    await fillMessage(user);
    clock.advance(5000);
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Sending messages is not set up yet.',
    );
    expect(screen.getByLabelText('Message')).toHaveValue('Hello');
  });

  it('drops submissions that are too fast to be human', async () => {
    vi.stubEnv('VITE_FORM_ENDPOINT', ENDPOINT);
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderRoute('/contact');
    await screen.findByRole('heading', { level: 1, name: 'Contact' });

    await fillMessage(user);
    await user.click(screen.getByRole('button', { name: 'Send' }));

    expect(await screen.findByText('Thank you.')).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('inquiry form', () => {
  it('names the piece in the message', async () => {
    const clock = fakeClock();
    vi.stubEnv('VITE_FORM_ENDPOINT', ENDPOINT);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);
    const user = userEvent.setup();
    renderRoute('/art/untitled-iv');
    await screen.findByRole('heading', { level: 1, name: 'untitled iv' });

    await fillMessage(user, { message: 'Is this available?' });
    clock.advance(5000);
    await user.click(screen.getByRole('button', { name: 'Send inquiry' }));

    expect(await screen.findByText('Thank you.')).toBeInTheDocument();
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(payload).toMatchObject({
      _subject: 'Inquiry: untitled iv',
      form: 'inquiry',
      piece: 'untitled iv',
      message: 'Is this available?',
    });
  });
});
