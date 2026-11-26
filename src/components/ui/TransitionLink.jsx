import { Link } from 'react-router';
import { markRoomTransition, supportsViewTransitions } from '@/lib/transitions';

/**
 * Internal link with a page fade (View Transitions API where supported).
 * `room` marks a Wear ⇄ Art move, which crossfades more slowly.
 *
 * @param {import('react-router').LinkProps & { room?: boolean }} props
 */
export default function TransitionLink({ room = false, onClick, ...props }) {
  return (
    <Link
      viewTransition={supportsViewTransitions()}
      onClick={(event) => {
        if (room) markRoomTransition();
        onClick?.(event);
      }}
      {...props}
    />
  );
}
