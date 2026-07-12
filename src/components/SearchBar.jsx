import { useState } from "react";

export default function SearchBar({ onSearch, suggestions }) {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filtered = suggestions.filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  );

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowSuggestions(false);
    }
  }

  function handleSelect(city) {
    setQuery(city);
    onSearch(city);
    setShowSuggestions(false);
  }

  return (
    <div className="relative w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="glass-strong glass-3d rounded-2xl flex items-center px-4 py-3 gap-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-sky-400/50 relative overflow-hidden">
          <svg
            className="w-5 h-5 text-white/50 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => query.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Search city... (e.g. Tokyo, London)"
            enterKeyHint="search"
            className="bg-transparent placeholder-white/40 outline-none flex-1 text-base dark:text-white text-slate-800"
          />
          <button
            type="submit"
            className="bg-sky-500/80 hover:bg-sky-400 text-white px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/25 active:scale-95"
          >
            Search
          </button>
        </div>
      </form>

      {showSuggestions && filtered.length > 0 && (
        <div className="absolute top-full mt-2 w-full glass glass-3d rounded-xl overflow-hidden z-50 relative">
          {filtered.map((city) => (
            <button
              key={city}
              onMouseDown={() => handleSelect(city)}
              className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors duration-150 text-sm flex items-center gap-2"
            >
              <svg
                className="w-4 h-4 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
