/**
 * Generates the favicon set: the initials "FM" in Instrument Serif, ink on ground.
 * The glyphs are converted to vector paths, so the SVG does not depend on the font
 * being available where the icon is shown.
 *
 * Writes public/favicon.svg, public/favicon-32.png and public/apple-touch-icon.png.
 * Run with `npm run icons` (output is committed; re-run only when the mark changes).
 */
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = path.join(ROOT, 'public');
const FONT_PATH = path.join(
  ROOT,
  'node_modules/@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff',
);

const TEXT = 'FM';
const VIEWBOX = 64;
const INK = '#111111';
const GROUND = '#F5F5F3';
/** Share of the icon width the initials may occupy. */
const TEXT_WIDTH_RATIO = 0.74;

/**
 * Lays out `text` glyph by glyph (advance width + kerning). Plain Latin initials need
 * no shaping, and this avoids opentype.js's partial GSUB support.
 * @param {import('opentype.js').Font} font
 * @param {string} text
 * @param {number} x
 * @param {number} y
 * @param {number} fontSize
 */
function textPath(font, text, x, y, fontSize) {
  const scale = fontSize / font.unitsPerEm;
  const glyphs = [...text].map((char) => font.charToGlyph(char));
  const combined = new opentype.Path();
  let cursor = x;
  glyphs.forEach((glyph, index) => {
    combined.extend(glyph.getPath(cursor, y, fontSize));
    const next = glyphs[index + 1];
    const kerning = next ? font.getKerningValue(glyph, next) : 0;
    cursor += (glyph.advanceWidth + kerning) * scale;
  });
  return combined;
}

async function buildSvg() {
  const buffer = await readFile(FONT_PATH);
  const font = opentype.parse(
    buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength),
  );

  // Measure at a reference size, then scale so the initials fill the target width.
  const reference = textPath(font, TEXT, 0, 0, 100).getBoundingBox();
  const fontSize = (100 * VIEWBOX * TEXT_WIDTH_RATIO) / (reference.x2 - reference.x1);
  const box = textPath(font, TEXT, 0, 0, fontSize).getBoundingBox();
  const x = (VIEWBOX - (box.x2 - box.x1)) / 2 - box.x1;
  const y = (VIEWBOX - (box.y2 - box.y1)) / 2 - box.y1;
  const pathData = textPath(font, TEXT, x, y, fontSize).toPathData(2);

  return [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}">`,
    `<rect width="${VIEWBOX}" height="${VIEWBOX}" fill="${GROUND}"/>`,
    `<path fill="${INK}" d="${pathData}"/>`,
    '</svg>',
    '',
  ].join('\n');
}

async function main() {
  const svg = await buildSvg();
  await writeFile(path.join(PUBLIC_DIR, 'favicon.svg'), svg);

  const rasters = [
    { file: 'favicon-32.png', size: 32 },
    { file: 'apple-touch-icon.png', size: 180 },
  ];
  await Promise.all(
    rasters.map(({ file, size }) =>
      sharp(Buffer.from(svg), { density: (72 * size) / VIEWBOX })
        .resize(size, size)
        .png()
        .toFile(path.join(PUBLIC_DIR, file)),
    ),
  );
  console.log(`icons: wrote favicon.svg, ${rasters.map(({ file }) => file).join(', ')}`);
}

main().catch((error) => {
  console.error('icons: failed', error);
  process.exitCode = 1;
});
