import { formatPostDate, postTime } from '@/lib/blog';

/**
 * A post's date: a <time> element for real dates, plain text for placeholders like "[DATE]".
 *
 * @param {{ date: string, className?: string }} props
 */
export default function PostDate({ date, className }) {
  if (postTime(date) === null) return <span className={className}>{date}</span>;
  return (
    <time dateTime={date} className={className}>
      {formatPostDate(date)}
    </time>
  );
}
