/**
 * LoadingState component
 * Skeleton card grid shown while the API call is in flight.
 */

import React from "react";

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="h-36 skeleton mx-3 mt-3 rounded-xl" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-5 w-24 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-8 w-1/2 rounded" />
        <div className="skeleton h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}

export default function LoadingState() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Banner skeleton */}
      <div className="skeleton h-24 w-full rounded-2xl" />

      {/* Card grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>

      {/* Loading message */}
      <p className="text-center text-gray-500 text-sm animate-pulse-slow">
        Fetching prices from 5 platforms…
      </p>
    </div>
  );
}
