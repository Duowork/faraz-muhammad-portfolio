import { site } from '@/content';
import ContactForm from '@/components/forms/ContactForm';
import Footer from '@/components/layout/Footer';
import PageShell from '@/components/layout/PageShell';
import EmailLink from '@/components/ui/EmailLink';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cx } from '@/lib/cx';
import { withBase } from '@/lib/paths';
import styles from './ContactPage.module.css';

const DOWNLOAD_LABEL = 'Download comp card & press kit (PDF)';

/** Comp card download, shown disabled until the PDF is supplied (site.json → compCardUrl). */
function CompCardLink() {
  const className = cx('btn btn-sm btn-outline', styles.download);
  if (!site.compCardUrl) {
    return (
      <span className={className} aria-disabled="true">
        {DOWNLOAD_LABEL}
        <span className="sr-only"> (not available yet)</span>
      </span>
    );
  }
  return (
    <a href={withBase(site.compCardUrl)} className={className} download>
      {DOWNLOAD_LABEL}
    </a>
  );
}

export default function ContactPage() {
  usePageTitle('Contact');

  return (
    <PageShell footer={<Footer variant="instagram" />}>
      <section className={styles.intro}>
        <h1 className={styles.title}>Contact</h1>
      </section>

      <div className={styles.paths}>
        <section className={styles.path} aria-labelledby="bookings-title">
          <p className={cx('label muted', styles.pathLabel)}>Path 01</p>
          <h2 id="bookings-title" className={styles.pathTitle}>
            Bookings &amp; partnerships
          </h2>
          <p className={styles.pathText}>
            Runway, editorial, campaigns and collaborations with brands and agencies.
          </p>
          <p className={styles.pathEmail}>
            <EmailLink address={site.email} />
          </p>
          <CompCardLink />
        </section>

        <section className={styles.path} aria-labelledby="press-title">
          <p className={cx('label muted', styles.pathLabel)}>Path 02</p>
          <h2 id="press-title" className={styles.pathTitle}>
            Press
          </h2>
          <p className={styles.pathText}>Interviews, features and image requests.</p>
          <p className={styles.pathEmail}>
            <EmailLink address={site.pressEmail} />
          </p>
        </section>
      </div>

      <section className={styles.note} aria-labelledby="note-title">
        <h2 id="note-title" className={styles.noteTitle}>
          Send a note
        </h2>
        <ContactForm className={styles.form} />
      </section>
    </PageShell>
  );
}
