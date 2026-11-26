import Arrow from '@/components/ui/Arrow';
import Picture from '@/components/ui/Picture';
import TransitionLink from '@/components/ui/TransitionLink';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';
import styles from './DoorTile.module.css';

/**
 * Door into a gallery room: the room's photo under a heavy colour overlay that lifts on hover.
 *
 * @param {{ room: import('@/content').Room, tone: 'dark' | 'light' }} props
 */
export default function DoorTile({ room, tone }) {
  const revealRef = useReveal();

  return (
    <TransitionLink ref={revealRef} to={room.path} className={styles.door} data-tone={tone}>
      <Picture
        name={room.doorImage}
        alt=""
        sizes="(min-width: 1200px) 50vw, 100vw"
        className={styles.image}
      />
      <span className={styles.overlay} aria-hidden="true" />
      <span className={styles.number}>{room.number}</span>
      <span className={styles.body}>
        <span className={styles.title}>{room.title}</span>
        <span className={styles.tagline}>{room.tagline}</span>
        <span className={cx('label', styles.enter)}>
          Enter <Arrow>→</Arrow>
        </span>
      </span>
    </TransitionLink>
  );
}
