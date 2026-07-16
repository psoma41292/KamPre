/**
 * FilterBar component
 * Lets the user refine results by sort order, brand, or category.
 * Also shows a toggle to switch between card grid and table views.
 */

import React from "react";

const SORT_OPTIONS = [
  { value: "price",  label: "Lowest Price" },
  { value: "value",  label: "Best Value (per unit)" },
  { value: "rating", label: "Highest Rated" },
];

export default function FilterBar({ sort, onSort, view, onViewChange, resultCount, query }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
      {/* Results summary */}
      <div className="text-sm text-gray-600">
        {resultCount > 0 ? (
          <>
            <span className="font-semibold text-gray-900">{resultCount} results</span>
            {query && (
              <> for <span className="font-semibold text-brand-green">"{query}"</span></>
            )}
          </>
        ) : null}
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600 whitespace-nowrap">Sort by:</label>
          <select
            value={sort}
            onChange={(e) => onSort(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white text-gray-700 focus:outline-none focus:border-brand-green cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>

        {/* View toggle — grid / table */}
        <div className="flex border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => onViewChange("grid")}
            className={`px-3 py-1.5 text-sm transition-colors flex items-center gap-1
              ${view === "grid" ? "bg-brand-green text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            aria-label="Grid view"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Cards
          </button>
          <button
            onClick={() => onViewChange("table")}
            className={`px-3 py-1.5 text-sm transition-colors flex items-center gap-1
              ${view === "table" ? "bg-brand-green text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
            aria-label="Table view"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M3 14h18M10 3v18" />
            </svg>
            Table
          </button>
        </div>
      </div>
    </div>
  );
}
