import { getWeatherIcon, DetailIcon } from "./WeatherIcons";
import { displayTemp } from "../utils/units";

export default function ForecastList({
  forecast = [],
  unit = "C",
  selectedDayIndex = 0,
  onSelectDay = null,
}) {
  if (!forecast || forecast.length === 0) return null;

  return (
    <div className="animate-fade-in-up animate-delay-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2">
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
          {forecast.length}-Day Forecast
        </h3>
        {onSelectDay && (
          <span className="text-xs text-white/40">Select day for hourly view</span>
        )}
      </div>

      <div className="flex gap-2 sm:grid sm:grid-cols-7 sm:gap-2.5 overflow-x-auto scroll-mobile pb-2">
        {forecast.map((day, i) => {
          const dayTitle = day.dayName || day.day || `Day ${i + 1}`;
          const highTemp = day.maxTemp ?? day.high ?? 0;
          const lowTemp = day.minTemp ?? day.low ?? 0;
          const isSelected = selectedDayIndex === i;
          const rainProb = day.precipProbability != null ? day.precipProbability : day.humidity;

          return (
            <button
              type="button"
              key={day.date || dayTitle + i}
              onClick={() => onSelectDay && onSelectDay(i)}
              className={`glass glass-3d rounded-2xl p-3 text-center group shrink-0 min-w-[76px] transition-all relative overflow-hidden text-left sm:text-center ${
                isSelected
                  ? 'ring-2 ring-blue-400 bg-white/20 shadow-lg scale-102'
                  : 'hover:bg-white/15'
              }`}
            >
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${isSelected ? 'text-white' : 'text-white/60'}`}>
                {dayTitle}
              </p>
              <span className="flex justify-center mb-2 group-hover:scale-110 transition-transform duration-200">
                {getWeatherIcon(day.conditionCode ?? day.condition, 40)}
              </span>
              <p className="text-white font-bold text-sm whitespace-nowrap">
                {displayTemp(highTemp, unit)}°
              </p>
              <p className="text-white/40 text-xs whitespace-nowrap">
                {displayTemp(lowTemp, unit)}°
              </p>
              {rainProb != null && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <DetailIcon type="droplet" size={12} />
                  <span className="text-white/40 text-xs">{rainProb}%</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
