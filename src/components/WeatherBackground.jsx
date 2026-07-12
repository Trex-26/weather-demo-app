import { useMemo } from "react";

/**
 * Maps a weather condition string to a category for background selection.
 */
function getConditionCategory(condition) {
  const c = condition.toLowerCase();
  if (c.includes("thunder") || c.includes("storm")) return "thunderstorm";
  if (c.includes("rain") || c.includes("drizzle") || c.includes("monsoon")) return "rain";
  if (c.includes("snow") || c.includes("blizzard")) return "snow";
  if (c.includes("fog") || c.includes("haze") || c.includes("mist")) return "fog";
  if (c.includes("wind") || c.includes("breezy")) return "wind";
  if (c.includes("cloud") || c.includes("overcast")) return "cloudy";
  if (c.includes("scorching") || c.includes("hot")) return "hot";
  return "clear";
}

/* ─── Particle generators ─── */

function RainDrops() {
  const drops = useMemo(
    () =>
      Array.from({ length: 80 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 0.6 + Math.random() * 0.4,
        opacity: 0.2 + Math.random() * 0.4,
      })),
    []
  );
  return (
    <div className="weather-layer">
      {drops.map((d) => (
        <div
          key={d.id}
          className="raindrop"
          style={{
            left: `${d.left}%`,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
            opacity: d.opacity,
          }}
        />
      ))}
    </div>
  );
}

function SnowFlakes() {
  const flakes = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 4 + Math.random() * 4,
        size: 4 + Math.random() * 6,
        opacity: 0.4 + Math.random() * 0.5,
      })),
    []
  );
  return (
    <div className="weather-layer">
      {flakes.map((f) => (
        <div
          key={f.id}
          className="snowflake"
          style={{
            left: `${f.left}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            width: `${f.size}px`,
            height: `${f.size}px`,
            opacity: f.opacity,
          }}
        />
      ))}
    </div>
  );
}

function SunRays() {
  return (
    <div className="weather-layer">
      <div className="sun-orb" />
      <div className="sun-ray ray-1" />
      <div className="sun-ray ray-2" />
      <div className="sun-ray ray-3" />
      <div className="sun-ray ray-4" />
    </div>
  );
}

function CloudParticles() {
  const clouds = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => ({
        id: i,
        top: 5 + Math.random() * 40,
        delay: i * 3,
        duration: 20 + Math.random() * 15,
        scale: 0.6 + Math.random() * 0.8,
        opacity: 0.06 + Math.random() * 0.08,
      })),
    []
  );
  return (
    <div className="weather-layer">
      {clouds.map((c) => (
        <div
          key={c.id}
          className="cloud-particle"
          style={{
            top: `${c.top}%`,
            animationDelay: `${c.delay}s`,
            animationDuration: `${c.duration}s`,
            "--cloud-scale": c.scale,
            opacity: c.opacity,
          }}
        />
      ))}
    </div>
  );
}

function FogLayers() {
  return (
    <div className="weather-layer">
      <div className="fog-layer fog-1" />
      <div className="fog-layer fog-2" />
      <div className="fog-layer fog-3" />
    </div>
  );
}

function WindStreaks() {
  const streaks = useMemo(
    () =>
      Array.from({ length: 15 }, (_, i) => ({
        id: i,
        top: 10 + Math.random() * 80,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 2,
        width: 60 + Math.random() * 120,
        opacity: 0.08 + Math.random() * 0.12,
      })),
    []
  );
  return (
    <div className="weather-layer">
      {streaks.map((s) => (
        <div
          key={s.id}
          className="wind-streak"
          style={{
            top: `${s.top}%`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
            width: `${s.width}px`,
            opacity: s.opacity,
          }}
        />
      ))}
    </div>
  );
}

function LightningFlash() {
  return (
    <div className="weather-layer">
      <div className="lightning-flash" />
      <div className="lightning-flash lightning-flash-2" />
    </div>
  );
}

function HotShimmer() {
  return (
    <div className="weather-layer">
      <div className="heat-shimmer shimmer-1" />
      <div className="heat-shimmer shimmer-2" />
      <div className="heat-shimmer shimmer-3" />
    </div>
  );
}

/* ─── Background configs per condition ─── */

function getBackgroundConfig(category) {
  const configs = {
    clear: {
      gradient: "linear-gradient(180deg, #0c4a6e 0%, #0369a1 40%, #0ea5e9 100%)",
      layers: [<SunRays key="sun" />],
    },
    cloudy: {
      gradient: "linear-gradient(180deg, #1e293b 0%, #334155 50%, #475569 100%)",
      layers: [<CloudParticles key="clouds" />],
    },
    rain: {
      gradient: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #1e3a5f 100%)",
      layers: [<RainDrops key="rain" />, <CloudParticles key="clouds" />],
    },
    thunderstorm: {
      gradient: "linear-gradient(180deg, #020617 0%, #1e1b4b 50%, #1e3a5f 100%)",
      layers: [
        <RainDrops key="rain" />,
        <LightningFlash key="lightning" />,
        <CloudParticles key="clouds" />,
      ],
    },
    snow: {
      gradient: "linear-gradient(180deg, #1e293b 0%, #334155 50%, #475569 100%)",
      layers: [<SnowFlakes key="snow" />, <CloudParticles key="clouds" />],
    },
    fog: {
      gradient: "linear-gradient(180deg, #374151 0%, #4b5563 50%, #6b7280 100%)",
      layers: [<FogLayers key="fog" />],
    },
    wind: {
      gradient: "linear-gradient(180deg, #0f172a 0%, #1e3a5f 50%, #164e63 100%)",
      layers: [<WindStreaks key="wind" />, <CloudParticles key="clouds" />],
    },
    hot: {
      gradient: "linear-gradient(180deg, #78350f 0%, #92400e 40%, #b45309 100%)",
      layers: [<SunRays key="sun" />, <HotShimmer key="shimmer" />],
    },
  };
  return configs[category] || configs.clear;
}

export default function WeatherBackground({ condition }) {
  const category = getConditionCategory(condition || "");
  const config = getBackgroundConfig(category);

  return (
    <div className="weather-bg" style={{ background: config.gradient }}>
      {config.layers}
      {/* Overlay for depth */}
      <div className="weather-bg-overlay" />
    </div>
  );
}
