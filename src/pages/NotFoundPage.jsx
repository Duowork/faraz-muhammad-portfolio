import StatusPage from '@/components/layout/StatusPage';
import { usePageTitle } from '@/hooks/usePageTitle';

/** Any unknown route, including unknown work slugs. */
export default function NotFoundPage() {
  usePageTitle('Page not found');

  return (
    <>
      <meta name="robots" content="noindex" />
      <StatusPage
        eyebrow="Error 404"
        code="404"
        message="This room doesn't exist, or it has moved."
      />
    </>
  );
}
