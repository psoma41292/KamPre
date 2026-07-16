/**
 * SerpAPI Service — Real Price Fetcher
 *
 * Uses the SerpAPI Google Shopping (India) engine to fetch live prices.
 * Each search returns results from multiple platforms (Amazon.in, Flipkart,
 * BigBasket, etc.) in a single API call.
 *
 * API docs: https://serpapi.com/google-shopping-api
 * Set SERPAPI_KEY in backend/.env to enable live data.
 * Without a key, the service returns null and priceService falls back to mock data.
 */

const { SerpApiSearch } = require("google-search-results-nodejs");

// Platform detection patterns — map seller/source names to our platformKey
const PLATFORM_PATTERNS = [
  { pattern: /amazon/i,    platformKey: "amazon",    platform: "Amazon",    icon: "📦", deliveryTime: "2–3 days" },
  { pattern: /flipkart/i,  platformKey: "flipkart",  platform: "Flipkart",  icon: "🛍️", deliveryTime: "1–2 days" },
  { pattern: /blinkit|grofers/i, platformKey: "blinkit", platform: "Blinkit", icon: "⚡", deliveryTime: "10 minutes" },
  { pattern: /bigbasket|big basket/i, platformKey: "bigbasket", platform: "BigBasket", icon: "🧺", deliveryTime: "Same day" },
  { pattern: /swiggy|instamart/i, platformKey: "instamart", platform: "Instamart", icon: "🛒", deliveryTime: "15 minutes" },
  { pattern: /dmart|d-mart/i, platformKey: "dmart", platform: "DMart", icon: "🏬", deliveryTime: "Store pickup / 2 hrs" },
];

/**
 * Detect platform from a seller/source string.
 * @param {string} source
 * @returns {{ platformKey, platform, deliveryTime } | null}
 */
function detectPlatform(source) {
  if (!source) return null;
  return PLATFORM_PATTERNS.find((p) => p.pattern.test(source)) || null;
}

/**
 * Parse a price string like "₹120", "Rs. 109", "1,299.00", "664.05" into a number.
 *
 * Indian price strings use commas as thousands separators ("1,299") but the
 * decimal point must be preserved ("664.05" → 664.05, NOT 66405).
 * Strategy: strip currency symbols and whitespace first, then remove only
 * commas that are thousands separators (i.e. not followed by exactly 2 digits
 * at the end), then parse as float and round to nearest rupee.
 *
 * @param {string|number} raw
 * @returns {number|null}
 */
function parsePrice(raw) {
  if (typeof raw === "number") return Math.round(raw);
  if (!raw) return null;

  let s = String(raw)
    .replace(/₹/g, "")          // strip rupee symbol
    .replace(/Rs\.?\s*/gi, "")   // strip "Rs." / "Rs "
    .replace(/\s/g, "")          // strip whitespace
    .trim();

  // Remove thousands-separator commas: a comma is a thousands separator when
  // it is followed by exactly 3 digits (and optionally more groups).
  // e.g. "1,299"   → "1299"
  //      "1,299.50" → "1299.50"   (decimal preserved)
  //      "664.05"  → "664.05"     (no commas, unchanged)
  s = s.replace(/,(\d{3})/g, "$1");

  const num = parseFloat(s);
  return isNaN(num) ? null : Math.round(num);
}

/**
 * Extract quantity in grams/mL from a product title or extracted snippet.
 * Returns { quantity: "1 kg", quantityGrams: 1000 }
 */
function extractQuantity(title) {
  if (!title) return { quantity: null, quantityGrams: null };

  // Match patterns like "5 kg", "500g", "1L", "500 ml", "200gm"
  const patterns = [
    { re: /(\d+(?:\.\d+)?)\s*kg/i,  multiplier: 1000,  unit: "kg"  },
    { re: /(\d+(?:\.\d+)?)\s*g(?:m|ms?)?\b/i, multiplier: 1, unit: "g" },
    { re: /(\d+(?:\.\d+)?)\s*l(?:itre|iter|tr)?\b/i, multiplier: 1000, unit: "L" },
    { re: /(\d+(?:\.\d+)?)\s*ml/i, multiplier: 1, unit: "ml" },
    { re: /(\d+)\s*pcs?(?:\.|,|\s|$)/i, multiplier: 60, unit: "pcs" }, // rough per-egg gram
  ];

  for (const { re, multiplier, unit } of patterns) {
    const m = title.match(re);
    if (m) {
      const val = parseFloat(m[1]);
      const grams = Math.round(val * multiplier);
      const quantity = `${val} ${unit}`;
      return { quantity, quantityGrams: grams };
    }
  }
  return { quantity: null, quantityGrams: null };
}

/**
 * Normalise a single SerpAPI shopping result into KamPare's product format.
 * Returns null if the result can't be mapped to a known platform.
 *
 * @param {Object} item  Raw SerpAPI shopping result
 * @param {string} query
 * @returns {Object|null}
 */
