/**
 * Price Service
 * Core business logic: fetches prices (live via SerpAPI or mock fallback),
 * groups by quantity tier, marks best deal / best value, caches results.
 *
 * Data source precedence:
 *  1. SerpAPI live results   — when SERPAPI_KEY is set in .env
 *  2. Mock product database  — automatic fallback (no config needed)
 */

const NodeCache = require("node-cache");
const { findProducts } = require("../data/mockProducts");
const { searchLivePrices } = require("./serpApiService");

// In-memory cache — TTL defaults to 5 minutes (300 s)
const cache = new NodeCache({ stdTTL: parseInt(process.env.CACHE_TTL) || 300 });

// ── Helpers ──────────────────────────────────────────────────────────────────

function pricePerUnit(price, quantityGrams) {
  if (!quantityGrams || quantityGrams === 0) return null;
  return Math.round((price / quantityGrams) * 100 * 100) / 100; // ₹ per 100 g
}

function discountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

/**
 * Enrich a raw product object with computed fields.
 */
function enrich(product) {
  return {
    ...product,
    pricePerUnit: pricePerUnit(product.price, product.quantityGrams),
    discount: discountPercent(product.price, product.originalPrice),
    fetchedAt: new Date().toISOString(),
  };
}

/**
 * Simulate async fetch for mock data (tiny random delay for realism).
 */
async function enrichMock(product) {
  const delay = 30 + Math.random() * 80;
  await new Promise((r) => setTimeout(r, delay));
  return enrich(product);
}

// ── Quantity grouping ────────────────────────────────────────────────────────

function groupByQuantity(products) {
  const map = new Map();
  for (const p of products) {
    const key = p.quantityGrams ?? 0;
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(p);
  }

  const tiers = [...map.entries()].sort(([a], [b]) => a - b);

  return tiers.map(([grams, items]) => {
    const sorted = [...items].sort((a, b) => a.price - b.price);

    const lowestPrice = sorted[0].price;
    sorted.forEach((r) => { r.isBestDeal = r.price === lowestPrice; });

    const withUnit = sorted.filter((r) => r.pricePerUnit !== null);
    if (withUnit.length > 0) {
      const lowestUnit = Math.min(...withUnit.map((r) => r.pricePerUnit));
      sorted.forEach((r) => { r.isBestValue = r.pricePerUnit === lowestUnit; });
    }

    const quantityLabel = sorted[0]?.quantity ?? `${grams}g`;

    return {
      quantityLabel,
      quantityGrams: grams,
      results: sorted,
      bestDeal: sorted[0],
      bestValue: withUnit.length > 0
        ? [...withUnit].sort((a, b) => a.pricePerUnit - b.pricePerUnit)[0]
        : null,
    };
  });
}

// ── Main comparison function ──────────────────────────────────────────────────

/**
 * Compare prices for a query.
 * Tries live SerpAPI first; falls back to mock data if key is absent or call fails.
 *
 * @param {string} query
 * @returns {Promise<Object>}
 */
async function compareProducts(query) {
  const cacheKey = query.toLowerCase().trim();

  const cached = cache.get(cacheKey);
  if (cached) return { ...cached, fromCache: true };

  const isLiveMode = !!(process.env.SERPAPI_KEY && process.env.SERPAPI_KEY !== "your_serpapi_key_here");

  // ── Attempt live data ────────────────────────────────────────────────────
  let results = [];
  let dataSource = "mock";

  if (isLiveMode) {
    try {
      const liveRaw = await searchLivePrices(query);
      if (liveRaw && liveRaw.length > 0) {
        results = liveRaw.map(enrich);
        dataSource = "live";
      } else {
        console.warn(`[priceService] SerpAPI returned 0 results for "${query}", falling back to mock`);
      }
    } catch (err) {
      console.error("[priceService] SerpAPI error, falling back to mock:", err.message);
    }
  }

  // ── Fallback to mock data ────────────────────────────────────────────────
  if (results.length === 0) {
    const rawMock = findProducts(query);
    if (rawMock.length === 0) {
      return {
        query, results: [], quantityGroups: [],
        bestDeal: null, bestValue: null,
        totalPlatforms: 0, availablePlatforms: 0,
        dataSource: "mock", fromCache: false,
      };
    }
    const settled = await Promise.allSettled(rawMock.map(enrichMock));
    settled.forEach((o) => { if (o.status === "fulfilled") results.push(o.value); });
    dataSource = "mock";
  }

  if (results.length === 0) {
    return {
      query, results: [], quantityGroups: [],
      bestDeal: null, bestValue: null,
      totalPlatforms: 0, availablePlatforms: 0,
      dataSource, fromCache: false,
    };
  }

  // ── Quantity-grouped view ────────────────────────────────────────────────
  const quantityGroups = groupByQuantity(results);

  // ── Flat sorted list (for chart / table) ────────────────────────────────
  results.sort((a, b) => a.price - b.price);

  // Global best deal / best value
  const lowestPrice = results[0].price;
  results.forEach((r) => { r.isBestDeal = r.price === lowestPrice; });

  const withUnit = results.filter((r) => r.pricePerUnit !== null);
  if (withUnit.length > 0) {
    withUnit.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    const lowestUnit = withUnit[0].pricePerUnit;
    results.forEach((r) => { r.isBestValue = r.pricePerUnit === lowestUnit; });
  }

  const response = {
    query,
    results,
    quantityGroups,
    bestDeal: results[0],
    bestValue: withUnit.length > 0 ? withUnit[0] : null,
    totalPlatforms: results.length,
    availablePlatforms: results.length,
    dataSource,       // "live" | "mock" — used by frontend to show/hide disclaimer
    fromCache: false,
  };

  cache.set(cacheKey, response);
  return response;
}

module.exports = { compareProducts };
