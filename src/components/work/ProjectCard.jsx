import { instagramUrlFor } from '@/content';
import ExternalLink from '@/components/ui/ExternalLink';
import Picture from '@/components/ui/Picture';
import styles from './Work.module.css';

const PLACEHOLDER_TONES = ['#161616', '#d9d9d5', '#8d8d89', '#f0f0ec', '#2a2a2a', '#b5b5b0'];
const DARK_TONES = new Set(['#161616', '#2a2a2a', '#8d8d89']);

/**
 * Grey block with a figure silhouette, shown until a project has a real image.
 *
 * @param {{ seed: number }} props
 */
function PlaceholderFigure({ seed }) {
  const background = PLACEHOLDER_TONES[(seed * 5 + 2) % PLACEHOLDER_TONES.length];
  const figure = DARK_TONES.has(background) ? '#f0f0ec' : '#161616';
  return (
    <div className={styles.placeholder} style={{ background }} aria-hidden="true">
      <span className={styles.placeholderHead} style={{ background: figure }} />
      <span className={styles.placeholderBody} style={{ background: figure }} />
    </div>
  );
}

/**
 * A brand, campaign or editorial. Links to its Instagram post.
 *
 * @param {{ project: import('@/content').Project, seed: number }} props
 *   `seed` keeps each placeholder's tone stable when the grid is filtered.
 */
export default function ProjectCard({ project, seed }) {
  return (
    <li className={styles.card}>
      <ExternalLink href={instagramUrlFor(project)} className={styles.cardLink}>
        <div className={styles.cardMat}>
          <div className={styles.cardPanel}>
            {project.image ? (
              <Picture
                name={project.image}
                alt={project.alt}
                sizes="(min-width: 1200px) 420px, 50vw"
                className={styles.cardImage}
              />
            ) : (
              <PlaceholderFigure seed={seed} />
            )}
          </div>
        </div>
        <p className={styles.cardHead}>
          <span className={styles.cardBrand}>{project.brand}</span>
          <span className={styles.cardMore} aria-hidden="true">
            Instagram ↗
          </span>
        </p>
        <p className={styles.cardMeta}>
          {project.type} · {project.season} · {project.year}
        </p>
      </ExternalLink>
    </li>
  );
}
