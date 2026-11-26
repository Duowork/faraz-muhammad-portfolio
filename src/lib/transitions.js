/** Matches --dur-room plus a margin for the transition to finish. */
const ROOM_TRANSITION_MS = 700;

let clearTimer = 0;

/**
 * Whether the browser supports same-document View Transitions. Elsewhere (and during
 * server rendering) navigation simply happens without the fade.
 */
export function supportsViewTransitions() {
  return typeof document !== 'undefined' && typeof document.startViewTransition === 'function';
}

/**
 * Marks the next page transition as a room change (Wear ⇄ Art), which global.css
 * renders as a slower 500ms crossfade instead of the default 300ms fade.
 */
export function markRoomTransition() {
  const root = document.documentElement;
  root.dataset.transition = 'room';
  window.clearTimeout(clearTimer);
  clearTimer = window.setTimeout(() => {
    delete root.dataset.transition;
  }, ROOM_TRANSITION_MS);
}
