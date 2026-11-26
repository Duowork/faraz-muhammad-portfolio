import { work } from '@/content';
import Arrow from '@/components/ui/Arrow';
import TransitionLink from '@/components/ui/TransitionLink';
import { cx } from '@/lib/cx';
import styles from './WorkTeaser.module.css';

/** Home-page Work teaser. The whole block links to /work. */
export default function WorkTeaser() {
  return (
    <section id="work" className={styles.teaser} aria-labelledby="work-teaser-title">
      <TransitionLink to="/work" className={styles.cta}>
        <p className={cx('label muted', styles.eyebrow)}>Work · with &amp; for others</p>
        <h2 id="work-teaser-title" className={styles.title}>
          Work
        </h2>
        <p className={styles.lede}>{work.teaser}</p>
        <ul className={styles.rows}>
          {work.fashionWeeks.map((week) => (
            <li key={week.name} className={styles.row}>
              <span className={styles.rowName}>{week.name}</span>
              <span className={styles.rowYear}>{week.year}</span>
            </li>
          ))}
        </ul>
        <span className={cx('label', styles.go)}>
          See all work <Arrow>→</Arrow>
        </span>
      </TransitionLink>
    </section>
  );
}
