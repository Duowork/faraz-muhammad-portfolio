import { useLayoutEffect, useRef } from 'react';

/**
 * Text and tiles rise 10px and fade in once as they enter the screen.
 *
 * Content renders visible by default (safe without JS or with server rendering). On mount,
 * an element that starts below the first screen is marked `data-reveal="pending"` and
 * revealed once when it scrolls into view. Skipped when the user prefers reduced motion.
 *
 * @template {HTMLElement} T
 * @returns {import('react').RefObject<T | null>}
 */
export function useReveal() {
  const ref = useRef(/** @type {T | null} */ (null));

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return undefined;
    if (node.getBoundingClientRect().top < window.innerHeight) return undefined;

    node.dataset.reveal = 'pending';
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        node.dataset.reveal = 'shown';
        observer.disconnect();
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    observer.observe(node);

    return () => {
      observer.disconnect();
      delete node.dataset.reveal;
    };
  }, []);

  return ref;
}
