export default function UnitToggle({ unit, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="glass-strong glass-3d rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-semibold dark:text-white text-slate-800 relative overflow-hidden active:scale-95"
      aria-label={`Switch to ${unit === "C" ? "Fahrenheit" : "Celsius"}`}
    >
      <span className={unit === "C" ? "text-sky-400" : "text-white/40"}>°C</span>
      <div className="w-8 h-4 bg-white/10 rounded-full relative transition-colors duration-200">
        <div
          className={`absolute top-0.5 w-3 h-3 bg-sky-400 rounded-full transition-transform duration-300 ${
            unit === "F" ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
      <span className={unit === "F" ? "text-sky-400" : "text-white/40"}>°F</span>
    </button>
  );
}
