import Picture from '@/components/ui/Picture';
import TransitionLink from '@/components/ui/TransitionLink';
import { cx } from '@/lib/cx';
import styles from './Frame.module.css';

/**
 * A framed work on the gallery wall: white mat, thin border, caption below.
 * Links to the work in the viewer.
 *
 * @param {object} props
 * @param {string} props.to          Viewer URL of the work
 * @param {string} props.image       Image name in the manifest
 * @param {string} props.alt
 * @param {string} props.caption     e.g. "untitled ii · [YEAR]"
 * @param {string} props.sizes
 * @param {'art' | 'wear'} props.room  Art is shown whole (contain); looks are cropped (cover)
 * @param {'wall' | 'feature'} [props.variant] Wall grid frame or the room's large feature
 * @param {boolean} [props.priority]
 * @param {string} [props.className]
 */
export default function Frame({
  to,
  image,
  alt,
  caption,
  sizes,
  room,
  variant = 'wall',
  priority = false,
  className,
}) {
  return (
    <TransitionLink
      to={to}
      className={cx(styles.frame, className)}
      data-room={room}
      data-variant={variant}
    >
      <div className={styles.mat}>
        <div className={styles.window}>
          <Picture
            name={image}
            alt={alt}
            sizes={sizes}
            priority={priority}
            className={styles.image}
          />
        </div>
      </div>
      <p className={styles.caption}>
        <span className={styles.title}>{caption}</span>
        <span className={styles.more} aria-hidden="true">
          View ↗
        </span>
      </p>
    </TransitionLink>
  );
}
