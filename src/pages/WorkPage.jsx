import { useState } from 'react';
import { work } from '@/content';
import Footer from '@/components/layout/Footer';
import PageShell from '@/components/layout/PageShell';
import Arrow from '@/components/ui/Arrow';
import Band from '@/components/ui/Band';
import TransitionLink from '@/components/ui/TransitionLink';
import ProjectCard from '@/components/work/ProjectCard';
import TimelineRow from '@/components/work/TimelineRow';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cx } from '@/lib/cx';
import styles from './WorkPage.module.css';

const ALL = 'All';
const FILTERS = [ALL, ...work.projectTypes];

export default function WorkPage() {
  usePageTitle('Work');
  const [filter, setFilter] = useState(ALL);

  const projects = work.projects
    .map((project, seed) => ({ project, seed }))
    .filter(({ project }) => filter === ALL || project.type === filter);

  return (
    <PageShell footer={<Footer />}>
      <section className={styles.intro}>
        <h1 className={styles.title}>Work</h1>
        <p className={styles.lede}>{work.intro}</p>
      </section>

      <section className={styles.section} aria-labelledby="weeks-title">
        <h2 id="weeks-title" className={cx('label muted', styles.sectionLabel)}>
          Fashion weeks
        </h2>
        <ol className={styles.rows}>
          {work.fashionWeeks.map((week, index) => (
            <TimelineRow key={week.name} week={week} number={index + 1} />
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="projects-title">
        <div className={styles.projectsHead}>
          <h2 id="projects-title" className={styles.projectsTitle}>
            Brands &amp; campaigns
          </h2>
          <div className={styles.filters} role="group" aria-label="Filter by type">
            {FILTERS.map((label) => (
              <button
                key={label}
                type="button"
                className={styles.chip}
                aria-pressed={filter === label}
                onClick={() => setFilter(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {projects.length > 0 ? (
          // Re-keyed per filter so the cards fade and rise in again.
          <ul key={filter} className={styles.grid}>
            {projects.map(({ project, seed }) => (
              <ProjectCard key={project.id} project={project} seed={seed} />
            ))}
          </ul>
        ) : (
          <p className={styles.empty}>Nothing in this category yet.</p>
        )}
      </section>

      <Band text="Working with a brand or agency?" compactLink>
        <TransitionLink to="/contact">
          Bookings &amp; partnerships <Arrow>→</Arrow>
        </TransitionLink>
      </Band>
    </PageShell>
  );
}
