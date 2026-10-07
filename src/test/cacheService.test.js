import { describe, it, expect, beforeEach, vi } from "vitest";
import { getCached, setCached, invalidateCache, clearAllCache, getCacheKey } from "../services/weather/cacheService";

describe("cacheService", () => {
  beforeEach(() => {
    clearAllCache();
    localStorage.clear();
  });

  it("stores and retrieves data before TTL expiry", () => {
    const key = getCacheKey("test", "city1");
    const data = { temp: 20, city: "London" };

    setCached(key, data);
    const result = getCached(key, 60000);

    expect(result).not.toBeNull();
    expect(result.data).toEqual(data);
    expect(result.isStale).toBe(false);
  });

  it("marks data as stale between TTL and maxStaleTtl", () => {
    const key = getCacheKey("test", "city2");
    const data = { temp: 22 };

    const pastTime = Date.now() - 70000;
    vi.spyOn(Date, "now").mockReturnValueOnce(pastTime);
    setCached(key, data);

    // Current time is now (70s later)
    // TTL is 60s, maxStale is 120s
    const result = getCached(key, 60000, 120000);
    expect(result).not.toBeNull();
    expect(result.isStale).toBe(true);
    expect(result.data).toEqual(data);
  });

  it("invalidates cache when requested", () => {
    const key = getCacheKey("test", "city3");
    setCached(key, { foo: "bar" });
    invalidateCache(key);

    expect(getCached(key, 60000)).toBeNull();
  });
});
