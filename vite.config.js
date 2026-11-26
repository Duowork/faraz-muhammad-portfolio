import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

/**
 * "repo", "/repo", "/repo/" → "/repo/"; empty → "/".
 * @param {string | undefined} value
 */
function normalizeBase(value) {
  const trimmed = (value ?? '').trim().replace(/^\/+|\/+$/g, '');
  return trimmed ? `/${trimmed}/` : '/';
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // Sub-path the site is served from, e.g. "/repo/" for a GitHub Pages project site.
    // Set BASE_PATH in .env.local or the shell; defaults to the domain root.
    base: normalizeBase(env.BASE_PATH),
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      include: ['src/**/*.test.{js,jsx}', 'scripts/**/*.test.{js,mjs}'],
      css: { modules: { classNameStrategy: 'non-scoped' } },
    },
  };
});
