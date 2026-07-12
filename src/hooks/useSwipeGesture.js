import { useRef, useCallback } from "react";

/**
 * Custom hook for detecting swipe gestures on touch devices.
 * Returns event handlers to attach to the swipeable element.
 *
 * @param {Object} options
 * @param {Function} options.onSwipeLeft - Called when user swipes left
 * @param {Function} options.onSwipeRight - Called when user swipes right
 * @param {number} [options.threshold=50] - Minimum px distance to count as swipe
 * @returns {{ handlers: { onTouchStart, onTouchMove, onTouchEnd } }}
 */
export function useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold = 50 }) {
  const touchStart = useRef(null);
  const touchEnd = useRef(null);

  const onTouchStart = useCallback((e) => {
    touchEnd.current = null;
    touchStart.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchMove = useCallback((e) => {
    touchEnd.current = e.targetTouches[0].clientX;
  }, []);

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isSwipe = Math.abs(distance) > threshold;

    if (isSwipe) {
      if (distance > 0) {
        onSwipeLeft?.();
      } else {
        onSwipeRight?.();
      }
    }

    touchStart.current = null;
    touchEnd.current = null;
  }, [onSwipeLeft, onSwipeRight, threshold]);

  return {
    handlers: { onTouchStart, onTouchMove, onTouchEnd },
  };
}
