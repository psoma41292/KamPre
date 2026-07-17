/**
 * /api/auth  —  User authentication routes
 *
 * POST /api/auth/register        — create account  { name, email, password }
 * POST /api/auth/login           — get JWT          { email, password }
 * GET  /api/auth/me              — get current user (protected)
 * POST /api/auth/connect/:platform   — link a platform account (protected)
 * DELETE /api/auth/connect/:platform — unlink a platform account (protected)
 */

const router = require("express").Router();
const jwt = require("jsonwebtoken");
const { createUser, loginUser, getUserById, setConnectedAccount } = require("../models/User");
const { requireAuth, JWT_SECRET } = require("../middleware/auth");

const TOKEN_EXPIRY = "7d";

/** Issue a signed JWT for a user id */
function signToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
}

// ── POST /api/auth/register ─────────────────────────────────────────────────

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: "name, email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters." });
  }
  try {
    const user = await createUser({ name, email, password });
    const token = signToken(user.id);
    return res.status(201).json({ user, token });
  } catch (err) {
    return res.status(err.code || 500).json({ error: err.message });
  }
});

// ── POST /api/auth/login ────────────────────────────────────────────────────

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "email and password are required." });
  }
  try {
    const user = await loginUser({ email, password });
    const token = signToken(user.id);
    return res.json({ user, token });
  } catch (err) {
    return res.status(err.code || 500).json({ error: err.message });
  }
});

// ── GET /api/auth/me ────────────────────────────────────────────────────────

router.get("/me", requireAuth, (req, res) => {
  const user = getUserById(req.userId);
  if (!user) return res.status(404).json({ error: "User not found." });
  return res.json({ user });
});

// ── POST /api/auth/connect/:platform ───────────────────────────────────────

const SUPPORTED_PLATFORMS = ["amazon", "blinkit", "bigbasket", "flipkart", "instamart", "dmart"];

router.post("/connect/:platform", requireAuth, (req, res) => {
  const { platform } = req.params;
  if (!SUPPORTED_PLATFORMS.includes(platform)) {
    return res.status(400).json({ error: `Unsupported platform: ${platform}` });
  }
  // accountData can carry display name / email the user entered (no real OAuth — simulated link)
  const { displayName, accountEmail } = req.body || {};
  const user = setConnectedAccount(req.userId, platform, {
    displayName: displayName || accountEmail || "My Account",
    accountEmail: accountEmail || null,
  });
  if (!user) return res.status(404).json({ error: "User not found." });
  return res.json({ user, message: `${platform} account connected.` });
});

// ── DELETE /api/auth/connect/:platform ─────────────────────────────────────

router.delete("/connect/:platform", requireAuth, (req, res) => {
  const { platform } = req.params;
  const user = setConnectedAccount(req.userId, platform, null);
  if (!user) return res.status(404).json({ error: "User not found." });
  return res.json({ user, message: `${platform} account disconnected.` });
});

module.exports = router;
