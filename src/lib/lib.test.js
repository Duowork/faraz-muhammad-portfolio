import { describe, expect, it, vi } from 'vitest';
import {
  FormNotConfiguredError,
  isLikelySpam,
  isValidEmail,
  MIN_FILL_TIME_MS,
  submitForm,
  validateMessage,
} from './forms';
import { isFilled, isPlaceholder } from './placeholder';
import { formatCounter, neighbourIndexes, wrapIndex } from './viewer';

describe('placeholders', () => {
  it('recognises bracketed content', () => {
    expect(isPlaceholder('[EMAIL]')).toBe(true);
    expect(isPlaceholder(' [CAPTION — a line or two] ')).toBe(true);
    expect(isPlaceholder('hello@example.com')).toBe(false);
    expect(isPlaceholder(null)).toBe(false);
  });

  it('treats empty and placeholder values as unfilled', () => {
    expect(isFilled('hello@example.com')).toBe(true);
    expect(isFilled('[EMAIL]')).toBe(false);
    expect(isFilled('   ')).toBe(false);
    expect(isFilled(undefined)).toBe(false);
  });
});

describe('viewer maths', () => {
  it('wraps indexes at both ends', () => {
    expect(wrapIndex(-1, 13)).toBe(12);
    expect(wrapIndex(13, 13)).toBe(0);
    expect(wrapIndex(4, 13)).toBe(4);
  });

  it('formats the counter with two digits', () => {
    expect(formatCounter(3, 13)).toBe('04 / 13');
    expect(formatCounter(0, 7)).toBe('01 / 07');
  });

  it('lists the current work and its neighbours', () => {
    expect(neighbourIndexes(0, 7)).toEqual([0, 1, 6]);
  });
});

describe('form validation', () => {
  it('requires name, a valid email and a message', () => {
    expect(validateMessage({})).toEqual({
      name: 'Please add your name.',
      email: 'Please add your email address.',
      message: 'Please write a message.',
    });
    expect(validateMessage({ name: 'A', email: 'nope', message: 'Hi' })).toEqual({
      email: 'Please check your email address.',
    });
    expect(validateMessage({ name: 'A', email: 'a@b.co', message: 'Hi' })).toEqual({});
  });

  it('checks email shape', () => {
    expect(isValidEmail(' person@studio.com ')).toBe(true);
    expect(isValidEmail('person@studio')).toBe(false);
    expect(isValidEmail('per son@studio.com')).toBe(false);
  });

  it('flags filled honeypots and instant submissions as spam', () => {
    expect(isLikelySpam({ honeypot: 'x', startedAt: 0, now: 60_000 })).toBe(true);
    expect(isLikelySpam({ startedAt: 0, now: MIN_FILL_TIME_MS - 1 })).toBe(true);
    expect(isLikelySpam({ startedAt: 0, now: MIN_FILL_TIME_MS })).toBe(false);
  });
});

describe('submitForm', () => {
  it('throws a configuration error without an endpoint', async () => {
    await expect(submitForm({ a: '1' }, { endpoint: '' })).rejects.toBeInstanceOf(
      FormNotConfiguredError,
    );
  });

  it('posts JSON to the endpoint', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    await submitForm({ name: 'Ada' }, { endpoint: 'https://forms.test/f', fetchImpl });
    expect(fetchImpl).toHaveBeenCalledWith('https://forms.test/f', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: 'Ada' }),
    });
  });

  it('rejects when the endpoint refuses the submission', async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 422 });
    await expect(submitForm({}, { endpoint: 'https://forms.test/f', fetchImpl })).rejects.toThrow(
      '422',
    );
  });
});
