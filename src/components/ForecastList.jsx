import { getWeatherIcon, DetailIcon } from "./WeatherIcons";

function toF(c) { return Math.round(c * 9 / 5 + 32); }
function displayTemp(c, unit) { return unit === "F" ? toF(c) : c; }

export default function ForecastList({ forecast, unit = "C" }) {
  return (
    <div className="animate-fade-in-up animate-delay-200">
      <h3 className="text-lg font-semibold text-white/80 mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        5-Day Forecast
      </h3>

      <div className="flex gap-2 sm:grid sm:grid-cols-5 sm:gap-3 overflow-x-auto scroll-mobile pb-2">
        {forecast.map((day, i) => (
          <div
            key={day.day}
            className="glass glass-3d rounded-2xl p-3 md:p-4 text-center group shrink-0 w-[calc(20%-4px)] sm:w-auto min-w-[70px] relative overflow-hidden"
          >
            <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">
              {day.day}
            </p>
            <span className="flex justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
              {getWeatherIcon(day.condition, 48)}
            </span>
            <p className="text-white font-bold text-sm md:text-base whitespace-nowrap">
              {displayTemp(day.high, unit)}°
            </p>
            <p className="text-white/40 text-xs md:text-sm whitespace-nowrap">{displayTemp(day.low, unit)}°</p>
            <div className="mt-2 flex items-center justify-center gap-1">
              <DetailIcon type="droplet" size={12} />
              <span className="text-white/30 text-xs">{day.humidity}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
