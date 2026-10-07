import { useState } from "react";

export default function WeatherAlerts({ alerts = [] }) {
  const [dismissed, setDismissed] = useState([]);

  if (!alerts || alerts.length === 0) return null;

  const activeAlerts = alerts.filter((a) => !dismissed.includes(a.id));
  if (activeAlerts.length === 0) return null;

  return (
    <div className="space-y-2 mb-4 animate-fade-in" role="alert">
      {activeAlerts.map((alert) => {
        const isSevere = alert.severity === "severe";
        const bgClass = isSevere
          ? "bg-red-500/20 border-red-500/40 text-red-200"
          : "bg-amber-500/20 border-amber-500/40 text-amber-200";

        return (
          <div
            key={alert.id}
            className={`p-4 rounded-2xl border backdrop-blur-md flex items-start justify-between gap-3 ${bgClass}`}
          >
            <div className="flex items-start gap-3">
              <span className="text-xl shrink-0 mt-0.5">
                {isSevere ? "🚨" : "⚠️"}
              </span>
              <div>
                <h4 className="font-bold text-sm text-white">
                  {alert.headline || alert.event}
                </h4>
                <p className="text-xs opacity-90 mt-0.5 leading-relaxed">
                  {alert.description}
                </p>
              </div>
            </div>
            <button
              onClick={() => setDismissed((prev) => [...prev, alert.id])}
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 shrink-0 transition-colors"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
