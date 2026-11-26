import { cx } from '@/lib/cx';
import styles from './Band.module.css';

/**
 * Full-width closing band: a serif line on the left, a large italic link on the right
 * ("Instagram is the full archive…", "Working with a brand or agency?").
 *
 * @param {object} props
 * @param {string} props.text
 * @param {import('react').ReactNode} props.children The link
 * @param {boolean} [props.compactLink] Slightly smaller link on mobile for long labels
 */
export default function Band({ text, children, compactLink = false }) {
  return (
    <section className={cx(styles.band, compactLink && styles.compact)}>
      <p className={styles.text}>{text}</p>
      <div className={styles.action}>{children}</div>
    </section>
  );
}
