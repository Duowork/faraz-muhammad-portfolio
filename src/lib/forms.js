/**
 * Form validation and delivery. Delivery posts JSON to VITE_FORM_ENDPOINT (e.g. a Formspree
 * form). When the site moves to a server framework, replace `submitForm` with a server action
 * or API route; callers only depend on it resolving or throwing.
 */

/** Pragmatic check: something@something.tld, no spaces. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Bots usually submit within a moment of the page loading. */
export const MIN_FILL_TIME_MS = 2500;

/** Name of the hidden honeypot field (Formspree's convention). */
export const HONEYPOT_FIELD = '_gotcha';

export class FormNotConfiguredError extends Error {
  constructor() {
    super('No form endpoint configured. Set VITE_FORM_ENDPOINT.');
    this.name = 'FormNotConfiguredError';
  }
}

/**
 * @param {string} value
 */
export function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

/**
 * @typedef {{ name?: string, email?: string, message?: string }} MessageErrors
 */

/**
 * Validates the fields shared by the Inquire and Contact forms.
 * @param {{ name?: string, email?: string, message?: string }} values
 * @returns {MessageErrors} An empty object when everything is valid.
 */
export function validateMessage({ name = '', email = '', message = '' }) {
  /** @type {MessageErrors} */
  const errors = {};
  if (!name.trim()) errors.name = 'Please add your name.';
  if (!email.trim()) errors.email = 'Please add your email address.';
  else if (!isValidEmail(email)) errors.email = 'Please check your email address.';
  if (!message.trim()) errors.message = 'Please write a message.';
  return errors;
}

/**
 * Basic spam heuristics: a filled honeypot or an implausibly fast submission.
 * @param {{ honeypot?: string, startedAt: number, now?: number }} input
 */
export function isLikelySpam({ honeypot = '', startedAt, now = Date.now() }) {
  return honeypot.trim() !== '' || now - startedAt < MIN_FILL_TIME_MS;
}

/**
 * Sends a submission to the configured endpoint.
 * @param {Record<string, string>} payload
 * @param {{ endpoint?: string, fetchImpl?: typeof fetch }} [options]
 * @throws {FormNotConfiguredError} when no endpoint is configured
 * @throws {Error} when the endpoint rejects the submission or is unreachable
 */
export async function submitForm(
  payload,
  { endpoint = import.meta.env.VITE_FORM_ENDPOINT, fetchImpl = fetch } = {},
) {
  if (!endpoint) throw new FormNotConfiguredError();

  const response = await fetchImpl(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Form endpoint responded with ${response.status}`);
  }
}
