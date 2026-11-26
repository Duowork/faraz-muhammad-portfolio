import { isFilled } from '@/lib/placeholder';

/**
 * A mailto link once the address is known; the bracketed placeholder as plain text until then.
 *
 * @param {{ address: string, className?: string }} props
 */
export default function EmailLink({ address, className }) {
  if (!isFilled(address)) return <span className={className}>{address}</span>;
  return (
    <a href={`mailto:${address}`} className={className}>
      {address}
    </a>
  );
}
