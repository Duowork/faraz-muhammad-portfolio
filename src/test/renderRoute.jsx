import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { routes } from '@/routes';

/**
 * Renders the real route table at `path` in a memory router.
 * @param {string} path
 */
export function renderRoute(path) {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  const result = render(<RouterProvider router={router} />);
  return { router, ...result };
}
