import { getImage, imageUrl, srcSet } from '@/lib/images';

/**
 * Responsive image: AVIF and WebP sources with a JPEG fallback, intrinsic width/height set
 * so the browser reserves space (no layout shift). Lazy by default; pass `priority` for
 * images on the first screen.
 *
 * @param {object} props
 * @param {string} props.name    Image name in the manifest, e.g. "art5"
 * @param {string} props.alt     Use "" for decorative images
 * @param {string} props.sizes   `sizes` attribute matching the rendered width
 * @param {boolean} [props.priority] Load eagerly with high fetch priority
 * @param {string} [props.className]
 */
export default function Picture({ name, alt, sizes, priority = false, className, ...rest }) {
  const image = getImage(name);
  if (!image) return null;

  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(name, image.widths, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, image.widths, 'webp')} sizes={sizes} />
      <img
        src={imageUrl(name, image.fallback, 'jpg')}
        width={image.width}
        height={image.height}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'auto' : 'async'}
        fetchPriority={priority ? 'high' : undefined}
        className={className}
        {...rest}
      />
    </picture>
  );
}
