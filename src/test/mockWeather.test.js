import { describe, it, expect } from "vitest";
import { getWeatherByCity, getAllCityNames } from "../data/mockWeather";

describe("getWeatherByCity", () => {
  it("returns weather data for a known city (case-insensitive)", () => {
    const data = getWeatherByCity("Tokyo");
    expect(data).not.toBeNull();
    expect(data.city).toBe("Tokyo");
    expect(data.country).toBe("JP");
    expect(data.current).toBeDefined();
    expect(data.forecast).toHaveLength(5);
  });

  it("trims whitespace from input", () => {
    const data = getWeatherByCity("  London  ");
    expect(data).not.toBeNull();
    expect(data.city).toBe("London");
  });

  it("returns null for an unknown city", () => {
    expect(getWeatherByCity("Narnia")).toBeNull();
  });

  it("returns data with correct current weather structure", () => {
    const data = getWeatherByCity("Paris");
    expect(data.current).toHaveProperty("temp");
    expect(data.current).toHaveProperty("feelsLike");
    expect(data.current).toHaveProperty("humidity");
    expect(data.current).toHaveProperty("windSpeed");
    expect(data.current).toHaveProperty("condition");
    expect(data.current).toHaveProperty("icon");
  });

  it("returns forecast entries with required fields", () => {
    const data = getWeatherByCity("Sydney");
    data.forecast.forEach((day) => {
      expect(day).toHaveProperty("day");
      expect(day).toHaveProperty("high");
      expect(day).toHaveProperty("low");
      expect(day).toHaveProperty("condition");
      expect(day).toHaveProperty("humidity");
    });
  });
});

describe("getAllCityNames", () => {
  it("returns an array of city names", () => {
    const names = getAllCityNames();
    expect(Array.isArray(names)).toBe(true);
    expect(names.length).toBeGreaterThan(0);
  });

  it("includes all cities from the database", () => {
    const names = getAllCityNames();
    expect(names).toContain("New York");
    expect(names).toContain("London");
    expect(names).toContain("Tokyo");
    expect(names).toContain("Dubai");
  });
});
