import { describe, it, expect } from "vitest";
import { formatTime, formatDate, degreesToCompass, getRelativeTime } from "../utils/timeUtils";

describe("timeUtils", () => {
  it("converts wind degrees to compass directions", () => {
    expect(degreesToCompass(0)).toBe("N");
    expect(degreesToCompass(90)).toBe("E");
    expect(degreesToCompass(180)).toBe("S");
    expect(degreesToCompass(270)).toBe("W");
    expect(degreesToCompass(360)).toBe("N");
    expect(degreesToCompass(null)).toBe("");
  });

  it("calculates relative time correctly", () => {
    const now = Date.now();
    expect(getRelativeTime(now - 10000)).toBe("Just now");
    expect(getRelativeTime(now - 120000)).toBe("2 min ago");
    expect(getRelativeTime(now - 7200000)).toBe("2h ago");
    expect(getRelativeTime(null)).toBe("");
  });

  it("formats time and handles null inputs", () => {
    expect(formatTime(null)).toBe("--");
    expect(formatDate(null)).toBe("--");
  });
});
