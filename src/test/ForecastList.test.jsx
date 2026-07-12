import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import ForecastList from "../components/ForecastList";

const mockForecast = [
  { day: "Mon", high: 32, low: 24, condition: "Sunny", icon: "☀️", humidity: 75 },
  { day: "Tue", high: 31, low: 25, condition: "Partly Cloudy", icon: "⛅", humidity: 78 },
  { day: "Wed", high: 29, low: 23, condition: "Thunderstorm", icon: "⛈️", humidity: 90 },
  { day: "Thu", high: 28, low: 22, condition: "Rain", icon: "🌧️", humidity: 88 },
  { day: "Fri", high: 30, low: 24, condition: "Sunny", icon: "☀️", humidity: 72 },
];

describe("ForecastList", () => {
  it("renders 5-Day Forecast heading", () => {
    render(<ForecastList forecast={mockForecast} unit="C" />);
    expect(screen.getByText("5-Day Forecast")).toBeInTheDocument();
  });

  it("renders all 5 day labels", () => {
    render(<ForecastList forecast={mockForecast} unit="C" />);
    expect(screen.getByText("Mon")).toBeInTheDocument();
    expect(screen.getByText("Tue")).toBeInTheDocument();
    expect(screen.getByText("Wed")).toBeInTheDocument();
    expect(screen.getByText("Thu")).toBeInTheDocument();
    expect(screen.getByText("Fri")).toBeInTheDocument();
  });

  it("displays temperatures in Celsius", () => {
    render(<ForecastList forecast={mockForecast} unit="C" />);
    expect(screen.getByText("32°")).toBeInTheDocument();
    expect(screen.getByText("24°")).toBeInTheDocument();
  });

  it("converts temperatures to Fahrenheit", () => {
    render(<ForecastList forecast={mockForecast} unit="F" />);
    // 32°C = 90°F, 24°C = 75°F
    expect(screen.getByText("90°")).toBeInTheDocument();
    expect(screen.getByText("75°")).toBeInTheDocument();
  });

  it("displays humidity for each day", () => {
    render(<ForecastList forecast={mockForecast} unit="C" />);
    const humidityValues = screen.getAllByText(/%/);
    expect(humidityValues.length).toBe(5);
  });
});
