/**
 * GitHub Pages cannot rewrite unknown paths to index.html, so opening or refreshing a deep
 * link such as /art/untitled-iv would hit GitHub's own 404. Pages serves `404.html` for any
 * missing path, so a copy of the app shell there lets the client router take over.
 *
 * Runs after `vite build` as part of `npm run deploy`.
 */
import { copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIST = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../dist');

try {
  await copyFile(path.join(DIST, 'index.html'), path.join(DIST, '404.html'));
  console.log('spa-fallback: copied dist/index.html → dist/404.html');
} catch (error) {
  console.error('spa-fallback: failed (run `npm run build` first?)', error);
  process.exitCode = 1;
}
