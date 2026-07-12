import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WeatherCard from "../components/WeatherCard";

const mockData = {
  city: "Tokyo",
  country: "JP",
  current: {
    temp: 30,
    feelsLike: 34,
    humidity: 80,
    windSpeed: 8,
    windDir: "SE",
    condition: "Humid & Sunny",
    icon: "☀️",
    uv: 8,
    visibility: 12,
    pressure: 1010,
  },
};

describe("WeatherCard", () => {
  it("renders city name and country", () => {
    render(<WeatherCard data={mockData} unit="C" />);
    expect(screen.getByText("Tokyo")).toBeInTheDocument();
    expect(screen.getByText("JP")).toBeInTheDocument();
  });

  it("displays temperature in Celsius", () => {
    render(<WeatherCard data={mockData} unit="C" />);
    expect(screen.getByText(/30°C/)).toBeInTheDocument();
  });

  it("converts and displays temperature in Fahrenheit", () => {
    render(<WeatherCard data={mockData} unit="F" />);
    // 30°C = 86°F
    expect(screen.getByText(/86°F/)).toBeInTheDocument();
  });

  it("shows condition text", () => {
    render(<WeatherCard data={mockData} unit="C" />);
    expect(screen.getByText("Humid & Sunny")).toBeInTheDocument();
  });

  it("displays detail grid items", () => {
    render(<WeatherCard data={mockData} unit="C" />);
    expect(screen.getByText("Feels Like")).toBeInTheDocument();
    expect(screen.getByText("Humidity")).toBeInTheDocument();
    expect(screen.getByText("Wind")).toBeInTheDocument();
    expect(screen.getByText("UV Index")).toBeInTheDocument();
    expect(screen.getByText("Visibility")).toBeInTheDocument();
    expect(screen.getByText("Pressure")).toBeInTheDocument();
  });

  it("shows correct humidity value", () => {
    render(<WeatherCard data={mockData} unit="C" />);
    expect(screen.getByText("80%")).toBeInTheDocument();
  });

  it("shows correct wind info", () => {
    render(<WeatherCard data={mockData} unit="C" />);
    expect(screen.getByText("8 km/h SE")).toBeInTheDocument();
  });
});
