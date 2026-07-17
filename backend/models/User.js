/**
 * User model — in-memory store with bcrypt-hashed passwords.
 * Swap `users` Map for a MongoDB collection when MONGODB_URI is set.
 *
 * Each user record:
 *  {
 *    id, email, name, passwordHash,
 *    connectedAccounts: { amazon?: {...}, blinkit?: {...}, ... },
 *    createdAt
 *  }
 */

const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

// ── In-memory store (resets on restart — intended for dev / demo) ────────────
const users = new Map(); // key: email (lower-cased)

const SALT_ROUNDS = 10;

/**
 * Create a new user.
 * @throws if email already taken
 */
async function createUser({ name, email, password }) {
  const key = email.toLowerCase().trim();
  if (users.has(key)) throw Object.assign(new Error("Email already registered."), { code: 409 });

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = {
    id: randomUUID(),
    name: name.trim(),
    email: key,
    passwordHash,
    connectedAccounts: {},
    createdAt: new Date().toISOString(),
  };
  users.set(key, user);
  return sanitize(user);
}

/**
 * Verify email + password and return the sanitized user.
 * @throws on bad credentials
 */
async function loginUser({ email, password }) {
  const key = email.toLowerCase().trim();
  const user = users.get(key);
  if (!user) throw Object.assign(new Error("Invalid email or password."), { code: 401 });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw Object.assign(new Error("Invalid email or password."), { code: 401 });

  return sanitize(user);
}

/**
 * Get a sanitized user by id.
 */
function getUserById(id) {
  for (const user of users.values()) {
    if (user.id === id) return sanitize(user);
  }
  return null;
}

/**
 * Update (or remove) a connected platform account for a user.
 * @param {string} id        user id
 * @param {string} platform  e.g. "amazon" | "blinkit"
 * @param {object|null} accountData  null to disconnect
 */
function setConnectedAccount(id, platform, accountData) {
  for (const user of users.values()) {
    if (user.id === id) {
      if (accountData === null) {
        delete user.connectedAccounts[platform];
      } else {
        user.connectedAccounts[platform] = {
          ...accountData,
          connectedAt: new Date().toISOString(),
        };
      }
      return sanitize(user);
    }
  }
  return null;
}

/** Strip passwordHash before sending to client */
function sanitize({ passwordHash: _ph, ...rest }) {
  return rest;
}

module.exports = { createUser, loginUser, getUserById, setConnectedAccount };
