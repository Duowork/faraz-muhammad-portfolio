import { instagramUrlFor } from '@/content';
import Arrow from '@/components/ui/Arrow';
import ExternalLink from '@/components/ui/ExternalLink';
import styles from './Work.module.css';

/**
 * One fashion week: number, serif title, brands walked, year ↗.
 *
 * @param {{ week: { name: string, brands: string, year: string, url: string | null }, number: number }} props
 */
export default function TimelineRow({ week, number }) {
  return (
    <li>
      <ExternalLink href={instagramUrlFor(week)} className={styles.row}>
        <span className={styles.rowNumber}>{String(number).padStart(2, '0')}</span>
        <span className={styles.rowName}>{week.name}</span>
        <span className={styles.rowMeta}>
          <span className={styles.rowBrands}>{week.brands}</span>
          <span className={styles.rowYear}>
            {week.year} <Arrow>↗</Arrow>
          </span>
        </span>
      </ExternalLink>
    </li>
  );
}
