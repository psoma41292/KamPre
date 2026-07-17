/**
 * API service layer.
 * All HTTP calls from the React app go through here.
 * The CRA proxy (in package.json) routes /api/* → http://localhost:5000.
 */

import axios from "axios";

const api = axios.create({ baseURL: "/api" });

// Attach JWT token from localStorage to every request when available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("kampare_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Fetch price comparisons for an item.
 * @param {string} item
 * @param {{ brand?: string, category?: string, sort?: string }} filters
 */
export async function fetchComparison(item, filters = {}) {
  const params = new URLSearchParams({ item });
  if (filters.brand)    params.append("brand", filters.brand);
  if (filters.category) params.append("category", filters.category);
  if (filters.sort)     params.append("sort", filters.sort);

  const { data } = await api.get(`/compare?${params.toString()}`);
  return data;
}

/**
 * Fetch autocomplete suggestions.
 * @param {string} q  partial search string (min 2 chars)
 */
export async function fetchSuggestions(q) {
  if (!q || q.trim().length < 2) return [];
  const { data } = await api.get(`/compare/suggestions?q=${encodeURIComponent(q)}`);
  return data.suggestions || [];
}

/**
 * Fetch all categories.
 */
export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data.categories || [];
}

/**
 * Fetch favorites list.
 */
export async function fetchFavorites() {
  const { data } = await api.get("/favorites");
  return data.favorites || [];
}

/**
 * Save a favorite item.
 * @param {{ name: string, category?: string }} item
 */
export async function saveFavorite(item) {
  const { data } = await api.post("/favorites", item);
  return data;
}

/**
 * Delete a favorite by name.
 * @param {string} name
 */
export async function deleteFavorite(name) {
  const { data } = await api.delete(`/favorites/${encodeURIComponent(name)}`);
  return data;
}

/**
 * Fetch the full grocery catalogue.
 * @param {{ category?: string }} filters
 */
export async function fetchGroceries(filters = {}) {
  const params = new URLSearchParams();
  if (filters.category) params.append("category", filters.category);
  const query = params.toString();
  const { data } = await api.get(`/groceries${query ? `?${query}` : ""}`);
  return data;
}