function normaliseResult(item, query) {
  // Try source / seller fields to detect platform
  const sourceStr = [item.source, item.seller, item.merchant].filter(Boolean).join(" ");
  const detected = detectPlatform(sourceStr);

  // If no platform detected, still include it with an "other" fallback
  const platformInfo = detected || {
    platformKey: "other",
    platform: item.source || "Other",
    deliveryTime: "Varies",
  };

  const price = parsePrice(item.price || item.extracted_price);
  if (!price) return null; // skip items with no parseable price

  const title = item.title || query;
  const { quantity, quantityGrams } = extractQuantity(title);

  // Build the direct product link
  const link = item.link || item.product_link || buildSearchLink(platformInfo.platformKey, query);

  return {
    platform:      platformInfo.platform,
    platformKey:   platformInfo.platformKey,
    productName:   title,
    brand:         extractBrand(title),
    price,
    originalPrice: parsePrice(item.original_price) || null,
    quantity:      quantity || "N/A",
    quantityGrams: quantityGrams || null,
    category:      "general",
    image:         item.thumbnail || null,
    link,
    inStock:       true,
    deliveryTime:  platformInfo.deliveryTime,
    rating:        item.rating || null,
    reviews:       item.reviews || null,
    dataSource:    "live",   // flag used by frontend to remove disclaimer
  };
}

/**
 * Attempt to extract a brand name from the product title.
 * Returns the first capitalised word segment if recognisable.
 */
function extractBrand(title) {
  if (!title) return "";
  // Common Indian grocery brands
  const brands = [
    "Tata Sampann", "Tata", "Amul", "Mother Dairy", "Nandini", "Patanjali",
    "India Gate", "Daawat", "Kohinoor", "Fortune", "Aashirvaad", "Pillsbury",
    "Rajdhani", "bb Royal", "24 Mantra", "Saffola", "MDH", "Everest",
    "Catch", "Kissan", "Heinz", "Maggi", "Parle", "MTR", "Shaktibhog",
    "Brooke Bond", "Nescafe", "Bru", "Gemini", "Dhara", "Uttam", "Madhur",
    "Amazon Fresh", "Freedom", "Licious",
  ];
  for (const brand of brands) {
    if (title.toLowerCase().includes(brand.toLowerCase())) return brand;
  }
  // Fallback: first word
  return title.split(" ")[0] || "";
}

/**
 * Build a fallback search link for a platform when no direct link is available.
 */
function buildSearchLink(platformKey, query) {
  const encoded = encodeURIComponent(query);
  const links = {
    amazon:     `https://www.amazon.in/s?k=${encoded}`,
    flipkart:   `https://www.flipkart.com/search?q=${encoded}`,
    blinkit:    `https://blinkit.com/s/?q=${encoded}`,
    bigbasket:  `https://www.bigbasket.com/ps/?q=${encoded}`,
    instamart:  `https://www.swiggy.com/instamart/search?query=${encoded}`,
    dmart:      `https://www.dmart.in/product-search#q=${encoded}&start=0`,
  };
  return links[platformKey] || `https://www.google.com/search?q=${encoded}+price+india`;
}

/**
 * Search Google Shopping India for a grocery query.
 * Returns an array of normalised product objects, or null on error.
 *
 * @param {string} query
 * @returns {Promise<Object[]|null>}
 */
async function searchLivePrices(query) {
  const apiKey = process.env.SERPAPI_KEY;
  if (!apiKey || apiKey === "your_serpapi_key_here") {
    return null; // no key configured — caller falls back to mock data
  }

  return new Promise((resolve) => {
    const client = new SerpApiSearch(apiKey);

    client.json(
      {
        engine: "google_shopping",
        q:      query + " grocery india",
        gl:     "in",   // country: India
        hl:     "en",   // language: English
        num:    20,     // fetch up to 20 results
      },
      (json) => {
        if (!json || json.error) {
          console.error("[SerpAPI] Error:", json?.error || "Unknown error");
          resolve(null);
          return;
        }

        const raw = json.shopping_results || json.inline_shopping_results || [];
        if (raw.length === 0) {
          resolve([]);
          return;
        }

        // Normalise all results, drop nulls
        const normalised = raw
          .map((item) => normaliseResult(item, query))
          .filter(Boolean);

        // De-duplicate: keep only the cheapest result per platformKey
        const byPlatform = new Map();
        for (const item of normalised) {
          const existing = byPlatform.get(item.platformKey);
          if (!existing || item.price < existing.price) {
            byPlatform.set(item.platformKey, item);
          }
        }

        resolve([...byPlatform.values()]);
      }
    );
  });
}

module.exports = { searchLivePrices, buildSearchLink };
