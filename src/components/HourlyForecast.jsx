import { useRef, useState, useCallback, useEffect } from "react";
import { getWeatherIcon } from "./WeatherIcons";
import { displayTemp } from "../utils/units";

export default function HourlyForecast({
  hourly = [],
  unit = "C",
  selectedDayIndex = 0,
}) {
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  if (!hourly || hourly.length === 0) return null;

  // Each day has 24 hours in Open-Meteo hourly array
  const startIdx = selectedDayIndex * 24;
  const dayHourly = hourly.slice(startIdx, startIdx + 24);
  const displayHours = dayHourly.length > 0 ? dayHourly : hourly.slice(0, 24);

  // Wheel listener to convert vertical mouse scroll into horizontal scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Arrow button click handler
  const handleScroll = useCallback((direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  }, []);

  // Mouse Drag-to-Scroll handlers
  const handleMouseDown = (e) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5; // Drag speed multiplier
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="animate-fade-in-up animate-delay-150">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2">
          <svg className="w-5 h-5 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Hourly Forecast
        </h3>

        {/* Scroll Controls & Indicator */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/40 hidden sm:inline">24-hour timeline</span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleScroll("left")}
              className="glass p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              title="Scroll left"
              aria-label="Scroll left in hourly forecast"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => handleScroll("right")}
              className="glass p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/20 transition-colors"
              title="Scroll right"
              aria-label="Scroll right in hourly forecast"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal scroll container with mouse wheel, drag, and touch support */}
      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        className={`flex gap-2.5 overflow-x-auto scroll-mobile pb-2 select-none ${
          isDragging ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ scrollBehavior: isDragging ? "auto" : "smooth" }}
        role="region"
        aria-label="Hourly forecast cards list"
        tabIndex="0"
      >
        {displayHours.map((hour, idx) => (
          <div
            key={hour.time || idx}
            className="glass glass-3d rounded-2xl p-3 text-center shrink-0 min-w-[72px] hover:bg-white/15 transition-all relative overflow-hidden pointer-events-auto"
          >
            <p className="text-white/50 text-xs font-medium mb-1.5 whitespace-nowrap">
              {hour.hourDisplay || hour.time?.split('T')[1]?.slice(0, 5) || `${idx}:00`}
            </p>
            <span className="flex justify-center my-1.5">
              {getWeatherIcon(hour.conditionCode ?? hour.condition, 32, hour.isDay)}
            </span>
            <p className="text-white font-bold text-sm whitespace-nowrap">
              {displayTemp(hour.temp, unit)}°
            </p>
            {hour.precipProbability > 0 ? (
              <p className="text-blue-300 text-xs mt-1 font-medium">
                💧{hour.precipProbability}%
              </p>
            ) : (
              <p className="text-white/30 text-xs mt-1">
                {hour.windSpeed} km/h
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
