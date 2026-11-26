/**
 * Link to another site, opened in a new tab, with a screen-reader note saying so.
 *
 * @param {import('react').AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }} props
 */
export default function ExternalLink({ children, ...props }) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
