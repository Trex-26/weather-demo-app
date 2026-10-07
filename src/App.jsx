import { useState, useEffect, useCallback, useMemo } from "react";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastList from "./components/ForecastList";
import HourlyForecast from "./components/HourlyForecast";
import AirQuality from "./components/AirQuality";
import WeatherAlerts from "./components/WeatherAlerts";
import WeatherMap from "./components/WeatherMap";
import FavoritesPanel from "./components/FavoritesPanel";
import WeatherBackground from "./components/WeatherBackground";
import UnitToggle from "./components/UnitToggle";
import ThemeToggle from "./components/ThemeToggle";
import NotificationToggle from "./components/NotificationToggle";
import ShareButton from "./components/ShareButton";

import { useWeather } from "./hooks/useWeather";
import { useGeolocation } from "./hooks/useGeolocation";
import { useFavorites } from "./hooks/useFavorites";
import { useSearchHistory } from "./hooks/useSearchHistory";
import { useNotifications } from "./hooks/useNotifications";
import { useShareWeather } from "./hooks/useShareWeather";
import { useSwipeGesture } from "./hooks/useSwipeGesture";
import { usePullToRefresh } from "./hooks/usePullToRefresh";

import { searchLocations } from "./services/weather/geocodingService";
import { getInitialUnit } from "./utils/units";
import { safeSet, safeGetRaw, safeSetRaw } from "./utils/storage";

const DEFAULT_CITIES = [
  { name: "Tokyo", lat: 35.6762, lon: 139.6503, country: "Japan", countryCode: "JP", timezone: "Asia/Tokyo" },
  { name: "London", lat: 51.5074, lon: -0.1278, country: "United Kingdom", countryCode: "GB", timezone: "Europe/London" },
  { name: "New York", lat: 40.7128, lon: -74.006, country: "United States", countryCode: "US", timezone: "America/New_York" },
  { name: "Paris", lat: 48.8566, lon: 2.3522, country: "France", countryCode: "FR", timezone: "Europe/Paris" },
  { name: "Sydney", lat: -33.8688, lon: 151.2093, country: "Australia", countryCode: "AU", timezone: "Australia/Sydney" },
  { name: "Dubai", lat: 25.2048, lon: 55.2708, country: "United Arab Emirates", countryCode: "AE", timezone: "Asia/Dubai" },
  { name: "Bengaluru", lat: 12.9716, lon: 77.5946, country: "India", countryCode: "IN", timezone: "Asia/Kolkata" },
  { name: "Singapore", lat: 1.3521, lon: 103.8198, country: "Singapore", countryCode: "SG", timezone: "Asia/Singapore" },
];

