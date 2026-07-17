/**
 * LoginModal — handles Sign In and Sign Up in one modal.
 * Uses AuthContext for all auth operations.
 */

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginModal({ isOpen, onClose }) {
  const { login, register } = useAuth();
  const [tab, setTab]           = useState("login"); // "login" | "register"
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const reset = () => {
    setName(""); setEmail(""); setPassword(""); setError(null);
  };

  const switchTab = (t) => { reset(); setTab(t); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (tab === "login") {
        await login({ email, password });
      } else {
        await register({ name, email, password });
      }
      reset();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.error || err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-green to-emerald-600 px-6 pt-6 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-white">
                {tab === "login" ? "Welcome back" : "Create account"}
              </h2>
              <p className="text-green-100 text-sm mt-0.5">
                {tab === "login" ? "Sign in to KamPare" : "Join KamPare for free"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors text-xl leading-none"
              aria-label="Close"
            >✕</button>
          </div>

          {/* Tabs */}
          <div className="flex mt-4 gap-1 bg-white/15 rounded-xl p-1">
            {["login", "register"].map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`flex-1 text-sm font-semibold py-1.5 rounded-lg transition-colors ${
                  tab === t ? "bg-white text-brand-green" : "text-white hover:bg-white/10"
                }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {tab === "register" && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder={tab === "register" ? "Min. 6 characters" : "Your password"}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-green hover:bg-emerald-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            {submitting
              ? (tab === "login" ? "Signing in…" : "Creating account…")
              : (tab === "login" ? "Sign In" : "Create Account")}
          </button>

          <p className="text-center text-xs text-gray-400">
            {tab === "login" ? "No account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => switchTab(tab === "login" ? "register" : "login")}
              className="text-brand-green font-semibold hover:underline"
            >
              {tab === "login" ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
