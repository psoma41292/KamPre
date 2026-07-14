/**
 * Platform colour + icon configuration.
 * Used to style platform badges consistently across the app.
 */

export const PLATFORMS = {
  amazon: {
    label: "Amazon",
    bg: "#ff9900",
    text: "#000000",
    icon: "📦",
    lightBg: "#fff8ee",
    border: "#ff9900",
  },
  flipkart: {
    label: "Flipkart",
    bg: "#2874f0",
    text: "#ffffff",
    icon: "🛍️",
    lightBg: "#eef3ff",
    border: "#2874f0",
  },
  blinkit: {
    label: "Blinkit",
    bg: "#f8d72b",
    text: "#1a1a1a",
    icon: "⚡",
    lightBg: "#fffde7",
    border: "#f8d72b",
  },
  bigbasket: {
    label: "BigBasket",
    bg: "#84c226",
    text: "#1a1a1a",
    icon: "🧺",
    lightBg: "#f1f9e8",
    border: "#84c226",
  },
  instamart: {
    label: "Instamart",
    bg: "#fc8019",
    text: "#ffffff",
    icon: "🛒",
    lightBg: "#fff3eb",
    border: "#fc8019",
  },
  dmart: {
    label: "DMart",
    bg: "#e31837",
    text: "#ffffff",
    icon: "🏬",
    lightBg: "#fff0f2",
    border: "#e31837",
  },
};

/**
 * Return the platform config (with fallback).
 * @param {string} key
 */
export function getPlatform(key) {
  return (
    PLATFORMS[key?.toLowerCase()] || {
      label: key || "Unknown",
      bg: "#6b7280",
      text: "#ffffff",
      icon: "🏪",
      lightBg: "#f3f4f6",
      border: "#6b7280",
    }
  );
}

/**
 * Format price as Indian currency string.
 * Always displays whole rupees (no paise). Uses Indian number grouping.
 * e.g. 1299 → "₹1,299"  |  664 → "₹664"
 * @param {number} price
 */
export function formatPrice(price) {
  if (price == null || isNaN(price)) return "₹--";
  const whole = Math.round(Number(price));
  return `₹${whole.toLocaleString("en-IN")}`;
}

/**
 * Format price per unit.
 * @param {number|null} ppu  Price per 100 g
 * @param {string} quantity  e.g. "1 kg"
 */
export function formatPricePerUnit(ppu, quantity) {
  if (ppu == null) return null;
  // Determine unit label
  const q = quantity?.toLowerCase() || "";
  if (q.includes("l") && !q.includes("kg")) return `₹${ppu}/100mL`;
  return `₹${ppu}/100g`;
}
