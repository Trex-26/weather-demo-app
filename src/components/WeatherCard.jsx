import { getWeatherIcon, DetailIcon } from "./WeatherIcons";

function toF(c) { return Math.round(c * 9 / 5 + 32); }
function displayTemp(c, unit) { return unit === "F" ? toF(c) : c; }
function unitLabel(unit) { return unit === "F" ? "°F" : "°C"; }

export default function WeatherCard({ data, unit = "C" }) {
  const { city, country, current } = data;
  const u = unitLabel(unit);

  const details = [
    { label: "Feels Like", value: `${displayTemp(current.feelsLike, unit)}${u}`, iconType: "thermometer" },
    { label: "Humidity", value: `${current.humidity}%`, iconType: "droplet" },
    { label: "Wind", value: `${current.windSpeed} km/h ${current.windDir}`, iconType: "wind" },
    { label: "UV Index", value: current.uv, iconType: "sun" },
    { label: "Visibility", value: `${current.visibility} km`, iconType: "eye" },
    { label: "Pressure", value: `${current.pressure} hPa`, iconType: "gauge" },
  ];

  return (
    <div className="glass-strong glass-3d float-3d rounded-3xl p-6 md:p-8 animate-fade-in-up relative overflow-hidden">
      {/* Location + time */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {city}
          </h2>
          <p className="text-white/50 text-sm mt-1">{country}</p>
        </div>
        <p className="text-white/40 text-xs mt-2">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Main temp + icon */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-7xl md:text-8xl font-extrabold text-white tracking-tighter">
            {displayTemp(current.temp, unit)}{u}
          </span>
          <p className="text-lg text-white/60 mt-1">{current.condition}</p>
        </div>
        <div className="flex-shrink-0">
          {getWeatherIcon(current.condition, 96)}
        </div>
      </div>

      {/* Detail grid */}
      <div className="grid grid-cols-3 gap-3">
        {details.map((d) => (
          <div
            key={d.label}
            className="glass glass-3d rounded-xl p-3 text-center relative overflow-hidden"
          >
            <span className="flex justify-center mb-1"><DetailIcon type={d.iconType} size={20} /></span>
            <p className="text-white text-sm font-semibold">{d.value}</p>
            <p className="text-white/40 text-xs mt-0.5">{d.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
