import { describe, it, expect } from "vitest";
import { toFahrenheit, displayTemp, unitLabel, formatWind } from "../utils/units";

describe("units utility", () => {
  it("converts Celsius to Fahrenheit correctly", () => {
    expect(toFahrenheit(0)).toBe(32);
    expect(toFahrenheit(20)).toBe(68);
    expect(toFahrenheit(100)).toBe(212);
    expect(toFahrenheit(-10)).toBe(14);
    expect(toFahrenheit(null)).toBeNull();
  });

  it("displays temperature according to active unit", () => {
    expect(displayTemp(25, "C")).toBe(25);
    expect(displayTemp(25, "F")).toBe(77);
    expect(displayTemp(null, "C")).toBe("--");
  });

  it("returns correct unit labels", () => {
    expect(unitLabel("C")).toBe("°C");
    expect(unitLabel("F")).toBe("°F");
  });

  it("formats wind speed with compass direction", () => {
    expect(formatWind(15, "NW", "C")).toBe("15 km/h NW");
    expect(formatWind(15, "NW", "F")).toBe("9 mph NW");
  });
});
