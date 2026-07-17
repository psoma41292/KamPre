/**
 * ErrorState component
 * Shown when the API call fails or returns no results.
 */

import React from "react";

export default function ErrorState({ message, query, onRetry }) {
  const isNotFound = !message; // no message means 0 results

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
      <div className="text-6xl mb-4">{isNotFound ? "🔍" : "⚠️"}</div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {isNotFound
          ? `No results found for "${query}"`
          : "Something went wrong"}
      </h3>
      <p className="text-gray-500 max-w-sm mb-6">
        {isNotFound
          ? "Try searching for Rice, Toor Dal, Milk, Atta, Sugar, or Cooking Oil."
          : message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-brand-green hover:bg-brand-greenDark text-white font-semibold rounded-xl transition-colors"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
