import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSwipeGesture } from "../hooks/useSwipeGesture";

function createTouchEvent(clientX) {
  return { targetTouches: [{ clientX }] };
}

describe("useSwipeGesture", () => {
  let onSwipeLeft, onSwipeRight;

  beforeEach(() => {
    onSwipeLeft = vi.fn();
    onSwipeRight = vi.fn();
  });

  it("returns handlers for onTouchStart, onTouchMove, onTouchEnd", () => {
    const { result } = renderHook(() =>
      useSwipeGesture({ onSwipeLeft, onSwipeRight })
    );
    expect(result.current.handlers).toHaveProperty("onTouchStart");
    expect(result.current.handlers).toHaveProperty("onTouchMove");
    expect(result.current.handlers).toHaveProperty("onTouchEnd");
  });

  it("calls onSwipeLeft when swiping left past threshold", () => {
    const { result } = renderHook(() =>
      useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold: 50 })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(40));
    });
    act(() => {
      result.current.handlers.onTouchEnd();
    });

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it("calls onSwipeRight when swiping right past threshold", () => {
    const { result } = renderHook(() =>
      useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold: 50 })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(40));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(100));
    });
    act(() => {
      result.current.handlers.onTouchEnd();
    });

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it("does not call callbacks when swipe is below threshold", () => {
    const { result } = renderHook(() =>
      useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold: 50 })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(80));
    });
    act(() => {
      result.current.handlers.onTouchEnd();
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it("does not call callbacks when touchEnd is missing", () => {
    const { result } = renderHook(() =>
      useSwipeGesture({ onSwipeLeft, onSwipeRight })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    act(() => {
      result.current.handlers.onTouchEnd();
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it("resets state after a swipe", () => {
    const { result } = renderHook(() =>
      useSwipeGesture({ onSwipeLeft, onSwipeRight, threshold: 50 })
    );

    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(40));
    });
    act(() => {
      result.current.handlers.onTouchEnd();
    });

    // Second swipe should also work
    act(() => {
      result.current.handlers.onTouchStart(createTouchEvent(100));
    });
    act(() => {
      result.current.handlers.onTouchMove(createTouchEvent(30));
    });
    act(() => {
      result.current.handlers.onTouchEnd();
    });

    expect(onSwipeLeft).toHaveBeenCalledTimes(2);
  });
});
