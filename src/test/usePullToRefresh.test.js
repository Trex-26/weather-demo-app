import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { usePullToRefresh } from "../hooks/usePullToRefresh";

function createTouchEvent(clientY) {
  return { touches: [{ clientY }] };
}

describe("usePullToRefresh", () => {
  let onRefresh;

  beforeEach(() => {
    vi.useFakeTimers();
    onRefresh = vi.fn(() => Promise.resolve());
    Object.defineProperty(window, "scrollY", { value: 0, writable: true, configurable: true });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("returns initial state with pullDistance 0 and isRefreshing false", () => {
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh })
    );
    expect(result.current.pullDistance).toBe(0);
    expect(result.current.isRefreshing).toBe(false);
  });

  it("starts pulling on touchStart when at top of page", () => {
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });

    // After touchStart, the hook should be ready to track movement
    // We verify by doing a move and checking pullDistance changes
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(300));
    });

    expect(result.current.pullDistance).toBeGreaterThan(0);
  });

  it("applies resistance curve (0.5 multiplier) to pull distance", () => {
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(300));
    });

    // diff = 200, pull = min(120, 200 * 0.5) = 100
    expect(result.current.pullDistance).toBe(100);
  });

  it("caps pull distance at maxPull", () => {
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh, maxPull: 80 })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(0));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(500));
    });

    expect(result.current.pullDistance).toBe(80);
  });

  it("does not pull when scrollY > 0", () => {
    Object.defineProperty(window, "scrollY", { value: 100, writable: true, configurable: true });

    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(300));
    });

    expect(result.current.pullDistance).toBe(0);
  });

  it("does not pull upward (negative diff)", () => {
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(300));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(100));
    });

    expect(result.current.pullDistance).toBe(0);
  });

  it("triggers refresh when pull exceeds threshold", async () => {
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh, threshold: 80 })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(0));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(400));
    });

    expect(result.current.pullDistance).toBe(100); // 400 * 0.5 = 200, capped at maxPull 120

    await act(async () => {
      result.current.handlers.onTouchEnd();
      // Wait for the promise and setTimeout
      await vi.advanceTimersByTimeAsync(500);
    });

    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("resets pull distance when below threshold", () => {
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh, threshold: 80 })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(0));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(100));
    });

    expect(result.current.pullDistance).toBe(50); // 100 * 0.5

    act(() => {
      result.current.handlers.onTouchEnd();
    });

    expect(result.current.pullDistance).toBe(0);
  });

  it("sets isRefreshing to true during refresh", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() =>
      usePullToRefresh({ onRefresh, threshold: 80 })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(0));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(400));
    });

    await act(async () => {
      result.current.handlers.onTouchEnd();
      await vi.advanceTimersByTimeAsync(10);
    });

    expect(result.current.isRefreshing).toBe(true);

    vi.useRealTimers();
  });
});
