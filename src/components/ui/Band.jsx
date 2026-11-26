import { cx } from '@/lib/cx';
import styles from './Band.module.css';

/**
 * Full-width closing band: a serif line on the left, an action on the right.
 *
 * Variants:
 * - "link"    a large italic link ("Instagram is the full archive…", "Working with a brand…")
 * - "buttons" a smaller line with a row of buttons ("Follow the writing." on the Blog)
 *
 * @param {object} props
 * @param {string} props.text
 * @param {import('react').ReactNode} props.children The link, or the buttons
 * @param {'link' | 'buttons'} [props.variant]
 * @param {boolean} [props.compactLink] Slightly smaller link on mobile for long labels
 */
export default function Band({ text, children, variant = 'link', compactLink = false }) {
  const isButtons = variant === 'buttons';
  return (
    <section
      className={cx(styles.band, isButtons && styles.buttonsBand, compactLink && styles.compact)}
    >
      <p className={styles.text}>{text}</p>
      <div className={isButtons ? styles.buttons : styles.action}>{children}</div>
    </section>
  );
}
