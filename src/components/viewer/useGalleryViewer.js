import { useNavigate } from 'react-router';
import { useViewerKeys } from '@/hooks/useViewerKeys';
import { supportsViewTransitions } from '@/lib/transitions';
import { wrapIndex } from '@/lib/viewer';

/**
 * Navigation for a Wear or Art viewer. Each work has its own URL (/art/untitled-iv), so
 * Prev/Next/thumbnails push history entries and the browser back button retraces them.
 * Also wires the keyboard: ← / → between works, Esc to the room.
 *
 * @param {object} options
 * @param {{ slug: string }[]} options.items
 * @param {number} options.index  Index of the work being shown
 * @param {{ path: string }} options.room
 */
export function useGalleryViewer({ items, index, room }) {
  const navigate = useNavigate();

  /** @param {number} target Any integer; wraps around the ends */
  const goTo = (target) => {
    const nextIndex = wrapIndex(target, items.length);
    if (nextIndex === index) return;
    navigate(`${room.path}/${items[nextIndex].slug}`, {
      preventScrollReset: true,
      state: { keepFocus: true },
    });
  };
  const goPrev = () => goTo(index - 1);
  const goNext = () => goTo(index + 1);
  const close = () => navigate(room.path, { viewTransition: supportsViewTransitions() });

  useViewerKeys({ onPrev: goPrev, onNext: goNext, onClose: close });

  return { goTo, goPrev, goNext, close };
}
