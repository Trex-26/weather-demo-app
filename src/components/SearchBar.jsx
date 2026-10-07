import { useState, useEffect, useRef } from "react";
import { searchLocations } from "../services/weather/geocodingService";

export default function SearchBar({
  onSearch,
  onSelectLocation,
  suggestions = [],
  onUseLocation = null,
  isLocating = false,
  recentSearches = [],
}) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const debounceTimerRef = useRef(null);
  const abortControllerRef = useRef(null);
  const containerRef = useRef(null);

  // Debounced async geocoding search
  useEffect(() => {
    const clean = query.trim();

    if (clean.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    // Populate local matches immediately for zero-lag typing
    const localMatches = (suggestions || [])
      .filter((s) => (typeof s === 'string' ? s : s.name).toLowerCase().includes(clean.toLowerCase()))
      .map((s) => (typeof s === 'string' ? { name: s, displayName: s } : s));
    if (localMatches.length > 0) {
      setResults(localMatches);
      setIsOpen(true);
    }

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const locations = await searchLocations(clean, controller.signal);
        if (locations.length > 0) {
          setResults(locations);
          setIsOpen(true);
        }
      } catch (err) {
        if (err.code !== 'ABORTED' && localMatches.length > 0) {
          setResults(localMatches);
        }
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
    };
  }, [query, suggestions]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleFormSubmit(e) {
    e.preventDefault();
    if (selectedIndex >= 0 && results[selectedIndex]) {
      handleItemSelect(results[selectedIndex]);
      return;
    }

    if (query.trim()) {
      if (results.length > 0) {
        handleItemSelect(results[0]);
      } else {
        if (onSearch) onSearch(query.trim());
        setIsOpen(false);
      }
    }
  }

  function handleItemSelect(item) {
    setQuery(item.name || item.displayName || "");
    setIsOpen(false);
    setSelectedIndex(-1);

    if (onSelectLocation && (item.lat != null && item.lon != null)) {
      onSelectLocation(item);
    } else if (onSearch) {
      onSearch(item.name || item.displayName);
    }
  }

  function handleKeyDown(e) {
    if (!isOpen) {
      if (e.key === "ArrowDown") {
        setIsOpen(true);
      }
      return;
    }

    const totalItems = results.length;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSelectedIndex(-1);
    }
  }

  const showRecent = isOpen && query.trim().length === 0 && recentSearches.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full max-w-md mx-auto ${isOpen ? 'z-50' : 'z-20'}`}>
      <form onSubmit={handleFormSubmit} className="relative" role="search">
        <div className="glass-strong glass-3d rounded-2xl flex items-center px-4 py-3 gap-3 transition-all duration-300 focus-within:ring-2 focus-within:ring-sky-400/50 relative overflow-hidden">
          {/* Search Icon / Loading Spinner */}
          {isSearching ? (
            <svg
              className="w-5 h-5 text-sky-400 animate-spin shrink-0"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
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
          )}

          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search city or location..."
            enterKeyHint="search"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            className="bg-transparent placeholder-white/40 outline-none flex-1 text-base text-white"
          />

          {/* Location GPS Button */}
          {onUseLocation && (
            <button
              type="button"
              onClick={onUseLocation}
              disabled={isLocating}
              className="text-white/60 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-colors flex items-center justify-center shrink-0"
              title="Use my current location"
              aria-label="Use current GPS location"
            >
              {isLocating ? (
                <svg className="w-5 h-5 animate-spin text-sky-400" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 100-16 8 8 0 000 16zm0-11a3 3 0 100 6 3 3 0 000-6z" />
                </svg>
              )}
            </button>
          )}

          <button
            type="submit"
            className="bg-sky-500/80 hover:bg-sky-400 text-white px-4 py-1.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/25 active:scale-95 shrink-0"
          >
            Search
          </button>
        </div>
      </form>

      {/* Autocomplete / Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div
          role="listbox"
          className="absolute top-full mt-2 w-full search-dropdown rounded-2xl overflow-hidden shadow-2xl max-h-72 overflow-y-auto"
        >
          {results.map((item, idx) => (
            <button
              key={item.id || item.displayName || idx}
              type="button"
              role="option"
              aria-selected={selectedIndex === idx}
              onMouseDown={(e) => {
                e.preventDefault();
                handleItemSelect(item);
              }}
              className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors duration-150 border-b border-white/5 last:border-b-0 ${
                selectedIndex === idx ? 'bg-sky-500/30 text-white font-medium' : 'text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <svg
                className="w-4 h-4 text-sky-400 shrink-0"
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
              <div className="flex flex-col truncate">
                <span className="font-medium text-white truncate">{item.name}</span>
                {item.region || item.country ? (
                  <span className="text-xs text-white/50 truncate">
                    {[item.region, item.country].filter(Boolean).join(', ')}
                  </span>
                ) : null}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Recent Searches Dropdown when input is focused with no query */}
      {showRecent && (
        <div
          role="listbox"
          className="absolute top-full mt-2 w-full search-dropdown rounded-2xl overflow-hidden shadow-2xl"
        >
          <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white/40 border-b border-white/10">
            Recent Searches
          </div>
          {recentSearches.map((item, idx) => (
            <button
              key={item.name + idx}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                handleItemSelect(item);
              }}
              className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 text-white/80 hover:bg-white/10 hover:text-white transition-colors border-b border-white/5 last:border-b-0"
            >
              <svg className="w-4 h-4 text-white/30 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="truncate">{item.displayName || item.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
