/**
 * FavoritesPanel component
 * Slide-in sidebar that shows saved favorites and lets users search from them.
 */

import React, { useEffect, useState } from "react";
import { fetchFavorites, saveFavorite, deleteFavorite } from "../services/api";

export default function FavoritesPanel({ isOpen, onClose, onSearch, onRemove }) {
  const [favorites, setFavorites] = useState([]);
  const [loadingFavs, setLoadingFavs] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoadingFavs(true);
      fetchFavorites()
        .then(setFavorites)
        .catch(() => {})
        .finally(() => setLoadingFavs(false));
    }
  }, [isOpen]);

  const handleRemove = async (name) => {
    try {
      await deleteFavorite(name);
      setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== name.toLowerCase()));
      onRemove?.(name);
    } catch {
      // silently ignore
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white z-50 shadow-2xl transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">⭐ Saved Items</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close favorites panel"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto h-full pb-24 px-5 py-4">
          {loadingFavs ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-12 rounded-xl" />
              ))}
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-sm">No saved items yet.</p>
              <p className="text-xs mt-1">Search for an item and click the ⭐ to save it.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {favorites.map((fav) => (
                <li
                  key={fav.name}
                  className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 hover:bg-brand-greenLight transition-colors"
                >
                  <button
                    onClick={() => { onSearch(fav.name); onClose(); }}
                    className="flex-1 text-left text-sm font-medium text-gray-800 hover:text-brand-green capitalize"
                  >
                    🔍 {fav.name}
                  </button>
                  <button
                    onClick={() => handleRemove(fav.name)}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                    aria-label={`Remove ${fav.name} from favorites`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
