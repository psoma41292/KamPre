/**
 * ProductCard component
 * Displays one platform's price result as a card.
 * Shows: image, platform badge, product name, price, discount, rating,
 *        delivery time, price-per-unit, and a CTA link.
 * Best-deal and best-value cards get special visual treatment.
 */

import React, { useState } from "react";
import { getPlatform, formatPrice, formatPricePerUnit } from "../utils/platformConfig";

export default function ProductCard({ product, rank }) {
  const isLive = product.dataSource === "live";
  const [imgError, setImgError] = useState(false);
  const platform = getPlatform(product.platformKey);

  const isBest = product.isBestDeal;
  const isValue = product.isBestValue;

  return (
    <div
      className={`
        relative bg-white rounded-2xl overflow-hidden card-hover
        border-2 transition-all
        ${isBest
          ? "border-brand-green best-deal-glow"
          : "border-gray-100 hover:border-gray-200"
        }
      `}
    >
      {/* ── Best Deal ribbon ── */}
      {isBest && (
        <div className="absolute top-0 left-0 right-0 bg-brand-green text-white text-xs font-bold py-1 text-center tracking-wide z-10">
          🔥 BEST DEAL
        </div>
      )}

      {/* ── Rank badge ── */}
      {!isBest && rank && (
        <div className="absolute top-3 left-3 w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 z-10">
          {rank}
        </div>
      )}

      {/* ── Best Value tag ── */}
      {isValue && !isBest && (
        <div className="absolute top-0 left-0 right-0 bg-brand-orange text-white text-xs font-bold py-1 text-center tracking-wide z-10">
          💎 BEST VALUE
        </div>
      )}

      <div className={isBest || (isValue && !isBest) ? "pt-7" : "pt-2"}>
        {/* ── Product image ── */}
        <div className="h-36 flex items-center justify-center bg-gray-50 mx-3 mt-1 rounded-xl overflow-hidden">
          {!imgError ? (
            <img
              src={product.image}
              alt={product.productName}
              className="h-full w-full object-contain p-2"
              onError={() => setImgError(true)}
              loading="lazy"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="text-5xl select-none">{platform.icon}</div>
          )}
        </div>

        <div className="p-4">
          {/* ── Platform badge ── */}
          <div className="flex items-center gap-2 mb-2">
            <span
              className="platform-badge"
              style={{ backgroundColor: platform.bg, color: platform.text }}
            >
              {platform.icon} {platform.label}
            </span>
            {!product.inStock && (
              <span className="platform-badge bg-red-100 text-red-700">Out of Stock</span>
            )}
          </div>

          {/* ── Product name ── */}
          <h3 className="text-sm font-semibold text-gray-800 leading-snug line-clamp-2 mb-2 min-h-[2.5rem]">
            {product.productName}
          </h3>

          {/* ── Brand + Quantity pill ── */}
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-xs text-gray-500">{product.brand}</span>
            {product.quantity && product.quantity !== "N/A" && (
              <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                📦 {product.quantity}
              </span>
            )}
          </div>

          {/* ── Pricing section ── */}
          <div className="flex items-end justify-between mb-1">
            <div>
              <span className={`text-2xl font-extrabold ${isBest ? "text-brand-green" : "text-gray-800"}`}>
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="ml-2 text-sm text-gray-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            {product.discount && (
              <span className="text-xs font-bold text-brand-orange bg-brand-orangeLight px-2 py-0.5 rounded-full">
                -{product.discount}%
              </span>
            )}
          </div>

          {/* ── Normalised price per unit (fair comparison basis) ── */}
          {product.pricePerUnit ? (
            <div className={`flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg text-xs font-semibold
              ${isValue ? "bg-orange-50 border border-orange-200 text-orange-700" : "bg-gray-50 text-gray-500"}`}>
              {isValue && <span>💎</span>}
              <span>{formatPricePerUnit(product.pricePerUnit, product.quantity)}</span>
              {isValue && <span className="font-bold text-orange-600">· Best value/unit</span>}
            </div>
          ) : null}

          {/* ── Sample price disclaimer (hidden when live data) ── */}
          {!isLive && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-2 py-0.5 mb-2 leading-snug">
              ⚠ Sample price — verify on platform before buying
            </p>
          )}

          {/* ── Meta row: delivery + rating ── */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {product.deliveryTime}
            </span>
            {product.rating && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {product.rating} ({product.reviews?.toLocaleString("en-IN")})
              </span>
            )}
          </div>

          {/* ── Action Button — "Buy now" if live data, "Search" if mock ── */}
          <a
            href={product.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center py-2.5 rounded-xl text-sm font-bold transition-all
              active:scale-95 text-white shadow-sm"
            style={{ backgroundColor: platform.bg, color: platform.text }}
            aria-label={`${isLive ? "Buy" : "Search for"} ${product.productName} on ${platform.label}`}
          >
            {isLive ? `🛒 Buy on ${platform.label} →` : `🔍 Search on ${platform.label} →`}
          </a>
        </div>
      </div>
    </div>
  );
}
