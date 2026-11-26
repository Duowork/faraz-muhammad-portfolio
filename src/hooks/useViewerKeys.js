import { useEffect, useEffectEvent } from 'react';

const TEXT_ENTRY = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

/**
 * True when a key press belongs to a form field and must not drive the viewer.
 * @param {EventTarget | null} target
 */
export function isTextEntryTarget(target) {
  return target instanceof Element && target.closest(TEXT_ENTRY) !== null;
}

/**
 * Viewer keyboard controls: ← / → move between works, Esc closes to the room.
 * Ignored inside form fields and when a modifier key is held.
 *
 * @param {{ onPrev: () => void, onNext: () => void, onClose: () => void }} handlers
 */
export function useViewerKeys({ onPrev, onNext, onClose }) {
  const handleKeyDown = useEffectEvent((/** @type {KeyboardEvent} */ event) => {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return;
    }
    if (isTextEntryTarget(event.target)) return;

    const actions = { ArrowLeft: onPrev, ArrowRight: onNext, Escape: onClose };
    const action = actions[/** @type {keyof typeof actions} */ (event.key)];
    if (!action) return;
    event.preventDefault();
    action();
  });

  useEffect(() => {
    const listener = (/** @type {KeyboardEvent} */ event) => handleKeyDown(event);
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, []);
}
