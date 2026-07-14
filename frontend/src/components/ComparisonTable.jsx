/**
 * ComparisonTable component
 * Shows results in a compact, sortable table alongside the card grid.
 * When multiple quantity tiers exist, renders one sub-table per tier.
 */

import React, { useState } from "react";
import { getPlatform, formatPrice, formatPricePerUnit } from "../utils/platformConfig";

function TierTable({ items, defaultSortKey = "price" }) {
  const [sortKey, setSortKey] = useState(defaultSortKey);
  const [sortDir, setSortDir] = useState("asc");

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sorted = [...items].sort((a, b) => {
    const valA = a[sortKey] ?? Infinity;
    const valB = b[sortKey] ?? Infinity;
    return sortDir === "asc" ? valA - valB : valB - valA;
  });

  const SortIcon = ({ col }) => (
    <span className="ml-1 text-gray-400 text-xs">
      {sortKey === col ? (sortDir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Platform</th>
            <th className="px-4 py-3 text-left font-semibold text-gray-600">Product</th>
            <th
              className="px-4 py-3 text-right font-semibold text-gray-600 cursor-pointer hover:text-brand-green select-none"
              onClick={() => toggleSort("price")}
            >
              Price <SortIcon col="price" />
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-600">Qty</th>
            <th
              className="px-4 py-3 text-right font-semibold text-gray-600 cursor-pointer hover:text-brand-green select-none"
              onClick={() => toggleSort("pricePerUnit")}
            >
              Per 100g <SortIcon col="pricePerUnit" />
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-600">Delivery</th>
            <th className="px-4 py-3 text-center font-semibold text-gray-600">Buy</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {sorted.map((product, idx) => {
            const platform = getPlatform(product.platformKey);
            return (
              <tr
                key={`${product.platform}-${idx}`}
                className={`transition-colors ${
                  product.isBestDeal ? "bg-brand-greenLight" : "hover:bg-gray-50"
                }`}
              >
                {/* Platform */}
                <td className="px-4 py-3">
                  <span
                    className="platform-badge"
                    style={{ backgroundColor: platform.bg, color: platform.text }}
                  >
                    {platform.icon} {platform.label}
                  </span>
                  {product.isBestDeal && (
                    <span className="ml-1 text-xs font-bold text-brand-green">🔥 Best</span>
                  )}
                </td>

                {/* Product name */}
                <td className="px-4 py-3 text-gray-700 max-w-xs">
                  <span className="line-clamp-1">{product.productName}</span>
                  <span className="block text-xs text-gray-400">{product.brand}</span>
                </td>

                {/* Price */}
                <td className="px-4 py-3 text-right">
                  <span className={`font-bold ${product.isBestDeal ? "text-brand-green" : "text-gray-800"}`}>
                    {formatPrice(product.price)}
                  </span>
                  {product.discount && (
                    <span className="block text-xs text-brand-orange">-{product.discount}%</span>
                  )}
                  {product.dataSource !== "live" && (
                    <span className="block text-xs text-amber-600 mt-0.5">⚠ Sample</span>
                  )}
                </td>

                {/* Quantity — highlighted pill */}
                <td className="px-4 py-3 text-center">
                  {product.quantity && product.quantity !== "N/A" ? (
                    <span className="inline-flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
                      📦 {product.quantity}
                    </span>
                  ) : "—"}
                </td>

                {/* Price per unit — highlighted when best value */}
                <td className={`px-4 py-3 text-right text-xs font-semibold
                  ${product.isBestValue ? "text-orange-600 bg-orange-50" : "text-gray-500"}`}>
                  {product.pricePerUnit ? (
                    <>
                      {product.isBestValue && <span className="mr-1">💎</span>}
                      {formatPricePerUnit(product.pricePerUnit, product.quantity)}
                    </>
                  ) : "—"}
                </td>

                {/* Delivery */}
                <td className="px-4 py-3 text-center text-gray-500">{product.deliveryTime}</td>

                {/* Buy / Search button */}
                <td className="px-4 py-3 text-center">
                  <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-sm"
                    style={{ backgroundColor: platform.bg, color: platform.text }}
                  >
                    {product.dataSource === "live" ? "🛒 Buy →" : "🔍 Search →"}
                  </a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function ComparisonTable({ results, quantityGroups = [] }) {
  // If multiple size tiers, render one sub-table per tier
  if (quantityGroups.length > 1) {
    return (
      <div className="space-y-6">
        {quantityGroups.map((group) => (
          <div key={group.quantityGrams}>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                📦 {group.quantityLabel}
              </span>
              <span className="text-xs text-gray-500">
                {group.results.length} platform{group.results.length !== 1 ? "s" : ""} available
              </span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>
            <TierTable items={group.results} />
          </div>
        ))}
      </div>
    );
  }

  // Single tier — flat table
  return <TierTable items={results} />;
}
