import { useLocation } from 'react-router';
import { site } from '@/content';
import ExternalLink from '@/components/ui/ExternalLink';
import TransitionLink from '@/components/ui/TransitionLink';
import { cx } from '@/lib/cx';
import styles from './Header.module.css';

/** `sections` are the route prefixes that count as "current" for each item. */
const NAV_ITEMS = [
  { label: 'About', to: { pathname: '/', hash: '#about' }, sections: [] },
  { label: 'Work', to: '/work', sections: ['/work'] },
  { label: 'Gallery', to: '/art', sections: ['/art', '/wear'] },
  { label: 'Blog', to: '/blog', sections: ['/blog'] },
  { label: 'Contact', to: '/contact', sections: ['/contact'] },
];

/**
 * @param {string} pathname
 * @param {string[]} sections
 */
function isCurrentSection(pathname, sections) {
  return sections.some((section) => pathname === section || pathname.startsWith(`${section}/`));
}

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <TransitionLink
        to="/"
        className={styles.logo}
        aria-current={pathname === '/' ? 'page' : undefined}
      >
        {site.name}
      </TransitionLink>
      <nav aria-label="Main">
        <ul className={styles.nav}>
          {NAV_ITEMS.map(({ label, to, sections }) => {
            const current = isCurrentSection(pathname, sections);
            return (
              <li key={label}>
                <TransitionLink
                  to={to}
                  className={cx('label', styles.link, current && styles.current)}
                  aria-current={current ? 'page' : undefined}
                >
                  {label}
                </TransitionLink>
              </li>
            );
          })}
          <li>
            <ExternalLink href={site.instagram.url} className={cx('label', styles.link)}>
              {site.instagram.handle} <span aria-hidden="true">↗</span>
            </ExternalLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
