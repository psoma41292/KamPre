/**
 * /api/compare  —  main price comparison endpoint
 *
 * GET /api/compare?item=toor+dal
 *   Query params:
 *     item     {string}  (required) search term
 *     brand    {string}  (optional) filter by brand name (case-insensitive)
 *     category {string}  (optional) filter by category slug
 *     sort     {string}  (optional) "price"|"value"|"rating" — default "price"
 */

const router = require("express").Router();
const { compareProducts } = require("../services/priceService");
const { getAllKeywords } = require("../data/mockProducts");

// GET /api/compare?item=toor+dal
router.get("/", async (req, res) => {
  const { item, brand, category, sort } = req.query;

  if (!item || item.trim() === "") {
    return res.status(400).json({ error: 'Query parameter "item" is required.' });
  }

  try {
    let data = await compareProducts(item.trim());

    // ── Optional filters ──────────────────────────────────────────────
    if (brand) {
      const b = brand.toLowerCase();
      data = {
        ...data,
        results: data.results.filter((r) => r.brand.toLowerCase().includes(b)),
      };
    }

    if (category) {
      const c = category.toLowerCase();
      data = {
        ...data,
        results: data.results.filter((r) => r.category.toLowerCase() === c),
      };
    }

    // ── Optional sorting ──────────────────────────────────────────────
    if (sort === "value" && data.results.length) {
      data.results.sort((a, b) => (a.pricePerUnit ?? Infinity) - (b.pricePerUnit ?? Infinity));
    } else if (sort === "rating" && data.results.length) {
      data.results.sort((a, b) => b.rating - a.rating);
    }

    return res.json(data);
  } catch (err) {
    console.error("[compare] Error:", err.message);
    return res.status(500).json({ error: "Failed to fetch comparison data." });
  }
});

// GET /api/compare/suggestions?q=tor
// Returns autocomplete keyword suggestions
router.get("/suggestions", (req, res) => {
  const { q } = req.query;
  if (!q || q.trim().length < 2) {
    return res.json({ suggestions: [] });
  }

  const lower = q.toLowerCase().trim();
  const all = getAllKeywords();
  const suggestions = all
    .filter((kw) => kw.includes(lower))
    .slice(0, 8);

  return res.json({ suggestions });
});

module.exports = router;
