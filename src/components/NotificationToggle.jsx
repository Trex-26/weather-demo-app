export default function NotificationToggle({
  isSupported,
  isEnabled,
  onToggle,
}) {
  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`glass rounded-xl p-2.5 transition-all flex items-center justify-center ${
        isEnabled ? 'bg-amber-400/20 text-amber-300 border-amber-400/40' : 'text-white/60 hover:text-white hover:bg-white/10'
      }`}
      title={isEnabled ? "Weather alerts enabled" : "Enable weather notifications"}
      aria-label={isEnabled ? "Disable severe weather notifications" : "Enable severe weather notifications"}
    >
      <svg className="w-5 h-5" fill={isEnabled ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    </button>
  );
}
