import { artRoom, wearRoom } from '@/content';
import TransitionLink from '@/components/ui/TransitionLink';
import { cx } from '@/lib/cx';
import Footer from './Footer';
import PageShell from './PageShell';
import styles from './StatusPage.module.css';

/**
 * Large status page (404, unexpected error) with links back into the site.
 *
 * @param {{ eyebrow: string, code: string, message: string }} props
 */
export default function StatusPage({ eyebrow, code, message }) {
  return (
    <PageShell footer={<Footer variant="instagram" />}>
      <section className={styles.section}>
        <p className={cx('label muted', styles.eyebrow)}>{eyebrow}</p>
        <h1 className={styles.code}>{code}</h1>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <TransitionLink to="/" className="btn btn-primary">
            Back home
          </TransitionLink>
          <TransitionLink to={wearRoom.path} className="btn btn-outline">
            Enter {wearRoom.title}
          </TransitionLink>
          <TransitionLink to={artRoom.path} className="btn btn-outline">
            Enter {artRoom.title}
          </TransitionLink>
        </div>
      </section>
    </PageShell>
  );
}
