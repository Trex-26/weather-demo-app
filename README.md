live demo- https://weather-demo-app-withapi.netlify.app/


# SkyCast — Real-Time Weather Application

A production-quality weather application built with React 19, Vite, and Tailwind CSS. Powered entirely by free, open APIs (**zero API keys required**), featuring live Open-Meteo forecasts, geocoding search, GPS location detection, Air Quality Index (AQI), 24-hour hourly breakdown, 7-day extended forecasts, interactive precipitation radar maps, and client-side offline caching.

---

## 🌟 Key Features

- **Live Real-Time Weather**: Real-time current conditions, apparent temperature, humidity, pressure, UV index, wind speed/direction, and visibility.
- **Zero API Keys Required**: Integrates seamlessly with Open-Meteo Weather, Geocoding, and Air Quality APIs at zero cost without backend proxies.
- **Instant Geocoding Search**: Debounced live search with fuzzy matching, country flags, recent searches memory, and keyboard accessibility.
- **GPS "Use My Location"**: One-click geolocation with reverse geocoding to detect the user's city name and current coordinates.
- **Air Quality Index (AQI)**: US AQI calculation with health severity badges and pollutant breakdowns (PM2.5, PM10, NO₂, O₃).
- **24-Hour Hourly Breakdown**: Interactive scrollable timeline showing hourly temperatures, precipitation probabilities, and wind speeds.
- **7-Day Forecast & Daily Inspection**: Extended forecast cards that can be clicked to inspect each individual day's hourly progression.
- **Interactive Weather Radar Map**: Leaflet map with OpenStreetMap tiles and RainViewer radar overlay.
- **Saved Favorites**: LocalStorage-persisted favorite cities with instant switching and drawer management.
- **Severe Weather Alerts & Notifications**: Automatic detection of severe thunderstorms, extreme heat, and high winds with browser notification opt-in.
- **Shareable State**: Automatically syncs current location coordinates to URL query parameters (`?lat=...&lon=...&city=...`) with Web Share API and clipboard copy support.
- **Mobile First Interactions**: Full pull-to-refresh gesture support and horizontal swipe gestures to cycle between favorite cities.
- **Adaptive Aesthetics**: Dynamic weather backgrounds (rain, snow, thunderstorms, heat waves, fog, wind streaks), glassmorphic design, and instant Dark/Light theme switching.

---

## 🏗️ Architecture & Engineering

```
src/
├── services/weather/
│   ├── apiClient.js         # HTTP client with timeouts, retries, exponential backoff, & abort support
│   ├── geocodingService.js  # Open-Meteo geocoding search & BigDataCloud reverse geocode
│   ├── weatherService.js    # Core forecast data orchestrator
│   ├── airQualityService.js # AQI interpreter and pollutant calculator
│   ├── weatherMapper.js     # Normalizer converting API payloads to internal schema
│   ├── weatherCodes.js      # Central WMO weather code mapping and severe alert detection
│   └── cacheService.js      # Dual-tier (memory + localStorage) cache with TTL and stale fallbacks
├── hooks/
│   ├── useWeather.js        # Main weather hook with AbortController, auto-refresh, and tab revalidation
│   ├── useGeolocation.js    # Browser GPS with permission management and error handling
│   ├── useFavorites.js      # Favorites CRUD with safe localStorage persistence
│   ├── useSearchHistory.js  # Deduplicated recent searches tracking
│   ├── useNotifications.js  # Web Notifications API with permission gating
│   ├── useShareWeather.js   # URL query param synchronization and Web Share API
│   ├── usePullToRefresh.js  # Touch pull-to-refresh hook
│   └── useSwipeGesture.js   # Touch swipe navigation hook
├── utils/
│   ├── units.js             # Celsius/Fahrenheit conversion, display formatting, and locale defaults
│   ├── storage.js           # Safe localStorage wrapper guarding against quota and parse errors
│   └── timeUtils.js         # Timezone-aware date/time formatting and relative timestamps
└── components/
    ├── SearchBar.jsx        # Combobox search with autocomplete and GPS trigger
    ├── WeatherCard.jsx      # Glassmorphic primary weather summary
    ├── HourlyForecast.jsx   # Horizontal 24-hour breakdown
    ├── ForecastList.jsx     # 7-day forecast cards
    ├── AirQuality.jsx       # US AQI card and pollutant details
    ├── WeatherMap.jsx       # Leaflet radar and satellite map
    ├── WeatherAlerts.jsx    # Severe condition warning banner
    ├── FavoritesPanel.jsx   # Saved locations drawer
    ├── WeatherBackground.jsx# Animated dynamic weather particle background
    └── ErrorBoundary.jsx    # Fault tolerance wrapper with reload recovery
```

---

## 🚀 Getting Started

### 1. Installation

```bash
npm install
```

### 2. Development Server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Running Tests

```bash
npm test
```

Runs the 60-test Vitest test suite covering unit conversions, weather mappers, caching TTL, hooks, and component interactions.

### 4. Production Build

```bash
npm run build
npm run preview
```

## 🔒 Security & Privacy

- No API keys or secrets are stored or needed in the client bundle.
- Geolocation is strictly client-side and only queried upon explicit user interaction ("Use My Location").
- All preferences (units, theme, favorites) stay in the user's browser `localStorage`.
