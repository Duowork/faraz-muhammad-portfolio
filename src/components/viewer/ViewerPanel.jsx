import { cx } from '@/lib/cx';
import styles from './Viewer.module.css';

/**
 * Top of the info panel: "Art · Room 02" and the work's title.
 *
 * @param {{ eyebrow: string, title: string }} props
 */
export function ViewerHeading({ eyebrow, title }) {
  return (
    <>
      <p className={cx('label muted', styles.eyebrow)}>{eyebrow}</p>
      <h1 className={styles.title}>{title}</h1>
    </>
  );
}

/**
 * Small grey details line(s) under the title.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function ViewerMeta({ children }) {
  return <p className={styles.meta}>{children}</p>;
}

/**
 * A line or two of description (Wear looks).
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function ViewerCaption({ children }) {
  return <p className={styles.caption}>{children}</p>;
}

/**
 * @param {{ children: import('react').ReactNode }} props
 */
export function ViewerActions({ children }) {
  return <div className={styles.actions}>{children}</div>;
}

/**
 * A ruled-off block lower in the panel (Inquire form, "All looks").
 *
 * @param {{ children: import('react').ReactNode, id?: string, label?: string }} props
 *   `label` renders a small heading such as "All looks".
 */
export function ViewerSection({ children, id, label }) {
  return (
    <section id={id} className={styles.section}>
      {label ? <h2 className={cx('label muted', styles.sectionLabel)}>{label}</h2> : null}
      {children}
    </section>
  );
}
