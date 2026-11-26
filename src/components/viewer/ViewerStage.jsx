import { useState } from 'react';
import Picture from '@/components/ui/Picture';
import { useSwipe } from '@/hooks/useSwipe';
import { cx } from '@/lib/cx';
import { neighbourIndexes } from '@/lib/viewer';
import styles from './Viewer.module.css';

const STAGE_SIZES = '(min-width: 768px) 560px, calc(100vw - 66px)';

/**
 * Framed stage where works crossfade (350ms). Only the current work, its neighbours and
 * works already seen are mounted: neighbours preload for instant Prev/Next, and seen works
 * stay mounted so jumping back still crossfades. Swipe left/right on touch screens.
 *
 * @param {object} props
 * @param {import('@/content').GalleryItem[]} props.items
 * @param {number} props.index
 * @param {'art' | 'wear'} props.variant  Art is contained on white; looks are cropped
 * @param {() => void} props.onPrev
 * @param {() => void} props.onNext
 */
export default function ViewerStage({ items, index, variant, onPrev, onNext }) {
  const total = items.length;
  const [initialIndex] = useState(index);
  const [trackedIndex, setTrackedIndex] = useState(index);
  const [mounted, setMounted] = useState(() => new Set(neighbourIndexes(index, total)));

  // Adjust state while rendering when the index changes (no extra effect pass).
  if (trackedIndex !== index) {
    setTrackedIndex(index);
    setMounted((previous) => new Set([...previous, ...neighbourIndexes(index, total)]));
  }

  const swipe = useSwipe({ onSwipeLeft: onNext, onSwipeRight: onPrev });

  return (
    <div className={styles.frame}>
      <div className={styles.stage} data-variant={variant} {...swipe}>
        {items.map((item, itemIndex) =>
          mounted.has(itemIndex) ? (
            <Picture
              key={item.slug}
              name={item.image}
              alt={itemIndex === index ? item.alt : ''}
              sizes={STAGE_SIZES}
              priority={itemIndex === initialIndex}
              className={cx(styles.image, itemIndex === index && styles.current)}
            />
          ) : null,
        )}
      </div>
    </div>
  );
}
