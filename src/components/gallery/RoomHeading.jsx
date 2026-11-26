import { artRoom, wearRoom } from '@/content';
import TransitionLink from '@/components/ui/TransitionLink';
import { cx } from '@/lib/cx';
import styles from './Room.module.css';

const ROOMS = [wearRoom, artRoom];

/**
 * Room number, title and the Wear ⇄ Art tabs (a slower crossfade between rooms).
 *
 * @param {{ room: import('@/content').Room }} props
 */
export default function RoomHeading({ room }) {
  return (
    <div className={styles.heading}>
      <div>
        <p className={cx('label muted', styles.number)}>{room.number}</p>
        <h1 className={styles.title}>{room.title}</h1>
      </div>
      <nav aria-label="Gallery rooms">
        <ul className={styles.tabs}>
          {ROOMS.map((tab) => (
            <li key={tab.path}>
              {tab.path === room.path ? (
                <span className={cx('label', styles.currentTab)} aria-current="page">
                  {tab.title}
                </span>
              ) : (
                <TransitionLink room to={tab.path} className="label muted">
                  {tab.title}
                </TransitionLink>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
