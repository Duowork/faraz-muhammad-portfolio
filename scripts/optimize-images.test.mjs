// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { widthsFor } from './optimize-images.mjs';

describe('widthsFor', () => {
  it('never upscales and always includes the original size when it is small', () => {
    expect(widthsFor(720)).toEqual([160, 400, 720]);
    expect(widthsFor(1080)).toEqual([160, 400, 800, 1080]);
    expect(widthsFor(800)).toEqual([160, 400, 800]);
  });

  it('caps large originals at the largest candidate width', () => {
    expect(widthsFor(2736)).toEqual([160, 400, 800, 1200, 1600]);
  });
});
