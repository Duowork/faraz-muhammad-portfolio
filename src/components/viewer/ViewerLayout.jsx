import Arrow from '@/components/ui/Arrow';
import TransitionLink from '@/components/ui/TransitionLink';
import { formatCounter } from '@/lib/viewer';
import styles from './Viewer.module.css';

/**
 * Viewer page chrome on white: "← Room", counter, "Close ×", then the stage column and
 * the info panel. Announces the current work to screen readers when it changes.
 *
 * @param {object} props
 * @param {import('@/content').Room} props.room
 * @param {{ title: string }} props.item  The work being shown
 * @param {number} props.index
 * @param {number} props.total
 * @param {string} props.closeLabel  Accessible name for "Close ×"
 * @param {import('react').ReactNode} props.stage
 * @param {import('react').ReactNode} props.panel
 */
export default function ViewerLayout({ room, item, index, total, closeLabel, stage, panel }) {
  return (
    <div className={styles.viewer} data-surface="white">
      <header className={styles.header}>
        <TransitionLink to={room.path} className="label" aria-label={`Back to ${room.title}`}>
          <Arrow>←</Arrow> {room.title}
        </TransitionLink>
        <p className={styles.counter} aria-hidden="true">
          {formatCounter(index, total)}
        </p>
        <TransitionLink to={room.path} className="label" aria-label={closeLabel}>
          Close <Arrow>×</Arrow>
        </TransitionLink>
      </header>

      <main id="main" tabIndex={-1} className={styles.main}>
        <div className={styles.stageColumn}>{stage}</div>
        <div className={styles.panel}>{panel}</div>
      </main>

      <p className="sr-only" aria-live="polite" aria-atomic="true">
        {`${item.title}, ${index + 1} of ${total}`}
      </p>
    </div>
  );
}
