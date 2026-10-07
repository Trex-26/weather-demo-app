export default function FavoritesPanel({
  favorites = [],
  onSelectFavorite,
  onRemoveFavorite,
  isOpen,
  onClose,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-strong glass-3d rounded-3xl p-6 w-full max-w-md max-h-[80vh] flex flex-col relative overflow-hidden border border-white/20 shadow-2xl"
        role="dialog"
        aria-label="Favorite Locations"
        aria-modal="true"
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <h3 className="text-xl font-bold text-white">Saved Locations</h3>
          </div>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Close favorites panel"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto space-y-2 flex-1 pr-1">
          {favorites.length === 0 ? (
            <div className="text-center py-8 text-white/50 text-sm">
              <p className="text-3xl mb-2">📍</p>
              <p>No saved locations yet.</p>
              <p className="text-xs text-white/40 mt-1">
                Tap the star icon on any city card to save it here for fast access!
              </p>
            </div>
          ) : (
            favorites.map((fav) => (
              <div
                key={fav.id || fav.name}
                className="glass rounded-xl p-3 flex items-center justify-between group hover:bg-white/15 transition-all"
              >
                <button
                  type="button"
                  onClick={() => {
                    onSelectFavorite(fav);
                    onClose();
                  }}
                  className="flex-1 text-left flex flex-col"
                >
                  <span className="font-semibold text-white text-base group-hover:text-sky-300 transition-colors">
                    {fav.name}
                  </span>
                  {(fav.region || fav.country) && (
                    <span className="text-xs text-white/50">
                      {[fav.region, fav.country].filter(Boolean).join(', ')}
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveFavorite(fav);
                  }}
                  className="text-white/40 hover:text-red-400 p-2 rounded-lg hover:bg-white/10 transition-colors"
                  title="Remove from favorites"
                  aria-label={`Remove ${fav.name} from favorites`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
