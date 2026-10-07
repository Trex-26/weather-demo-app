import { useState, useRef, useCallback } from "react";

/**
 * Custom hook for pull-to-refresh gesture.
 * @param {Object} options
 * @param {Function} options.onRefresh - Async function called when pull threshold is reached
 * @param {number} [options.threshold=80] - Pull distance in px to trigger refresh
 * @param {number} [options.maxPull=120] - Maximum pull distance
 * @returns {{ pullDistance, isRefreshing, handlers }}
 */
export function usePullToRefresh({ onRefresh, threshold = 80, maxPull = 100 }) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const startY = useRef(0);
  const isPulling = useRef(false);

  const handlers = {
    onTouchStart(e) {
      if (isRefreshing) return;
      // Only start pull if at top of page
      if (window.scrollY > 0) return;
      startY.current = e.touches[0].clientY;
      isPulling.current = true;
    },

    onTouchMove(e) {
      if (!isPulling.current || isRefreshing) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;

      // Only allow downward pull
      if (diff > 0) {
        // Apply resistance curve for natural feel
        const pull = Math.min(maxPull, diff * 0.5);
        setPullDistance(pull);
      }
    },

    onTouchEnd() {
      if (!isPulling.current || isRefreshing) return;
      isPulling.current = false;

      if (pullDistance >= threshold) {
        setIsRefreshing(true);
        setPullDistance(threshold * 0.6);

        // Trigger refresh and reset after completion
        Promise.resolve(onRefresh()).finally(() => {
          setTimeout(() => {
            setIsRefreshing(false);
            setPullDistance(0);
          }, 300);
        });
      } else {
        setPullDistance(0);
      }
    },
  };

  return { pullDistance, isRefreshing, handlers };
}
