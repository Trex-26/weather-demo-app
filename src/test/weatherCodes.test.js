import { describe, it, expect } from "vitest";
import { getConditionFromCode, getBackgroundCategory, isSevereWeather } from "../services/weather/weatherCodes";

describe("weatherCodes utility", () => {
  it("resolves WMO code to condition object", () => {
    const clear = getConditionFromCode(0);
    expect(clear.condition).toBe("Clear");
    expect(clear.category).toBe("clear");

    const rain = getConditionFromCode(63);
    expect(rain.condition).toBe("Rain");
    expect(rain.category).toBe("rain");

    const tstorm = getConditionFromCode(95);
    expect(tstorm.condition).toBe("Thunderstorm");
    expect(tstorm.category).toBe("thunderstorm");
  });

  it("handles unknown or null codes gracefully", () => {
    const fallback = getConditionFromCode(999);
    expect(fallback.condition).toBe("Clear");
    expect(getConditionFromCode(null).condition).toBe("Clear");
  });

  it("determines severe weather accurately", () => {
    expect(isSevereWeather(95)).toBe(true); // Thunderstorm
    expect(isSevereWeather(99)).toBe(true); // Severe thunderstorm with heavy hail
    expect(isSevereWeather(65)).toBe(true); // Heavy rain
    expect(isSevereWeather(0)).toBe(false);  // Clear
  });

  it("determines background category with temperature and wind overrides", () => {
    expect(getBackgroundCategory(0, 42, 10)).toBe("hot");
    expect(getBackgroundCategory(0, 25, 45)).toBe("wind");
    expect(getBackgroundCategory(61, 20, 10)).toBe("rain");
  });
});
