/**
 * BestDealBanner
 * Eye-catching hero banner shown when comparison results are available.
 * Highlights the cheapest platform and best-value platform.
 */

import React from "react";
import { getPlatform, formatPrice } from "../utils/platformConfig";

export default function BestDealBanner({ bestDeal, bestValue, query, totalSavings }) {
  if (!bestDeal) return null;
  const platform = getPlatform(bestDeal.platformKey);
  const valuePlatform = bestValue ? getPlatform(bestValue.platformKey) : null;

  return (
    <div className="bg-gradient-to-r from-brand-green to-emerald-600 rounded-2xl p-5 text-white shadow-lg animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Left — Best Deal summary */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">🔥</span>
            <span className="text-sm font-medium opacity-90 uppercase tracking-wider">Best Deal for "{query}"</span>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="platform-badge text-sm px-3 py-1"
              style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }}
            >
              {platform.icon} {platform.label}
            </span>
            <span className="text-3xl font-extrabold">{formatPrice(bestDeal.price)}</span>
            <span className="text-sm opacity-75">{bestDeal.quantity}</span>
          </div>
          {bestDeal.deliveryTime && (
            <p className="text-xs opacity-75 mt-1">⏱ Delivery: {bestDeal.deliveryTime}</p>
          )}
          <p className="text-xs opacity-60 mt-1">* Indicative price — verify on platform</p>
        </div>

        {/* Right — Best Value (if different from best deal) */}
        {bestValue && bestValue.platform !== bestDeal.platform && (
          <div className="bg-white/15 rounded-xl p-3 min-w-max">
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">💎 Best Value (per 100g)</p>
            <div className="flex items-center gap-2">
              <span
                className="platform-badge"
                style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "#fff" }}
              >
                {valuePlatform.icon} {valuePlatform.label}
              </span>
              <span className="font-bold">₹{bestValue.pricePerUnit}/100g</span>
            </div>
          </div>
        )}

        {/* Savings badge */}
        {totalSavings > 0 && (
          <div className="bg-brand-orange text-white rounded-xl px-4 py-2 text-center shrink-0">
            <p className="text-xs font-medium opacity-90">You save up to</p>
            <p className="text-2xl font-extrabold">{formatPrice(totalSavings)}</p>
            <p className="text-xs opacity-75">vs highest price</p>
          </div>
        )}
      </div>
    </div>
  );
}
