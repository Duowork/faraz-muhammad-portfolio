import { useActionState, useEffect, useRef } from 'react';
import {
  FormNotConfiguredError,
  HONEYPOT_FIELD,
  isLikelySpam,
  submitForm,
  validateMessage,
} from '@/lib/forms';

/**
 * @typedef {object} MessageFormState
 * @property {'idle' | 'invalid' | 'sent' | 'unconfigured' | 'failed'} status
 * @property {import('@/lib/forms').MessageErrors} [errors]
 * @property {Record<string, string>} [values] Submitted values, echoed back so fields keep
 *   their content after React resets the form.
 */

/** @type {MessageFormState} */
const INITIAL_STATE = { status: 'idle' };

/**
 * Shared logic for the Inquire and Contact forms, built on a form action so it maps
 * directly onto a server action later. Validates, filters obvious spam, sends, and
 * moves focus to the first invalid field or to the thank-you message.
 *
 * @param {(values: Record<string, string>) => Record<string, string>} buildPayload
 *   Turns the form's values into what is sent (adds subject, piece name, …).
 */
export function useMessageForm(buildPayload) {
  const formRef = useRef(/** @type {HTMLFormElement | null} */ (null));
  const statusRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const [state, formAction, isPending] = useActionState(
    /**
     * @param {MessageFormState} _previous
     * @param {FormData} formData
     * @returns {Promise<MessageFormState>}
     */
    async (_previous, formData) => {
      const { [HONEYPOT_FIELD]: honeypot = '', ...values } = /** @type {Record<string, string>} */ (
        Object.fromEntries(formData)
      );

      // Pretend success so bots get no signal; nothing is sent.
      if (isLikelySpam({ honeypot, startedAt: startedAt.current })) return { status: 'sent' };

      const errors = validateMessage(values);
      if (Object.keys(errors).length > 0) return { status: 'invalid', errors, values };

      try {
        await submitForm(buildPayload(values));
        return { status: 'sent' };
      } catch (error) {
        console.error('Form submission failed:', error);
        const status = error instanceof FormNotConfiguredError ? 'unconfigured' : 'failed';
        return { status, values };
      }
    },
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.status === 'invalid') {
      formRef.current?.querySelector('[aria-invalid="true"]')?.focus();
    } else if (state.status === 'sent') {
      statusRef.current?.focus();
    }
  }, [state]);

  return { state, formAction, isPending, formRef, statusRef };
}
