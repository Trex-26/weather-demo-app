import { useMemo } from "react";

/* ─── Sunny ─── */
function SunnyIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="40" r="14" fill="#FCD34D" className="animate-[sun-glow_3s_ease-in-out_infinite]" />
      <circle cx="40" cy="40" r="18" fill="none" stroke="#FCD34D" strokeWidth="2" opacity="0.3" className="animate-[sun-ring_3s_ease-in-out_infinite]" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
        <line
          key={i}
          x1="40"
          y1="40"
          x2={40 + 28 * Math.cos((angle * Math.PI) / 180)}
          y2={40 + 28 * Math.sin((angle * Math.PI) / 180)}
          stroke="#FCD34D"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="animate-[ray-pulse_2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.25}s` }}
        />
      ))}
    </svg>
  );
}

/* ─── Partly Cloudy ─── */
function PartlyCloudyIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="52" cy="28" r="10" fill="#FCD34D" className="animate-[sun-glow_3s_ease-in-out_infinite]" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <line
          key={i}
          x1="52"
          y1="28"
          x2={52 + 16 * Math.cos((angle * Math.PI) / 180)}
          y2={28 + 16 * Math.sin((angle * Math.PI) / 180)}
          stroke="#FCD34D"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-[ray-pulse_2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}
      <g className="animate-[cloud-bob_4s_ease-in-out_infinite]">
        <ellipse cx="35" cy="50" rx="18" ry="10" fill="white" opacity="0.9" />
        <ellipse cx="28" cy="46" rx="12" ry="10" fill="white" opacity="0.9" />
        <ellipse cx="42" cy="44" rx="14" ry="11" fill="white" opacity="0.95" />
      </g>
    </svg>
  );
}

/* ─── Cloudy ─── */
function CloudyIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <g className="animate-[cloud-drift-slow_8s_ease-in-out_infinite]">
        <ellipse cx="40" cy="42" rx="22" ry="12" fill="white" opacity="0.6" />
        <ellipse cx="30" cy="38" rx="15" ry="12" fill="white" opacity="0.6" />
        <ellipse cx="50" cy="37" rx="16" ry="13" fill="white" opacity="0.65" />
      </g>
      <g className="animate-[cloud-bob_5s_ease-in-out_infinite]">
        <ellipse cx="42" cy="52" rx="20" ry="10" fill="white" opacity="0.85" />
        <ellipse cx="33" cy="48" rx="13" ry="10" fill="white" opacity="0.85" />
        <ellipse cx="50" cy="47" rx="14" ry="11" fill="white" opacity="0.9" />
      </g>
    </svg>
  );
}

/* ─── Rain ─── */
function RainIcon({ size = 80 }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 25 + (i % 3) * 12,
        delay: i * 0.3,
      })),
    []
  );
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <g className="animate-[cloud-bob_5s_ease-in-out_infinite]">
        <ellipse cx="40" cy="30" rx="22" ry="12" fill="white" opacity="0.85" />
        <ellipse cx="28" cy="26" rx="14" ry="11" fill="white" opacity="0.85" />
        <ellipse cx="50" cy="25" rx="15" ry="12" fill="white" opacity="0.9" />
      </g>
      {drops.map((d) => (
        <line
          key={d.id}
          x1={d.x}
          y1="44"
          x2={d.x - 3}
          y2="56"
          stroke="#93C5FD"
          strokeWidth="2"
          strokeLinecap="round"
          className="animate-[rain-fall-icon_0.8s_linear_infinite]"
          style={{ animationDelay: `${d.delay}s` }}
        />
      ))}
    </svg>
  );
}

/* ─── Drizzle (Light Rain) ─── */
function DrizzleIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <g className="animate-[cloud-bob_5s_ease-in-out_infinite]">
        <ellipse cx="40" cy="32" rx="20" ry="11" fill="white" opacity="0.8" />
        <ellipse cx="30" cy="28" rx="13" ry="10" fill="white" opacity="0.8" />
        <ellipse cx="48" cy="27" rx="14" ry="11" fill="white" opacity="0.85" />
      </g>
      {[32, 42, 50].map((x, i) => (
        <circle
          key={i}
          cx={x}
          cy="48"
          r="2"
          fill="#93C5FD"
          className="animate-[drizzle-drop_1.2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </svg>
  );
}

/* ─── Thunderstorm ─── */
function ThunderstormIcon({ size = 80 }) {
  const drops = useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: 22 + (i % 3) * 14,
        delay: i * 0.25,
      })),
    []
  );
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <g className="animate-[cloud-bob_4s_ease-in-out_infinite]">
        <ellipse cx="40" cy="28" rx="22" ry="12" fill="white" opacity="0.75" />
        <ellipse cx="28" cy="24" rx="14" ry="11" fill="white" opacity="0.75" />
        <ellipse cx="50" cy="23" rx="15" ry="12" fill="white" opacity="0.8" />
      </g>
      <polygon
        points="42,38 36,52 42,52 38,66 52,46 44,46 50,38"
        fill="#FBBF24"
        className="animate-[lightning-bolt_3s_ease-in-out_infinite]"
      />
      {drops.map((d) => (
        <line
          key={d.id}
          x1={d.x}
          y1="42"
          x2={d.x - 2}
          y2="52"
          stroke="#93C5FD"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="animate-[rain-fall-icon_0.7s_linear_infinite]"
          style={{ animationDelay: `${d.delay}s` }}
        />
      ))}
    </svg>
  );
}

