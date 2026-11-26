import Header from './Header';
import styles from './PageShell.module.css';

/** Moves keyboard focus past the header to the page content. */
function SkipLink() {
  return (
    <a
      href="#main"
      className={styles.skip}
      onClick={(event) => {
        const main = document.getElementById('main');
        if (!main) return;
        event.preventDefault();
        main.focus();
        main.scrollIntoView();
      }}
    >
      Skip to content
    </a>
  );
}

/**
 * Standard page chrome: skip link, header, <main> and the page's footer.
 * Each page passes its own footer because the note on the left differs per page.
 *
 * @param {{ children: import('react').ReactNode, footer: import('react').ReactNode }} props
 */
export default function PageShell({ children, footer }) {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      {footer}
    </>
  );
}
