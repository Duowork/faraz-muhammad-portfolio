import Arrow from '@/components/ui/Arrow';
import { cx } from '@/lib/cx';
import styles from './Room.module.css';

/** Ceiling track with lamps over the wall. Decorative. */
export function TrackLight() {
  return (
    <div className={styles.track} aria-hidden="true">
      <span className={styles.lamp} />
      <span className={styles.lamp} />
      <span className={styles.lamp} />
    </div>
  );
}

/** White pillar between the wall and the feature work (desktop only). Decorative. */
export function Pillar() {
  return <div className={styles.pillar} aria-hidden="true" />;
}

/** Grey floor band at the foot of the room. Decorative. */
export function FloorBand() {
  return <div className={styles.floor} aria-hidden="true" />;
}

/**
 * The room itself. Children are laid out in DOM order on desktop
 * (Art: wall, pillar, feature; Wear: feature, pillar, wall).
 *
 * @param {{ variant: 'art' | 'wear', label: string, children: import('react').ReactNode }} props
 */
export function RoomSection({ variant, label, children }) {
  return (
    <section className={cx(styles.room, styles[variant])} aria-label={label}>
      {children}
    </section>
  );
}

/**
 * Grid of framed works (tablet+) or a swipe strip (mobile). Children are <li> items.
 *
 * @param {{ children: import('react').ReactNode }} props
 */
export function RoomWall({ children }) {
  return (
    <div className={styles.wallColumn}>
      <p className={cx('label muted', styles.stripLabel)}>
        Walk the room <Arrow>→</Arrow>
      </p>
      <ul className={styles.wall}>{children}</ul>
    </div>
  );
}

/**
 * The room's large featured work, plus an optional action below it.
 *
 * @param {{ children: import('react').ReactNode, action?: import('react').ReactNode }} props
 */
export function RoomFeature({ children, action }) {
  return (
    <div className={styles.feature}>
      {children}
      {action ? <div className={styles.featureAction}>{action}</div> : null}
    </div>
  );
}
