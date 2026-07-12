import { useState, useEffect, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import WeatherBackground from "./components/WeatherBackground";
import UnitToggle from "./components/UnitToggle";
import ThemeToggle from "./components/ThemeToggle";
import { useSwipeGesture } from "./hooks/useSwipeGesture";
import { usePullToRefresh } from "./hooks/usePullToRefresh";
import { getWeatherByCity, getAllCityNames } from "./data/mockWeather";

const cityNames = getAllCityNames();

function getInitialTheme() {
  const saved = localStorage.getItem("weather-theme");
  if (saved) return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("C");
  const [theme, setTheme] = useState(getInitialTheme);
  const [swipeDir, setSwipeDir] = useState(null);

  const navigateCity = useCallback((direction) => {
    setWeather((current) => {
      if (!current) return current;
      const currentIdx = cityNames.findIndex(
        (c) => c.toLowerCase() === current.city.toLowerCase()
      );
      if (currentIdx === -1) return current;
      const nextIdx = direction === "left"
        ? (currentIdx + 1) % cityNames.length
        : (currentIdx - 1 + cityNames.length) % cityNames.length;
      const data = getWeatherByCity(cityNames[nextIdx]);
      return data || current;
    });
    setSwipeDir(direction);
    setTimeout(() => setSwipeDir(null), 300);
  }, []);

  const { handlers } = useSwipeGesture({
    onSwipeLeft: () => navigateCity("left"),
    onSwipeRight: () => navigateCity("right"),
    threshold: 40,
  });

  const refreshWeather = useCallback(() => {
    if (!weather) return Promise.resolve();
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = getWeatherByCity(weather.city);
        if (data) setWeather(data);
        resolve();
      }, 600);
    });
  }, [weather]);

  const { pullDistance, isRefreshing, handlers: pullHandlers } = usePullToRefresh({
    onRefresh: refreshWeather,
    threshold: 80,
    maxPull: 120,
  });

  useEffect(() => {
    localStorage.setItem("weather-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }

  function toggleUnit() {
    setUnit((u) => (u === "C" ? "F" : "C"));
  }

  function handleSearch(city) {
    setLoading(true);
    setError("");

    // Simulate network delay for realism
    setTimeout(() => {
      const data = getWeatherByCity(city);
      if (data) {
        setWeather(data);
        setError("");
      } else {
        setWeather(null);
        setError(`City "${city}" not found. Try: ${cityNames.join(", ")}`);
      }
      setLoading(false);
    }, 400);
  }

  return (
    <div className="min-h-screen flex flex-col relative perspective-container" {...pullHandlers}>
      <WeatherBackground condition={weather?.current?.condition} />
      <div className="relative z-10 flex flex-col min-h-screen">
      {/* Header */}
      <header className="pt-8 pb-4 px-4 sm:pt-10 sm:pb-6 animate-fade-in-up">
        <div className="flex items-center justify-center gap-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center tracking-tight">
            Weather App
          </h1>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </div>
        <p className="text-white/40 text-center text-xs sm:text-sm mt-1 sm:mt-2">
          Search any city for current conditions &amp; 5-day forecast
        </p>
      </header>

      {/* Search */}
      <div className="px-4 mb-6 sm:mb-8 animate-fade-in-up animate-delay-100">
        <SearchBar onSearch={handleSearch} suggestions={cityNames} />
        <div className="flex justify-center mt-3 sm:mt-4">
          <UnitToggle unit={unit} onToggle={toggleUnit} />
        </div>
      </div>

      {/* Pull to refresh indicator */}
      {weather && (
        <div
          className="pull-indicator mx-auto w-full max-w-3xl"
          style={{ height: pullDistance > 0 || isRefreshing ? pullDistance : 0 }}
        >
          {isRefreshing ? (
            <svg className="pull-spinner w-6 h-6 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
          ) : pullDistance > 0 ? (
            <svg className="pull-arrow w-5 h-5 text-white/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ transform: `rotate(${pullDistance >= 80 ? 180 : 0}deg)` }}>
              <path d="M12 19V5m0 0l-7 7m7-7l7 7" />
            </svg>
          ) : null}
        </div>
      )}

      {/* Content */}
      <main className="flex-1 px-3 sm:px-4 pb-8 sm:pb-10 max-w-3xl mx-auto w-full">
        {loading && (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-[3px] border-white/20 border-t-sky-400 rounded-full animate-spin" />
          </div>
        )}

        {error && !loading && (
          <div className="glass glass-3d rounded-2xl p-6 text-center animate-fade-in-up relative overflow-hidden">
            <span className="text-4xl block mb-3">🔍</span>
            <p className="text-white/70 text-sm">{error}</p>
          </div>
        )}

        {!weather && !error && !loading && (
          <div className="glass glass-3d rounded-2xl p-10 text-center animate-fade-in-up relative overflow-hidden">
            <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-white/30" strokeWidth="2" />
              <ellipse cx="32" cy="32" rx="12" ry="28" stroke="currentColor" className="text-white/25" strokeWidth="1.5" />
              <line x1="4" y1="24" x2="60" y2="24" stroke="currentColor" className="text-white/20" strokeWidth="1.5" />
              <line x1="4" y1="40" x2="60" y2="40" stroke="currentColor" className="text-white/20" strokeWidth="1.5" />
            </svg>
            <p className="text-white/60 text-lg font-medium">
              Enter a city name to get started
            </p>
            <p className="text-white/30 text-sm mt-2">
              Available: {cityNames.join(" • ")}
            </p>
          </div>
        )}

        {weather && !loading && (
          <div
            className={`space-y-6 swipe-container ${swipeDir === "left" ? "swipe-out-left" : swipeDir === "right" ? "swipe-out-right" : ""}`}
            {...handlers}
          >
            <WeatherCard data={weather} unit={unit} />
            <ForecastList forecast={weather.forecast} unit={unit} />
            {/* Mobile hints */}
            <p className="text-center text-white/20 text-xs mt-2 md:hidden">
              ← swipe to navigate • pull down to refresh →
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="text-center py-4 text-white/20 text-xs">
        Mock data only — no API key required
      </footer>
      </div>
    </div>
  );
}
