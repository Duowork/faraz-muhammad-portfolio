import { useRef } from 'react';

/** Minimum horizontal travel, in CSS pixels, for a gesture to count as a swipe. */
export const SWIPE_THRESHOLD = 40;

/**
 * Horizontal swipe detection for touch and pen, via pointer events.
 * Spread the returned handlers on the element and give it `touch-action: pan-y`
 * so vertical scrolling keeps working.
 *
 * @param {{ onSwipeLeft: () => void, onSwipeRight: () => void }} handlers
 */
export function useSwipe({ onSwipeLeft, onSwipeRight }) {
  const start = useRef(/** @type {{ x: number, y: number } | null} */ (null));

  return {
    /** @param {import('react').PointerEvent} event */
    onPointerDown(event) {
      if (event.pointerType === 'mouse') return;
      start.current = { x: event.clientX, y: event.clientY };
    },
    /** @param {import('react').PointerEvent} event */
    onPointerUp(event) {
      const origin = start.current;
      start.current = null;
      if (!origin) return;
      const dx = event.clientX - origin.x;
      const dy = event.clientY - origin.y;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) onSwipeLeft();
      else onSwipeRight();
    },
    onPointerCancel() {
      start.current = null;
    },
  };
}
