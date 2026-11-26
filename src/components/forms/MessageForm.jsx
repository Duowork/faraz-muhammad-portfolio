import { site } from '@/content';
import EmailLink from '@/components/ui/EmailLink';
import { cx } from '@/lib/cx';
import { HONEYPOT_FIELD } from '@/lib/forms';
import { isFilled } from '@/lib/placeholder';
import Field from './Field';
import styles from './Form.module.css';
import { useMessageForm } from './useMessageForm';

/**
 * Hidden field that people never see or fill; bots often do.
 */
function Honeypot() {
  return (
    <div className={styles.honeypot} aria-hidden="true">
      <label>
        Leave this field empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

/**
 * @param {{ status: string }} props
 */
function DeliveryError({ status }) {
  const fallback = isFilled(site.email) ? (
    <>
      {' '}
      You can also email <EmailLink address={site.email} />.
    </>
  ) : null;

  return (
    <p className={styles.formError} role="alert">
      {status === 'unconfigured'
        ? 'Sending messages is not set up yet.'
        : 'Your message could not be sent. Please try again.'}
      {fallback}
    </p>
  );
}

/**
 * Name, email, (extra fields), message, with validation, spam filtering and a thank-you state.
 * Used by the Inquire form (per art piece) and the Contact form.
 *
 * @param {object} props
 * @param {(values: Record<string, string>) => Record<string, string>} props.buildPayload
 * @param {string} props.submitLabel
 * @param {(values: Record<string, string>) => import('react').ReactNode} [props.renderExtraFields]
 *   Fields between Email and Message (receives the echoed values for their defaults).
 * @param {number} [props.messageRows]
 * @param {import('react').ReactNode} [props.intro] Content above the fields
 * @param {string} [props.className]
 */
export default function MessageForm({
  buildPayload,
  submitLabel,
  renderExtraFields,
  messageRows = 4,
  intro,
  className,
}) {
  const { state, formAction, isPending, formRef, statusRef } = useMessageForm(buildPayload);
  const values = state.values ?? {};
  const errors = state.errors ?? {};

  if (state.status === 'sent') {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className={cx(styles.thanks, className)}>
        <p className={styles.thanksTitle}>Thank you.</p>
        <p className={styles.thanksText}>Your message has been sent.</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} noValidate className={cx(styles.form, className)}>
      {intro}
      <Field
        label="Name"
        name="name"
        autoComplete="name"
        defaultValue={values.name}
        error={errors.name}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        defaultValue={values.email}
        error={errors.email}
      />
      {renderExtraFields?.(values)}
      <Field
        label="Message"
        name="message"
        as="textarea"
        rows={messageRows}
        defaultValue={values.message}
        error={errors.message}
      />
      <Honeypot />
      {state.status === 'unconfigured' || state.status === 'failed' ? (
        <DeliveryError status={state.status} />
      ) : null}
      <button
        type="submit"
        className={cx('btn btn-primary btn-wide', styles.submit)}
        disabled={isPending}
      >
        {isPending ? 'Sending…' : submitLabel}
      </button>
    </form>
  );
}