function getInitialTheme() {
  const saved = safeGetRaw("weather-theme");
  if (saved) return saved;
  return typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [unit, setUnit] = useState(getInitialUnit);
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [swipeDir, setSwipeDir] = useState(null);

  // Custom Hooks
  const { urlLocation, syncLocationToUrl, shareWeather, isCopied } = useShareWeather();
  const { favorites, isFavorite, toggleFavorite, removeFavorite } = useFavorites();
  const { history, addSearch } = useSearchHistory();
  const { getCurrentLocation, isLocating, geoError, clearGeoError } = useGeolocation();
  const { isSupported: notifsSupported, isEnabled: notifsEnabled, toggleNotifications, sendNotification } = useNotifications();

  // Active Location state
  const [currentLocation, setCurrentLocation] = useState(() => {
    return urlLocation || (favorites.length > 0 ? favorites[0] : DEFAULT_CITIES[0]);
  });

  // Sync initial URL location if available
  useEffect(() => {
    if (urlLocation) {
      setCurrentLocation(urlLocation);
    }
  }, [urlLocation]);

  // Main Weather Hook
  const { weather, loading, error, isRefreshing, refresh } = useWeather(currentLocation);

  // Sync active location to URL query string
  useEffect(() => {
    if (currentLocation) {
      syncLocationToUrl(currentLocation);
    }
  }, [currentLocation, syncLocationToUrl]);

  // Handle severe weather notifications
  useEffect(() => {
    if (notifsEnabled && weather?.alerts?.length > 0) {
      const severeAlert = weather.alerts.find(a => a.severity === 'severe');
      if (severeAlert) {
        sendNotification(`⚠️ Severe Weather Alert: ${currentLocation.name}`, {
          body: severeAlert.description,
        });
      }
    }
  }, [notifsEnabled, weather?.alerts, currentLocation?.name, sendNotification]);

  // Theme effect
  useEffect(() => {
    safeSetRaw("weather-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  // Unit persistence
  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === "C" ? "F" : "C";
      safeSet("weather-unit", next);
      return next;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  // Location selection handler
  const handleSelectLocation = useCallback((location) => {
    setCurrentLocation(location);
    setSelectedDayIndex(0);
    addSearch(location);
  }, [addSearch]);

  // Search by query string fallback
  const handleSearchQuery = useCallback(async (query) => {
    try {
      const results = await searchLocations(query);
      if (results.length > 0) {
        handleSelectLocation(results[0]);
      } else {
        // Fallback to checking preset cities
        const match = DEFAULT_CITIES.find(c => c.name.toLowerCase() === query.toLowerCase());
        if (match) {
          handleSelectLocation(match);
        }
      }
    } catch (err) {
      console.warn("Search query failed:", err);
    }
  }, [handleSelectLocation]);

  // GPS My Location
  const handleUseMyLocation = useCallback(async () => {
    try {
      const loc = await getCurrentLocation();
      if (loc) {
        handleSelectLocation(loc);
      }
    } catch {
      // Handled inside hook
    }
  }, [getCurrentLocation, handleSelectLocation]);

  // Navigation between locations via swipe
  const cityList = useMemo(() => {
    if (favorites.length > 0) return favorites;
    return DEFAULT_CITIES;
  }, [favorites]);

  const navigateCity = useCallback((direction) => {
    if (cityList.length <= 1) return;

    const currentIdx = cityList.findIndex(
      (c) => c.name?.toLowerCase() === currentLocation.name?.toLowerCase()
    );

    const nextIdx = direction === "left"
      ? (currentIdx + 1) % cityList.length
      : (currentIdx - 1 + cityList.length) % cityList.length;

    handleSelectLocation(cityList[nextIdx]);
    setSwipeDir(direction);
    setTimeout(() => setSwipeDir(null), 300);
  }, [cityList, currentLocation.name, handleSelectLocation]);

  const { handlers: swipeHandlers } = useSwipeGesture({
    onSwipeLeft: () => navigateCity("left"),
    onSwipeRight: () => navigateCity("right"),
    threshold: 40,
  });

  const { pullDistance, isRefreshing: pullRefreshing, handlers: pullHandlers } = usePullToRefresh({
    onRefresh: refresh,
    threshold: 80,
    maxPull: 100,
  });

  const suggestions = useMemo(() => {
    return DEFAULT_CITIES.map(c => c.name);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative perspective-container" {...pullHandlers}>
      {/* Background with real condition / weather code */}
      <WeatherBackground
        condition={weather?.current?.condition}
        conditionCode={weather?.current?.conditionCode}
        temp={weather?.current?.temp}
        windSpeed={weather?.current?.windSpeed}
        isDay={weather?.current?.isDay}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <header className="pt-6 pb-3 px-4 sm:pt-8 sm:pb-4 animate-fade-in-up">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>SkyCast</span>
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 border border-white/15 hidden sm:inline-block">
                Live Open-Meteo
              </span>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex items-center gap-2">
              <ShareButton onShare={() => shareWeather(weather, unit)} isCopied={isCopied} />
              <NotificationToggle
                isSupported={notifsSupported}
                isEnabled={notifsEnabled}
                onToggle={toggleNotifications}
              />
              <button
                type="button"
                onClick={() => setIsFavoritesOpen(true)}
                className={`glass rounded-xl p-2.5 transition-all flex items-center justify-center ${
                  favorites.length > 0 ? 'text-amber-300 hover:bg-amber-400/20' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
                title="View saved favorite locations"
                aria-label="View saved favorites"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              <ThemeToggle theme={theme} onToggle={toggleTheme} />
            </div>
          </div>
        </header>

        {/* Search & Unit Controls */}
        <div className="px-4 mb-5 sm:mb-6 animate-fade-in-up animate-delay-100 relative z-30">
          <SearchBar
            onSearch={handleSearchQuery}
            onSelectLocation={handleSelectLocation}
            suggestions={suggestions}
            onUseLocation={handleUseMyLocation}
            isLocating={isLocating}
            recentSearches={history}
          />
          <div className="flex justify-center mt-3 sm:mt-4">
            <UnitToggle unit={unit} onToggle={toggleUnit} />
          </div>
        </div>

        {/* Geolocation error toast if any */}
        {geoError && (
          <div className="max-w-md mx-auto px-4 mb-4 animate-fade-in">
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs flex items-center justify-between">
              <span>{geoError}</span>
              <button onClick={clearGeoError} className="text-white/60 hover:text-white ml-2">✕</button>
            </div>
          </div>
        )}

        {/* Pull to refresh visual indicator */}
        {weather && (
          <div
            className="pull-indicator mx-auto w-full max-w-3xl"
            style={{ height: pullDistance > 0 || pullRefreshing || isRefreshing ? pullDistance : 0 }}
          >
            {pullRefreshing || isRefreshing ? (
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

        {/* Main Content Area */}
        <main className="flex-1 px-3 sm:px-4 pb-8 sm:pb-12 max-w-3xl mx-auto w-full relative z-0">
          {loading && !weather && (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="w-12 h-12 border-[3px] border-white/20 border-t-sky-400 rounded-full animate-spin" />
              <p className="text-white/60 text-sm font-medium">Fetching real-time weather...</p>
            </div>
          )}

          {error && (
            <div className="glass glass-3d rounded-3xl p-8 text-center animate-fade-in-up relative overflow-hidden mb-6">
              <span className="text-4xl block mb-3">📡</span>
              <h3 className="text-lg font-bold text-white mb-2">Weather Data Unavailable</h3>
              <p className="text-white/70 text-sm mb-6 max-w-sm mx-auto">{error}</p>
              <button
                onClick={refresh}
                className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-5 py-2 rounded-xl transition-all shadow-md active:scale-95 text-sm"
              >
                Retry Request
              </button>
            </div>
          )}

          {weather && (
            <div
              className={`space-y-6 swipe-container ${swipeDir === "left" ? "swipe-out-left" : swipeDir === "right" ? "swipe-out-right" : ""}`}
              {...swipeHandlers}
            >
              {/* Severe Weather Alerts Banner */}
              <WeatherAlerts alerts={weather.alerts} />

              {/* Main Weather Card */}
              <WeatherCard
                data={weather}
                unit={unit}
                isFavorite={isFavorite(currentLocation)}
                onToggleFavorite={() => toggleFavorite(currentLocation)}
                onRefresh={refresh}
                isRefreshing={isRefreshing}
              />

              {/* 24-Hour Hourly Forecast */}
              <HourlyForecast
                hourly={weather.hourly}
                unit={unit}
                selectedDayIndex={selectedDayIndex}
              />

              {/* 7-Day Forecast */}
              <ForecastList
                forecast={weather.daily || weather.forecast}
                unit={unit}
                selectedDayIndex={selectedDayIndex}
                onSelectDay={(idx) => setSelectedDayIndex(idx)}
              />

              {/* Air Quality Index */}
              <AirQuality airQuality={weather.airQuality} />

              {/* Interactive Weather Map */}
              <WeatherMap
                location={weather.location}
                current={weather.current}
                unit={unit}
              />

              {/* Mobile Gesture Hints */}
              <p className="text-center text-white/30 text-xs mt-4 md:hidden">
                ← swipe to cycle locations • pull down to refresh →
              </p>
            </div>
          )}
        </main>

        {/* Saved Favorites Drawer/Modal */}
        <FavoritesPanel
          favorites={favorites}
          isOpen={isFavoritesOpen}
          onClose={() => setIsFavoritesOpen(false)}
          onSelectFavorite={handleSelectLocation}
          onRemoveFavorite={removeFavorite}
        />

        {/* Footer */}
        <footer className="text-center py-6 text-white/40 text-xs flex flex-col items-center gap-1">
          <p>Real-time data powered by <a href="https://open-meteo.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">Open-Meteo</a> &amp; <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer" className="underline hover:text-white">OpenStreetMap</a></p>
          <p className="text-2xs text-white/25">Near-production portfolio build • No API keys required</p>
        </footer>
      </div>
    </div>
  );
}
