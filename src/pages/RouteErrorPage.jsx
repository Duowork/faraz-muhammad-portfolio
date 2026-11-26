import { isRouteErrorResponse, useRouteError } from 'react-router';
import StatusPage from '@/components/layout/StatusPage';
import { usePageTitle } from '@/hooks/usePageTitle';
import NotFoundPage from './NotFoundPage';

/** Shown when rendering a route throws. 404 responses get the regular 404 page. */
export default function RouteErrorPage() {
  const error = useRouteError();
  const isNotFound = isRouteErrorResponse(error) && error.status === 404;

  if (isNotFound) return <NotFoundPage />;
  return <UnexpectedError error={error} />;
}

/** @param {{ error: unknown }} props */
function UnexpectedError({ error }) {
  usePageTitle('Something went wrong');
  console.error(error);

  return (
    <StatusPage
      eyebrow="Error"
      code="Sorry"
      message="Something went wrong while opening this page. Please try again."
    />
  );
}
