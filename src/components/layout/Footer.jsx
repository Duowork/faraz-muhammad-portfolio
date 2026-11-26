import { site } from '@/content';
import EmailLink from '@/components/ui/EmailLink';
import ExternalLink from '@/components/ui/ExternalLink';
import TransitionLink from '@/components/ui/TransitionLink';
import { cx } from '@/lib/cx';
import styles from './Footer.module.css';

/**
 * Site footer: a note on the left, logo and © year on the right.
 *
 * Variants follow the boards:
 * - "default"   bookings email (Home, Work)
 * - "instagram" large serif @handle (Contact, 404)
 * - "room"      a room's note under the gallery floor, no top rule (Wear, Art)
 *
 * @param {{ variant?: 'default' | 'instagram' | 'room', note?: string }} props
 */
export default function Footer({ variant = 'default', note }) {
  return (
    <footer className={cx(styles.footer, styles[variant])}>
      {variant === 'instagram' ? (
        <ExternalLink href={site.instagram.url} className={styles.instagramLink}>
          {site.instagram.handle} <span aria-hidden="true">↗</span>
        </ExternalLink>
      ) : (
        <p>
          {note ?? (
            <>
              Bookings &amp; partnerships — <EmailLink address={site.email} />
            </>
          )}
        </p>
      )}
      <p className={styles.signature}>
        <TransitionLink to="/" className={styles.logo}>
          {site.name}
        </TransitionLink>
        <span>© {new Date().getFullYear()}</span>
      </p>
    </footer>
  );
}
