import ExternalLink from '@/components/ui/ExternalLink';
import Picture from '@/components/ui/Picture';
import { cx } from '@/lib/cx';
import styles from './Blog.module.css';
import PostDate from './PostDate';

/**
 * The featured post: 4:3 cover beside the text (desktop), stacked image-first below 1200px.
 * The whole block is one link to the post on its home platform.
 *
 * @param {{ post: import('@/lib/blog').Post, platformLabel: string }} props
 */
export default function FeaturedPost({ post, platformLabel }) {
  return (
    <section className={styles.featured} aria-labelledby="featured-title">
      <ExternalLink href={post.url} className={styles.featuredLink}>
        <div className={styles.cover}>
          {post.cover ? (
            <Picture
              name={post.cover.image}
              alt={post.cover.alt}
              sizes="(min-width: 1200px) 50vw, 100vw"
              priority
              className={styles.coverImage}
            />
          ) : (
            <span className="label muted" aria-hidden="true">
              [COVER IMAGE]
            </span>
          )}
        </div>
        <div className={styles.featuredText}>
          <p className="label muted">
            Featured · {platformLabel} · <PostDate date={post.date} />
          </p>
          <div className={styles.featuredBody}>
            <h2 id="featured-title" className={cx(styles.featuredTitle, styles.slide)}>
              {post.title}
            </h2>
            {post.excerpt ? <p className={styles.excerpt}>{post.excerpt}</p> : null}
          </div>
          <span className={cx('label', styles.cta)}>
            Read on {platformLabel}{' '}
            <span className={styles.arrow} aria-hidden="true">
              ↗
            </span>
          </span>
        </div>
      </ExternalLink>
    </section>
  );
}
