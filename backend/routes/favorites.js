/**
 * /api/favorites  —  simple in-memory favorites store
 * (Replace with MongoDB persistence for production)
 *
 * GET    /api/favorites           — list all saved favorites
 * POST   /api/favorites           — add a favorite item { name, category }
 * DELETE /api/favorites/:name     — remove a favorite by name
 */

const router = require("express").Router();

// In-memory store (resets on server restart — swap for DB in production)
const favorites = new Map();

router.get("/", (_req, res) => {
  res.json({ favorites: Array.from(favorites.values()) });
});

router.post("/", (req, res) => {
  const { name, category } = req.body;
  if (!name || name.trim() === "") {
    return res.status(400).json({ error: '"name" is required.' });
  }
  const key = name.toLowerCase().trim();
  favorites.set(key, {
    name: name.trim(),
    category: category || "uncategorised",
    savedAt: new Date().toISOString(),
  });
  return res.status(201).json({ message: "Saved to favorites.", favorites: Array.from(favorites.values()) });
});

router.delete("/:name", (req, res) => {
  const key = decodeURIComponent(req.params.name).toLowerCase().trim();
  if (favorites.has(key)) {
    favorites.delete(key);
    return res.json({ message: "Removed from favorites." });
  }
  return res.status(404).json({ error: "Favorite not found." });
});

module.exports = router;
