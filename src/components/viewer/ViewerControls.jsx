import Arrow from '@/components/ui/Arrow';
import Picture from '@/components/ui/Picture';
import { cx } from '@/lib/cx';
import styles from './Viewer.module.css';

/**
 * Prev / Next buttons under the stage.
 *
 * @param {{ noun: string, onPrev: () => void, onNext: () => void }} props
 */
export function ViewerControls({ noun, onPrev, onNext }) {
  return (
    <div className={styles.controls}>
      <button
        type="button"
        className="btn btn-outline"
        onClick={onPrev}
        aria-label={`Previous ${noun}`}
      >
        <Arrow>←</Arrow> Prev
      </button>
      <button
        type="button"
        className="btn btn-outline"
        onClick={onNext}
        aria-label={`Next ${noun}`}
      >
        Next <Arrow>→</Arrow>
      </button>
    </div>
  );
}

/**
 * Thumbnail strip. Buttons activate with Enter or Space; the current one is marked.
 *
 * @param {object} props
 * @param {import('@/content').GalleryItem[]} props.items
 * @param {number} props.index
 * @param {(index: number) => void} props.onSelect
 * @param {string} props.label         Accessible name of the list, e.g. "All pieces"
 * @param {'art' | 'wear'} props.variant
 * @param {'stage' | 'panel'} [props.placement] Under the stage (Art) or in the panel (Wear)
 */
export function ViewerThumbnails({ items, index, onSelect, label, variant, placement = 'stage' }) {
  return (
    <ul
      className={cx(styles.thumbs, placement === 'stage' && styles.thumbsUnderStage)}
      data-variant={variant}
      aria-label={label}
    >
      {items.map((item, itemIndex) => (
        <li key={item.slug}>
          <button
            type="button"
            className={styles.thumb}
            aria-label={`Show ${item.title}`}
            aria-current={itemIndex === index ? 'true' : undefined}
            onClick={() => onSelect(itemIndex)}
          >
            <Picture name={item.image} alt="" sizes="56px" className={styles.thumbImage} />
          </button>
        </li>
      ))}
    </ul>
  );
}
