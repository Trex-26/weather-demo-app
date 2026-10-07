import { describe, it, expect } from "vitest";
import { mapOpenMeteoToWeather } from "../services/weather/weatherMapper";

describe("weatherMapper", () => {
  it("maps Open-Meteo payload into normalized model correctly", () => {
    const mockOpenMeteo = {
      timezone: "Europe/London",
      current: {
        time: "2026-10-07T12:00",
        temperature_2m: 18.4,
        apparent_temperature: 17.2,
        relative_humidity_2m: 65,
        weather_code: 2,
        surface_pressure: 1014.2,
        wind_speed_10m: 14.5,
        wind_direction_10m: 180,
        precipitation: 0.2,
        is_day: 1,
      },
      daily: {
        time: ["2026-10-07", "2026-10-08"],
        weather_code: [2, 61],
        temperature_2m_max: [19, 16],
        temperature_2m_min: [11, 9],
        sunrise: ["2026-10-07T06:15", "2026-10-08T06:17"],
        sunset: ["2026-10-07T18:30", "2026-10-08T18:28"],
        precipitation_probability_max: [20, 80],
        precipitation_sum: [0, 5],
        uv_index_max: [4, 2],
        wind_speed_10m_max: [15, 25],
      },
      hourly: {
        time: ["2026-10-07T12:00", "2026-10-07T13:00"],
        temperature_2m: [18, 17],
        apparent_temperature: [17, 16],
        relative_humidity_2m: [65, 70],
        weather_code: [2, 2],
        precipitation_probability: [20, 30],
        precipitation: [0, 0],
        visibility: [10000, 10000],
        wind_speed_10m: [14, 15],
        uv_index: [4, 3],
        is_day: [1, 1],
      },
    };

    const location = {
      name: "London",
      country: "United Kingdom",
      lat: 51.5,
      lon: -0.12,
    };

    const result = mapOpenMeteoToWeather(mockOpenMeteo, location);

    expect(result.location.name).toBe("London");
    expect(result.current.temp).toBe(18);
    expect(result.current.feelsLike).toBe(17);
    expect(result.current.humidity).toBe(65);
    expect(result.current.windDirCompass).toBe("S");
    expect(result.current.condition).toBe("Partly Cloudy");
    expect(result.daily.length).toBe(2);
    expect(result.daily[0].maxTemp).toBe(19);
    expect(result.daily[0].minTemp).toBe(11);
    expect(result.hourly.length).toBe(2);
  });
});
