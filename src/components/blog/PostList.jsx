import { useEffect, useRef, useState } from 'react';
import { BLOG_PAGE_SIZE, platformLabel } from '@/lib/blog';
import { cx } from '@/lib/cx';
import styles from './Blog.module.css';
import PostRow from './PostRow';

/**
 * "More writing" rows, newest first. Shows `pageSize` posts and a "Load more" button while
 * more remain; after loading, focus moves to the first newly shown post.
 *
 * @param {object} props
 * @param {import('@/lib/blog').Post[]} props.posts  Already sorted, featured post excluded
 * @param {import('@/lib/blog').Platforms} props.platforms
 * @param {number} [props.pageSize]
 */
export default function PostList({ posts, platforms, pageSize = BLOG_PAGE_SIZE }) {
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const listRef = useRef(/** @type {HTMLUListElement | null} */ (null));
  const focusIndex = useRef(/** @type {number | null} */ (null));

  useEffect(() => {
    if (focusIndex.current === null) return;
    listRef.current?.children[focusIndex.current]?.querySelector('a')?.focus();
    focusIndex.current = null;
  }, [visibleCount]);

  const visible = posts.slice(0, visibleCount);
  const hasMore = posts.length > visible.length;

  return (
    <>
      <ul ref={listRef} className={styles.list}>
        {visible.map((post, index) => (
          // The list only grows at the end, so index keys stay stable; placeholder posts
          // can share a title and URL.
          <PostRow
            key={`${index}-${post.url}`}
            post={post}
            platformLabel={platformLabel(platforms, post.platform)}
          />
        ))}
      </ul>
      {hasMore ? (
        <button
          type="button"
          className={cx('btn btn-outline', styles.loadMore)}
          onClick={() => {
            focusIndex.current = visibleCount;
            setVisibleCount((count) => count + pageSize);
          }}
        >
          Load more
        </button>
      ) : null}
    </>
  );
}
