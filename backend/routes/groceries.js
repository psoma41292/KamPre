/**
 * /api/groceries  —  returns the complete searchable grocery catalogue
 *
 * GET /api/groceries
 *   Returns every product group with its keywords, category, and
 *   which platforms carry it.
 *
 * GET /api/groceries?category=pulses
 *   Filter by category slug.
 */

const router = require("express").Router();
const { getAllProducts } = require("../data/mockProducts");

router.get("/", (req, res) => {
  const { category } = req.query;
  let list = getAllProducts();

  if (category) {
    const c = category.toLowerCase();
    list = list.filter((item) => item.category === c);
  }

  return res.json({
    total: list.length,
    groceries: list,
  });
});

module.exports = router;
