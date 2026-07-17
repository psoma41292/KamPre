/**
 * PriceChart component
 * Bar chart visualising prices across platforms using Recharts.
 * Renders only when results are available.
 */

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getPlatform } from "../utils/platformConfig";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3">
        <p className="font-bold text-gray-800 text-sm">{label}</p>
        <p className="text-brand-green font-semibold">₹{payload[0].value}</p>
        {payload[0].payload.quantity && (
          <p className="text-xs text-gray-500">{payload[0].payload.quantity}</p>
        )}
      </div>
    );
  }
  return null;
};

export default function PriceChart({ results, query }) {
  if (!results || results.length === 0) return null;

  const chartData = results.map((r) => ({
    name: getPlatform(r.platformKey).label,
    price: r.price,
    quantity: r.quantity,
    isBestDeal: r.isBestDeal,
    platformKey: r.platformKey,
  }));

  const minPrice = Math.min(...chartData.map((d) => d.price));

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        📊 Price Comparison Chart — <span className="text-brand-green capitalize">{query}</span>
      </h3>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 12, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${v}`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(22,163,74,0.06)" }} />
          <Bar dataKey="price" radius={[6, 6, 0, 0]} maxBarSize={60}>
            {chartData.map((entry) => (
              <Cell
                key={entry.name}
                fill={entry.price === minPrice ? "#16a34a" : "#d1fae5"}
                stroke={entry.price === minPrice ? "#14532d" : "#86efac"}
                strokeWidth={1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="text-xs text-gray-400 text-center mt-2">
        Green bar = lowest price. All prices in ₹ (INR).
      </p>
    </div>
  );
}
