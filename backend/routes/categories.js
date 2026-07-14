/**
 * /api/categories  —  returns all product categories
 */

const router = require("express").Router();

const CATEGORIES = [
  { slug: "pulses",      label: "Pulses & Dals",   icon: "🫘" },
  { slug: "rice-grains", label: "Rice & Grains",    icon: "🌾" },
  { slug: "dairy",       label: "Dairy & Eggs",     icon: "🥛" },
  { slug: "flour",       label: "Flour & Atta",     icon: "🌿" },
  { slug: "staples",     label: "Staples",          icon: "🧂" },
  { slug: "oils",        label: "Oils & Ghee",      icon: "🫙" },
  { slug: "spices",      label: "Spices & Masalas", icon: "🌶️" },
  { slug: "sauces",      label: "Sauces & Pastes",  icon: "🥫" },
  { slug: "snacks",      label: "Snacks",           icon: "🍿" },
  { slug: "beverages",   label: "Beverages",        icon: "☕" },
];

router.get("/", (_req, res) => {
  res.json({ categories: CATEGORIES });
});

module.exports = router;
