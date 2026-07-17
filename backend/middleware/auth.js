/**
 * JWT authentication middleware.
 * Attaches req.userId if a valid Bearer token is present.
 */

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "kampare-dev-secret-change-in-prod";

/**
 * requireAuth — hard gate. Returns 401 if token is missing/invalid.
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Authentication required." });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
}

module.exports = { requireAuth, JWT_SECRET };
