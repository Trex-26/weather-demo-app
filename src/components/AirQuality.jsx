export default function AirQuality({ airQuality }) {
  if (!airQuality || airQuality.aqi == null) return null;

  const { aqi, label, color, description, pm25, pm10, no2, o3 } = airQuality;

  const pollutants = [
    { name: "PM2.5", value: pm25 != null ? `${pm25} µg/m³` : '--' },
    { name: "PM10", value: pm10 != null ? `${pm10} µg/m³` : '--' },
    { name: "NO₂", value: no2 != null ? `${no2} µg/m³` : '--' },
    { name: "O₃", value: o3 != null ? `${o3} µg/m³` : '--' },
  ];

  return (
    <div className="glass-strong glass-3d rounded-3xl p-6 animate-fade-in-up relative overflow-hidden" role="region" aria-label="Air Quality Index">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white/80 flex items-center gap-2">
          <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
          </svg>
          Air Quality
        </h3>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md shadow-sm"
          style={{
            backgroundColor: `${color}25`,
            borderColor: `${color}60`,
            color: color || '#10b981',
          }}
        >
          {label}
        </span>
      </div>

      <div className="flex items-baseline gap-3 mb-3">
        <span className="text-5xl font-extrabold text-white tracking-tight">
          {aqi}
        </span>
        <span className="text-sm text-white/50 font-medium">US AQI</span>
      </div>

      <p className="text-xs text-white/70 mb-5 leading-relaxed">
        {description}
      </p>

      {/* Pollutant levels */}
      <div className="grid grid-cols-4 gap-2">
        {pollutants.map((p) => (
          <div key={p.name} className="glass glass-3d rounded-xl p-2.5 text-center">
            <p className="text-white/40 text-2xs uppercase tracking-wider mb-0.5">{p.name}</p>
            <p className="text-white text-xs font-semibold truncate">{p.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
