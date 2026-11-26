import { artRoom, site, wearRoom } from '@/content';
import DoorTile from '@/components/home/DoorTile';
import WorkTeaser from '@/components/home/WorkTeaser';
import Footer from '@/components/layout/Footer';
import PageShell from '@/components/layout/PageShell';
import Arrow from '@/components/ui/Arrow';
import Band from '@/components/ui/Band';
import ExternalLink from '@/components/ui/ExternalLink';
import Picture from '@/components/ui/Picture';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';
import styles from './HomePage.module.css';

const PORTRAIT_SIZES = '(min-width: 1200px) 480px, (min-width: 768px) 260px, calc(100vw - 40px)';

export default function HomePage() {
  usePageTitle();
  const bioRef = useReveal();
  const [firstName, ...lastNames] = site.name.split(' ');

  return (
    <PageShell footer={<Footer />}>
      {/* Tablet+: copy on the left, portrait sticky on the right until the Gallery section.
          Mobile: portrait first, then the copy. */}
      <div className={styles.intro}>
        <div className={styles.copy}>
          <section className={styles.hero} aria-labelledby="home-title">
            <p className={cx('label muted', styles.location)}>{site.location}</p>
            {/* The space before <br> keeps the accessible name "Faraz Muhammad". */}
            <h1 id="home-title" className={styles.title}>
              {firstName} <br />
              {lastNames.join(' ')}
            </h1>
            <p className={styles.tagline}>{site.tagline}</p>
          </section>

          <section id="about" className={styles.about} aria-labelledby="about-title">
            <h2 id="about-title" className={cx('label muted', styles.aboutLabel)}>
              About
            </h2>
            <p ref={bioRef} className={styles.bio}>
              {site.bio}
            </p>
          </section>

          <WorkTeaser />
        </div>

        <div className={styles.portraitColumn}>
          <div className={styles.portrait}>
            <Picture
              name={site.portrait.image}
              alt={site.portrait.alt}
              sizes={PORTRAIT_SIZES}
              priority
              className={styles.portraitImage}
            />
          </div>
        </div>
      </div>

      <section className={styles.gallery} aria-labelledby="gallery-title">
        <h2 id="gallery-title" className={cx('label muted', styles.galleryLabel)}>
          Gallery · two rooms
        </h2>
        <div className={styles.doors}>
          <DoorTile room={wearRoom} tone="dark" />
          <DoorTile room={artRoom} tone="light" />
        </div>
      </section>

      <Band text={site.instagramBand}>
        <ExternalLink href={site.instagram.url}>
          {site.instagram.handle} <Arrow>↗</Arrow>
        </ExternalLink>
      </Band>
    </PageShell>
  );
}
