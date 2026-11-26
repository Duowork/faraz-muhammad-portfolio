import { useEffect, useRef } from 'react';
import { Outlet, ScrollRestoration, useLocation } from 'react-router';

/**
 * Wraps every route. Restores scroll on back/forward (and scrolls to #hash targets),
 * and moves focus to the new page's <main> after navigation so keyboard and screen-reader
 * users start at the content. Viewer Prev/Next pass `state.keepFocus` to keep focus on
 * the control they pressed.
 */
export default function RootLayout() {
  const location = useLocation();
  const previousPathname = useRef(location.pathname);

  useEffect(() => {
    if (previousPathname.current === location.pathname) return;
    previousPathname.current = location.pathname;
    if (location.hash || location.state?.keepFocus) return;
    document.getElementById('main')?.focus({ preventScroll: true });
  }, [location]);

  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  );
}
