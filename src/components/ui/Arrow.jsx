/**
 * Decorative arrow glyph (→, ←, ↗, ×). Hidden from screen readers, which read the
 * surrounding label instead.
 *
 * @param {{ children: string, className?: string }} props
 */
export default function Arrow({ children, className }) {
  return (
    <span aria-hidden="true" className={className}>
      {children}
    </span>
  );
}
