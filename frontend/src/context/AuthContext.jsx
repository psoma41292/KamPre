/**
 * AuthContext — global authentication state.
 *
 * Persists the JWT token in localStorage so the session survives page refresh.
 * Exposes: user, token, login(), register(), logout(), updateUser()
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import axios from "axios";

const AuthContext = createContext(null);

const api = axios.create({ baseURL: "/api" });

export function AuthProvider({ children }) {
  const [token, setToken]   = useState(() => localStorage.getItem("kampare_token"));
  const [user,  setUser]    = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem("kampare_token")); // hydrate on mount

  // ── Attach token to every request ────────────────────────────────────────
  useEffect(() => {
    const id = api.interceptors.request.use((config) => {
      if (token) config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
    return () => api.interceptors.request.eject(id);
  }, [token]);

  // ── Hydrate user from stored token on first load ──────────────────────────
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        // Token expired or invalid — clear it
        localStorage.removeItem("kampare_token");
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Persist token changes to localStorage ────────────────────────────────
  useEffect(() => {
    if (token) localStorage.setItem("kampare_token", token);
    else        localStorage.removeItem("kampare_token");
  }, [token]);

  // ── Auth actions ─────────────────────────────────────────────────────────

  const login = useCallback(async ({ email, password }) => {
    const { data } = await api.post("/auth/login", { email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    const { data } = await api.post("/auth/register", { name, email, password });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  /** Called after connect/disconnect platform to sync updated user */
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
  }, []);

  const connectPlatform = useCallback(async (platform, accountData = {}) => {
    const { data } = await api.post(`/auth/connect/${platform}`, accountData);
    setUser(data.user);
    return data.user;
  }, []);

  const disconnectPlatform = useCallback(async (platform) => {
    const { data } = await api.delete(`/auth/connect/${platform}`);
    setUser(data.user);
    return data.user;
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      isLoggedIn: !!user,
      login,
      register,
      logout,
      updateUser,
      connectPlatform,
      disconnectPlatform,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
