import { getWeatherIcon, DetailIcon } from "./WeatherIcons";
import { displayTemp, unitLabel, formatWind } from "../utils/units";
import { formatDate, formatTime, getRelativeTime } from "../utils/timeUtils";

export default function WeatherCard({
  data,
  unit = "C",
  isFavorite = false,
  onToggleFavorite = null,
  onRefresh = null,
  isRefreshing = false,
}) {
  if (!data) return null;

  const cityName = data.location?.name || data.city || 'Unknown Location';
  const region = data.location?.region;
  const country = data.location?.country || data.country || '';
  const locationSubtitle = [region, country].filter(Boolean).join(', ');

  const current = data.current || {};
  const u = unitLabel(unit);

  const windFormatted = formatWind(current.windSpeed, current.windDirCompass || current.windDir, unit);

  const details = [
    { label: "Feels Like", value: `${displayTemp(current.feelsLike, unit)}${u}`, iconType: "thermometer" },
    { label: "Humidity", value: `${current.humidity ?? '--'}%`, iconType: "droplet" },
    { label: "Wind", value: windFormatted, iconType: "wind" },
    { label: "UV Index", value: current.uv ?? '--', iconType: "sun" },
    { label: "Visibility", value: `${current.visibility ?? '--'} km`, iconType: "eye" },
    { label: "Pressure", value: `${current.pressure ?? '--'} hPa`, iconType: "gauge" },
  ];

  const sunrise = current.sunrise ? formatTime(current.sunrise, data.timezone) : null;
  const sunset = current.sunset ? formatTime(current.sunset, data.timezone) : null;
  const relativeUpdated = data.fetchedAt ? getRelativeTime(data.fetchedAt) : null;

  return (
    <div className="glass-strong glass-3d float-3d rounded-3xl p-6 md:p-8 animate-fade-in-up relative overflow-hidden" role="region" aria-label={`Current weather for ${cityName}`}>
      {/* Offline / Cached / Refreshing status bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {data.isStale && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Offline Cache
            </span>
          )}
          {relativeUpdated && (
            <span className="text-white/40 text-xs flex items-center gap-1">
              {relativeUpdated}
            </span>
          )}
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="text-white/40 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            title="Refresh weather data"
            aria-label="Refresh weather data"
          >
            <svg
              className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-white' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        )}
      </div>

      {/* Location + date + favorite toggle */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              {cityName}
            </h2>
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className="p-1 rounded-full text-white/50 hover:text-amber-300 transition-colors"
                title={isFavorite ? "Remove from favorites" : "Save to favorites"}
                aria-label={isFavorite ? `Remove ${cityName} from favorites` : `Save ${cityName} to favorites`}
              >
                <svg
                  className={`w-5 h-5 transition-transform active:scale-125 ${isFavorite ? 'fill-amber-400 text-amber-400' : 'fill-transparent text-white/60'}`}
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
            )}
          </div>
          {locationSubtitle && <p className="text-white/60 text-sm mt-1">{locationSubtitle}</p>}
        </div>
        <p className="text-white/40 text-xs mt-2 text-right">
          {formatDate(new Date().toISOString(), data.timezone)}
        </p>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-baseline">
            <span className="text-7xl md:text-8xl font-extrabold text-white tracking-tighter">
              {displayTemp(current.temp, unit)}{u}
            </span>
          </div>
          <p className="text-lg text-white/80 mt-1 font-medium">{current.condition}</p>
          {current.precipProbability > 0 && (
            <p className="text-xs text-blue-300 mt-1 flex items-center gap-1">
              <span>💧 {current.precipProbability}% chance of rain</span>
            </p>
          )}
        </div>
        <div className="flex-shrink-0 animate-float">
          {getWeatherIcon(current.conditionCode ?? current.condition, 96, current.isDay)}
        </div>
      </div>

      {/* Sunrise & Sunset mini-bar if available */}
      {(sunrise || sunset) && (
        <div className="flex items-center justify-around py-2 mb-4 rounded-xl bg-white/5 border border-white/10 text-xs text-white/70">
          {sunrise && (
            <div className="flex items-center gap-1.5">
              <span>🌅</span>
              <span>Sunrise: <strong className="text-white">{sunrise}</strong></span>
            </div>
          )}
          {sunset && (
            <div className="flex items-center gap-1.5">
              <span>🌇</span>
              <span>Sunset: <strong className="text-white">{sunset}</strong></span>
            </div>
          )}
        </div>
      )}

      {/* Detail grid */}
      <div className="grid grid-cols-3 gap-3">
        {details.map((d) => (
          <div
            key={d.label}
            className="glass glass-3d rounded-xl p-3 text-center relative overflow-hidden"
          >
            <span className="flex justify-center mb-1"><DetailIcon type={d.iconType} size={20} /></span>
            <p className="text-white text-sm font-semibold truncate">{d.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
