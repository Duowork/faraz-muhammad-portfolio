/**
 * Builds web-ready copies of every original in `assets-src/images`:
 *   - AVIF and WebP at several widths (for <picture> srcset),
 *   - one JPEG fallback,
 *   - the 1200×630 Open Graph image,
 * into `public/images`, and writes `src/generated/image-manifest.json`
 * with each image's intrinsic size and the widths that exist.
 *
 * Incremental: a file is only re-encoded when its source is newer.
 * Run with `npm run images` (also runs automatically before dev and build).
 */
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE_DIR = path.join(ROOT, 'assets-src/images');
const OUTPUT_DIR = path.join(ROOT, 'public/images');
const MANIFEST_PATH = path.join(ROOT, 'src/generated/image-manifest.json');

/** Candidate widths. Each image only gets the ones at or below its own width. */
const WIDTHS = [160, 400, 800, 1200, 1600];
const FALLBACK_WIDTH = 800;
const ENCODERS = {
  avif: (pipeline) => pipeline.avif({ quality: 55, effort: 4 }),
  webp: (pipeline) => pipeline.webp({ quality: 78 }),
  jpg: (pipeline) => pipeline.jpeg({ quality: 80, mozjpeg: true }),
};
/**
 * Share image. `focusY` is where the subject's face sits (0 = top, 1 = bottom) in the source;
 * the crop places it on the upper third of the 1200×630 frame.
 */
const OPEN_GRAPH = {
  source: 'home-portrait',
  file: 'og.jpg',
  width: 1200,
  height: 630,
  focusY: 0.38,
};
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);

/**
 * Widths to generate for an image that is `intrinsicWidth` pixels wide.
 * @param {number} intrinsicWidth
 * @returns {number[]}
 */
export function widthsFor(intrinsicWidth) {
  const widths = WIDTHS.filter((width) => width < intrinsicWidth);
  if (intrinsicWidth <= WIDTHS.at(-1)) widths.push(intrinsicWidth);
  return widths;
}

/**
 * Upright dimensions, accounting for EXIF orientation (5–8 are rotated 90°).
 * @param {import('sharp').Metadata} metadata
 */
function uprightSize({ width, height, orientation = 1 }) {
  return orientation >= 5 ? { width: height, height: width } : { width, height };
}

/** @param {string} file @param {number} sourceTime */
async function isFresh(file, sourceTime) {
  try {
    return (await stat(file)).mtimeMs >= sourceTime;
  } catch (error) {
    if (error.code === 'ENOENT') return false;
    throw error;
  }
}

/**
 * @param {string} sourcePath
 * @param {string} outputPath
 * @param {number} sourceTime
 * @param {(pipeline: import('sharp').Sharp) => import('sharp').Sharp} build
 * @returns {Promise<boolean>} true when the file was (re)written
 */
async function writeVariant(sourcePath, outputPath, sourceTime, build) {
  if (await isFresh(outputPath, sourceTime)) return false;
  await build(sharp(sourcePath).rotate()).toFile(outputPath);
  return true;
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });

  const files = (await readdir(SOURCE_DIR))
    .filter((file) => SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()))
    .sort();

  const manifest = {};
  let written = 0;
  let skipped = 0;

  for (const file of files) {
    const name = path.parse(file).name;
    const sourcePath = path.join(SOURCE_DIR, file);
    const sourceTime = (await stat(sourcePath)).mtimeMs;
    const { width, height } = uprightSize(await sharp(sourcePath).metadata());
    const widths = widthsFor(width);
    const fallbackWidth = Math.min(FALLBACK_WIDTH, width);

    const jobs = widths.flatMap((targetWidth) =>
      ['avif', 'webp'].map((format) =>
        writeVariant(
          sourcePath,
          path.join(OUTPUT_DIR, `${name}-${targetWidth}.${format}`),
          sourceTime,
          (pipeline) => ENCODERS[format](pipeline.resize({ width: targetWidth })),
        ),
      ),
    );
    jobs.push(
      writeVariant(
        sourcePath,
        path.join(OUTPUT_DIR, `${name}-${fallbackWidth}.jpg`),
        sourceTime,
        (pipeline) => ENCODERS.jpg(pipeline.resize({ width: fallbackWidth })),
      ),
    );

    if (name === OPEN_GRAPH.source) {
      const scaledHeight = Math.round((height * OPEN_GRAPH.width) / width);
      const top = Math.round(OPEN_GRAPH.focusY * scaledHeight - OPEN_GRAPH.height / 3);
      const clampedTop = Math.min(Math.max(top, 0), scaledHeight - OPEN_GRAPH.height);
      jobs.push(
        writeVariant(sourcePath, path.join(OUTPUT_DIR, OPEN_GRAPH.file), sourceTime, (pipeline) =>
          ENCODERS.jpg(
            pipeline.resize({ width: OPEN_GRAPH.width }).extract({
              left: 0,
              top: clampedTop,
              width: OPEN_GRAPH.width,
              height: OPEN_GRAPH.height,
            }),
          ),
        ),
      );
    }

    const results = await Promise.all(jobs);
    const count = results.filter(Boolean).length;
    written += count;
    skipped += results.length - count;
    manifest[name] = { width, height, widths, fallback: fallbackWidth };
  }

  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(
    `images: ${files.length} sources, ${written} written, ${skipped} up to date → public/images`,
  );
}

// Only run when executed directly (keeps `widthsFor` importable in tests).
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error('images: failed', error);
    process.exitCode = 1;
  });
}
