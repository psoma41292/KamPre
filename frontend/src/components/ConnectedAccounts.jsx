/**
 * ConnectedAccounts — slide-over panel that lets a logged-in user
 * link or unlink their accounts on external platforms (Blinkit, Amazon, etc.).
 *
 * Each platform entry shows:
 *  - Platform name + icon
 *  - Connected status (with account label) or "Connect" button
 *  - A "Visit" link that opens the platform in a new tab
 */

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const PLATFORMS = [
  {
    id: "amazon",
    label: "Amazon",
    icon: "📦",
    color: "#ff9900",
    bg: "#fff8ee",
    url: "https://www.amazon.in",
    hint: "Shop groceries on Amazon Fresh",
  },
  {
    id: "blinkit",
    label: "Blinkit",
    icon: "⚡",
    color: "#f8d72b",
    bg: "#fffde7",
    url: "https://blinkit.com",
    hint: "10-minute grocery delivery",
  },
  {
    id: "bigbasket",
    label: "BigBasket",
    icon: "🧺",
    color: "#84c226",
    bg: "#f1f9e8",
    url: "https://www.bigbasket.com",
    hint: "India's largest online grocery",
  },
  {
    id: "flipkart",
    label: "Flipkart",
    icon: "🛍️",
    color: "#2874f0",
    bg: "#eef3ff",
    url: "https://www.flipkart.com",
    hint: "Groceries & supermart",
  },
  {
    id: "instamart",
    label: "Instamart",
    icon: "🛒",
    color: "#fc8019",
    bg: "#fff3eb",
    url: "https://www.swiggy.com/instamart",
    hint: "Swiggy Instamart delivery",
  },
  {
    id: "dmart",
    label: "DMart",
    icon: "🏬",
    color: "#e31837",
    bg: "#fff0f2",
    url: "https://www.dmart.in",
    hint: "DMart Ready online",
  },
];

export default function ConnectedAccounts({ isOpen, onClose }) {
  const { user, connectPlatform, disconnectPlatform } = useAuth();
  const [connectingId, setConnectingId] = useState(null);
  const [formState, setFormState]       = useState({}); // { [platformId]: { email } }
  const [showForm, setShowForm]         = useState(null); // platformId currently showing form

  if (!isOpen || !user) return null;

  const handleConnect = async (platformId) => {
    const accountEmail = formState[platformId]?.email || "";
    setConnectingId(platformId);
    try {
      await connectPlatform(platformId, { accountEmail, displayName: accountEmail || "My Account" });
      setShowForm(null);
    } finally {
      setConnectingId(null);
    }
  };

  const handleDisconnect = async (platformId) => {
    setConnectingId(platformId);
    try {
      await disconnectPlatform(platformId);
    } finally {
      setConnectingId(null);
    }
  };

  const connectedPlatforms = Object.keys(user.connectedAccounts || {});

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-green to-emerald-600 px-6 pt-5 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-extrabold text-white">Connected Accounts</h2>
              <p className="text-green-100 text-xs mt-0.5">
                Link your platform accounts to jump straight to your cart
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors text-xl leading-none"
              aria-label="Close"
            >✕</button>
          </div>

          {/* Summary badge */}
          {connectedPlatforms.length > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-green-300 inline-block" />
              {connectedPlatforms.length} platform{connectedPlatforms.length > 1 ? "s" : ""} connected
            </div>
          )}
        </div>

        {/* Platform list */}
        <div className="overflow-y-auto flex-1 px-4 py-4 space-y-3">
          {PLATFORMS.map((p) => {
            const acct    = user.connectedAccounts?.[p.id];
            const isLinked = !!acct;
            const isBusy   = connectingId === p.id;
            const formOpen = showForm === p.id;

            return (
              <div
                key={p.id}
                className="border border-gray-100 rounded-xl p-4"
                style={{ background: isLinked ? p.bg : "#fafafa" }}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Platform info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: p.bg, border: `1.5px solid ${p.color}` }}
                    >
                      {p.icon}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-gray-800">{p.label}</div>
                      {isLinked ? (
                        <div className="text-xs text-gray-500 truncate">
                          {acct.displayName || acct.accountEmail || "Connected"}
                        </div>
                      ) : (
                        <div className="text-xs text-gray-400">{p.hint}</div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Visit link always visible */}
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-gray-400 hover:text-brand-green transition-colors font-medium"
                    >
                      Visit ↗
                    </a>

                    {isLinked ? (
                      <button
                        onClick={() => handleDisconnect(p.id)}
                        disabled={isBusy}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
                      >
                        {isBusy ? "…" : "Unlink"}
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowForm(formOpen ? null : p.id)}
                        disabled={isBusy}
                        className="text-xs font-semibold text-brand-green hover:text-emerald-700 disabled:opacity-50 transition-colors px-2 py-1 rounded-lg hover:bg-brand-greenLight"
                      >
                        {formOpen ? "Cancel" : "Connect"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline connect form */}
                {!isLinked && formOpen && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="email"
                      placeholder={`Your ${p.label} email (optional)`}
                      value={formState[p.id]?.email || ""}
                      onChange={(e) =>
                        setFormState((prev) => ({ ...prev, [p.id]: { email: e.target.value } }))
                      }
                      className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-brand-green"
                    />
                    <button
                      onClick={() => handleConnect(p.id)}
                      disabled={isBusy}
                      className="bg-brand-green text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                    >
                      {isBusy ? "…" : "Link"}
                    </button>
                  </div>
                )}

                {/* Connected timestamp */}
                {isLinked && acct.connectedAt && (
                  <div className="mt-1.5 text-xs text-gray-400">
                    Linked {new Date(acct.connectedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="px-6 py-3 border-t border-gray-100 text-center flex-shrink-0">
          <p className="text-xs text-gray-400">
            Linking an account lets KamPare open your chosen platform's search page. No passwords are shared.
          </p>
        </div>
      </div>
    </div>
  );
}
