import RootLayout from '@/components/layout/RootLayout';
import ArtPiecePage from '@/pages/ArtPiecePage';
import ArtRoomPage from '@/pages/ArtRoomPage';
import ContactPage from '@/pages/ContactPage';
import HomePage from '@/pages/HomePage';
import NotFoundPage from '@/pages/NotFoundPage';
import RouteErrorPage from '@/pages/RouteErrorPage';
import WearLookPage from '@/pages/WearLookPage';
import WearRoomPage from '@/pages/WearRoomPage';
import WorkPage from '@/pages/WorkPage';

/**
 * Route table, shared by the browser router (main.jsx) and tests (memory router).
 * Mirrors the sitemap in the handoff; each entry maps 1:1 to a future file-based route.
 *
 * @type {import('react-router').RouteObject[]}
 */
export const routes = [
  {
    path: '/',
    Component: RootLayout,
    ErrorBoundary: RouteErrorPage,
    children: [
      { index: true, Component: HomePage },
      { path: 'work', Component: WorkPage },
      { path: 'wear', Component: WearRoomPage },
      { path: 'wear/:slug', Component: WearLookPage },
      { path: 'art', Component: ArtRoomPage },
      { path: 'art/:slug', Component: ArtPiecePage },
      { path: 'contact', Component: ContactPage },
      { path: '*', Component: NotFoundPage },
    ],
  },
];
