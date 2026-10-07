import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFavorites } from "../hooks/useFavorites";

describe("useFavorites hook", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds, detects, and removes favorites", () => {
    const { result } = renderHook(() => useFavorites());

    const tokyo = { name: "Tokyo", lat: 35.67, lon: 139.65 };
    const paris = { name: "Paris", lat: 48.85, lon: 2.35 };

    expect(result.current.isFavorite(tokyo)).toBe(false);

    act(() => {
      result.current.addFavorite(tokyo);
    });

    expect(result.current.favorites.length).toBe(1);
    expect(result.current.isFavorite(tokyo)).toBe(true);
    expect(result.current.isFavorite(paris)).toBe(false);

    act(() => {
      result.current.toggleFavorite(paris);
    });
    expect(result.current.favorites.length).toBe(2);

    act(() => {
      result.current.removeFavorite(tokyo);
    });
    expect(result.current.favorites.length).toBe(1);
    expect(result.current.isFavorite(tokyo)).toBe(false);
  });
});
