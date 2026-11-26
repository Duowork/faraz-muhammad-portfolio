import ExternalLink from '@/components/ui/ExternalLink';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';
import styles from './Blog.module.css';
import PostDate from './PostDate';

/**
 * One post in "More writing": date, serif title, platform, "Read ↗". The whole row is
 * one link. Screen readers hear "Read on Medium" in place of the separate platform label.
 *
 * @param {{ post: import('@/lib/blog').Post, platformLabel: string }} props
 */
export default function PostRow({ post, platformLabel }) {
  const revealRef = useReveal();

  return (
    <li ref={revealRef} className={styles.item}>
      <ExternalLink href={post.url} className={styles.row}>
        <PostDate date={post.date} className={styles.date} />
        <h3 className={cx(styles.title, styles.slide)}>{post.title}</h3>
        <span className={styles.meta}>
          <span className={cx('label muted', styles.platform)} aria-hidden="true">
            {platformLabel}
          </span>
          <span className="label">
            Read <span className="sr-only">on {platformLabel}</span>{' '}
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </span>
        </span>
      </ExternalLink>
    </li>
  );
}