/* ─── Wind / Breezy ─── */
function WindyIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {[30, 42, 54].map((y, i) => (
        <path
          key={i}
          d={`M15,${y} Q${35 + i * 5},${y - 6} ${55 + i * 3},${y} Q${65 + i * 2},${y} ${68 - i * 2},${y - 3}`}
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity={0.7 - i * 0.1}
          className="animate-[wind-line_2s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.4}s` }}
        />
      ))}
    </svg>
  );
}

/* ─── Fog / Haze ─── */
function FogIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      {[28, 40, 52].map((y, i) => (
        <line
          key={i}
          x1="15"
          y1={y}
          x2="65"
          y2={y}
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity={0.5 - i * 0.1}
          className="animate-[fog-line_4s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.8}s` }}
        />
      ))}
    </svg>
  );
}

/* ─── Scorching / Hot ─── */
function ScorchingIcon({ size = 80 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <circle cx="40" cy="38" r="12" fill="#EF4444" className="animate-[sun-glow_2s_ease-in-out_infinite]" />
      <circle cx="40" cy="38" r="16" fill="#EF4444" opacity="0.2" className="animate-[sun-ring_2s_ease-in-out_infinite]" />
      {[0, 60, 120, 180, 240, 300].map((angle, i) => (
        <line
          key={i}
          x1="40"
          y1="38"
          x2={40 + 24 * Math.cos((angle * Math.PI) / 180)}
          y2={38 + 24 * Math.sin((angle * Math.PI) / 180)}
          stroke="#F97316"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="animate-[ray-pulse_1.5s_ease-in-out_infinite]"
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </svg>
  );
}

/* ─── Snow ─── */
function SnowIcon({ size = 80 }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 22 + (i % 3) * 16,
        y: 46 + (i % 2) * 8,
        delay: i * 0.4,
      })),
    []
  );
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" fill="none">
      <g className="animate-[cloud-bob_5s_ease-in-out_infinite]">
        <ellipse cx="40" cy="28" rx="20" ry="11" fill="white" opacity="0.8" />
        <ellipse cx="30" cy="24" rx="13" ry="10" fill="white" opacity="0.8" />
        <ellipse cx="48" cy="23" rx="14" ry="11" fill="white" opacity="0.85" />
      </g>
      {flakes.map((f) => (
        <g key={f.id} className="animate-[snow-fall-icon_2s_linear_infinite]" style={{ animationDelay: `${f.delay}s` }}>
          <circle cx={f.x} cy={f.y} r="2.5" fill="white" opacity="0.9" />
        </g>
      ))}
    </svg>
  );
}

/* ─── Detail icons (small, for the info grid) ─── */
function DetailIcon({ type, size = 20 }) {
  const icons = {
    thermometer: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#93C5FD" strokeWidth="2" strokeLinecap="round">
        <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
        <circle cx="11.5" cy="17.5" r="2" fill="#EF4444" />
      </svg>
    ),
    droplet: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0L12 2.69z" fill="#38BDF8" opacity="0.7" />
      </svg>
    ),
    wind: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2" />
      </svg>
    ),
    sun: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
    ),
    eye: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
    gauge: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.7">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  };
  return icons[type] || null;
}

/* ─── Icon mapping ─── */
const conditionToIcon = {
  sunny: SunnyIcon,
  "clear sky": SunnyIcon,
  "humid & sunny": SunnyIcon,
  "partly cloudy": PartlyCloudyIcon,
  cloudy: CloudyIcon,
  overcast: CloudyIcon,
  rain: RainIcon,
  "heavy rain": RainIcon,
  drizzle: DrizzleIcon,
  "light rain": DrizzleIcon,
  thunderstorm: ThunderstormIcon,
  storm: ThunderstormIcon,
  wind: WindyIcon,
  breezy: WindyIcon,
  fog: FogIcon,
  foggy: FogIcon,
  haze: FogIcon,
  scorching: ScorchingIcon,
  hot: ScorchingIcon,
  snow: SnowIcon,
  monsoon: RainIcon,
};

export function getWeatherIcon(condition, size) {
  const key = condition.toLowerCase();
  const IconComponent = conditionToIcon[key] || SunnyIcon;
  return <IconComponent size={size} />;
}

export { SunnyIcon, PartlyCloudyIcon, CloudyIcon, RainIcon, DrizzleIcon, ThunderstormIcon, WindyIcon, FogIcon, ScorchingIcon, SnowIcon, DetailIcon };
