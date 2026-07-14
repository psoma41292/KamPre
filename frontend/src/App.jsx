/**
 * App.jsx — KamPare root component
 *
 * Orchestrates:
 *  - Header with branding and favorites trigger
 *  - Hero section with search bar
 *  - Results area: BestDealBanner → FilterBar → ProductCard grid (or table)
 *  - PriceChart
 *  - FavoritesPanel slide-over
 *  - Footer
 */

import React, { useState, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import ProductCard from "./components/ProductCard";
import ComparisonTable from "./components/ComparisonTable";
import BestDealBanner from "./components/BestDealBanner";
import FilterBar from "./components/FilterBar";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import PriceChart from "./components/PriceChart";
import FavoritesPanel from "./components/FavoritesPanel";
import { fetchComparison } from "./services/api";
import { saveFavorite } from "./services/api";

export default function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);       // null = initial state, [] = searched but empty
  const [quantityGroups, setQuantityGroups] = useState([]);  // grouped by quantity tier
  const [bestDeal, setBestDeal] = useState(null);
  const [bestValue, setBestValue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("price");
  const [view, setView] = useState("grid");            // "grid" | "table"
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [savedItems, setSavedItems] = useState(new Set());
  const [cacheHit, setCacheHit] = useState(false);
  const [dataSource, setDataSource] = useState("mock"); // "live" | "mock"

  // ── Main search handler ────────────────────────────────────────────────────

  const handleSearch = useCallback(async (searchQuery) => {
    const q = searchQuery.trim();
    if (!q) return;

    setQuery(q);
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await fetchComparison(q, { sort });
      setResults(data.results || []);
      setQuantityGroups(data.quantityGroups || []);
      setBestDeal(data.bestDeal || null);
      setBestValue(data.bestValue || null);
      setCacheHit(!!data.fromCache);
      setDataSource(data.dataSource || "mock");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.error ||
        "Failed to connect to the comparison server. Make sure the backend is running."
      );
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [sort]);

  // Re-fetch when sort changes (only if we already have a query)
  const handleSortChange = async (newSort) => {
    setSort(newSort);
    if (query) {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchComparison(query, { sort: newSort });
          setResults(data.results || []);
          setQuantityGroups(data.quantityGroups || []);
          setBestDeal(data.bestDeal || null);
          setBestValue(data.bestValue || null);
          setCacheHit(!!data.fromCache);
          setDataSource(data.dataSource || "mock");
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to sort results.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Save / unsave a search query as a favorite
  const handleToggleFavorite = async (name) => {
    const key = name.toLowerCase().trim();
    if (savedItems.has(key)) {
      setSavedItems((prev) => { const s = new Set(prev); s.delete(key); return s; });
    } else {
      setSavedItems((prev) => new Set(prev).add(key));
      await saveFavorite({ name }).catch(() => {});
    }
  };

  // Calculate total savings vs highest price
  const totalSavings =
    results && results.length > 1 && bestDeal
      ? Math.max(...results.map((r) => r.price)) - bestDeal.price
      : 0;

  const queryKey = query.toLowerCase().trim();
  const isSaved = savedItems.has(queryKey);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="bg-brand-green text-white text-xl font-extrabold w-9 h-9 rounded-xl flex items-center justify-center leading-none">
              K
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 leading-none tracking-tight">
                Kam<span className="text-brand-orange">Pare</span>
              </h1>
              <p className="text-xs text-gray-500 leading-none">Compare Smart. Save More.</p>
            </div>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            {/* Cache indicator */}
            {cacheHit && results && results.length > 0 && (
              <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                ⚡ Cached result
              </span>
            )}

            {/* Favorites */}
            <button
              onClick={() => setFavoritesOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 hover:text-brand-green hover:bg-brand-greenLight rounded-xl transition-colors"
              aria-label="Saved favorites"
            >
              <svg className="w-4 h-4" fill={savedItems.size > 0 ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span className="hidden sm:inline">Favorites</span>
              {savedItems.size > 0 && (
                <span className="bg-brand-green text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {savedItems.size}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── Hero / Search ── */}
        <section className="bg-gradient-to-br from-brand-green via-emerald-600 to-green-700 py-12 px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Headline */}
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 leading-tight">
              Find the{" "}
              <span className="text-brand-orangeLight underline decoration-wavy decoration-brand-orange">
                lowest price
              </span>{" "}
              for your groceries
            </h2>
            <p className="text-green-100 mb-8 text-base sm:text-lg">
              Compare prices from Amazon, Flipkart, Blinkit, BigBasket, Instamart &amp; DMart — instantly.
            </p>

            <SearchBar onSearch={handleSearch} loading={loading} />

            {/* Platform icons row */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {[
                { name: "Amazon",    icon: "📦", color: "#ff9900" },
                { name: "Flipkart",  icon: "🛍️", color: "#2874f0" },
                { name: "Blinkit",   icon: "⚡", color: "#f8d72b" },
                { name: "BigBasket", icon: "🧺", color: "#84c226" },
                { name: "Instamart", icon: "🛒", color: "#fc8019" },
                { name: "DMart",     icon: "🏬", color: "#e31837" },
              ].map((p) => (
                <span
                  key={p.name}
                  className="flex items-center gap-1.5 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {p.icon} {p.name}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Results ── */}
        <section className="max-w-7xl mx-auto px-4 py-8 space-y-6">

          {/* Loading */}
          {loading && <LoadingState />}

          {/* Error / no results */}
          {!loading && error && (
            <ErrorState message={error} query={query} onRetry={() => handleSearch(query)} />
          )}

          {!loading && !error && results !== null && results.length === 0 && (
            <ErrorState query={query} />
          )}

          {/* Successful results */}
          {!loading && !error && results && results.length > 0 && (
            <div className="space-y-5 animate-slide-up">

              {/* ── Data source notice — live vs mock ── */}
              {dataSource === "live" ? (
                <div className="flex items-center gap-2 bg-green-50 border border-green-300 rounded-xl px-4 py-2 text-sm text-green-800">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block animate-pulse" />
                  <span className="font-semibold">Live prices</span> — fetched in real time from Google Shopping India.
                  Click any platform button to view and purchase the exact item.
                </div>
              ) : (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl px-4 py-3 text-sm text-amber-800">
                  <span className="text-lg leading-none mt-0.5">ℹ️</span>
                  <div>
                    <span className="font-semibold">Sample prices</span> — not fetched live.
                    Add your <span className="font-mono text-xs bg-amber-100 px-1 rounded">SERPAPI_KEY</span> to <span className="font-mono text-xs bg-amber-100 px-1 rounded">backend/.env</span> to enable real prices.{" "}
                    For now, use "Search on [Platform]" to verify current prices before buying.
                  </div>
                </div>
              )}

              {/* Best Deal Banner */}
              <BestDealBanner
                bestDeal={bestDeal}
                bestValue={bestValue}
                query={query}
                totalSavings={totalSavings}
              />

              {/* Filter Bar */}
              <FilterBar
                sort={sort}
                onSort={handleSortChange}
                view={view}
                onViewChange={setView}
                resultCount={results.length}
                query={query}
              />

              {/* Save query to favorites */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleFavorite(query)}
                  className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                    ${isSaved
                      ? "bg-brand-greenLight border-brand-green text-brand-green"
                      : "bg-white border-gray-200 text-gray-500 hover:border-brand-green hover:text-brand-green"
                    }`}
                >
                  <svg className="w-3.5 h-3.5" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  {isSaved ? "Saved to favorites" : `Save "${query}" to favorites`}
                </button>
              </div>

              {/* Card Grid — grouped by quantity tier */}
              {view === "grid" && (
                quantityGroups.length > 1 ? (
                  /* Multiple quantity tiers — render one section per tier */
                  <div className="space-y-8">
                    {quantityGroups.map((group) => (
                      <div key={group.quantityGrams}>
                        {/* Tier heading */}
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                            📦 {group.quantityLabel}
                          </span>
                          <span className="text-xs text-gray-500">
                            {group.results.length} platform{group.results.length !== 1 ? "s" : ""} available
                          </span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                          {group.results.map((product, idx) => (
                            <ProductCard
                              key={`${product.platform}-${group.quantityGrams}-${idx}`}
                              product={product}
                              rank={!product.isBestDeal ? idx + 1 : undefined}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Single quantity tier — flat grid */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                    {results.map((product, idx) => (
                      <ProductCard
                        key={`${product.platform}-${idx}`}
                        product={product}
                        rank={!product.isBestDeal ? idx + 1 : undefined}
                      />
                    ))}
                  </div>
                )
              )}

              {/* Table View */}
              {view === "table" && <ComparisonTable results={results} quantityGroups={quantityGroups} />}

              {/* Price Chart */}
              <PriceChart results={results} query={query} />

            </div>
          )}

          {/* Initial empty state */}
          {!loading && !error && results === null && (
            <div className="py-16 text-center text-gray-400">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-lg font-medium text-gray-500">Start comparing grocery prices</p>
              <p className="text-sm mt-1">
                Search above to compare sample prices across platforms and find the best deal.
              </p>
            </div>
          )}

        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <div className="bg-brand-green text-white text-sm font-extrabold w-7 h-7 rounded-lg flex items-center justify-center">K</div>
            <span className="font-bold text-gray-800">Kam<span className="text-brand-orange">Pare</span></span>
          </div>
          {dataSource === "live" ? (
            <p className="text-sm text-gray-500">
              Prices are fetched live from <strong>Google Shopping India</strong>.
              Actual platform prices may vary slightly — always confirm before checkout.
              Quantities shown are per-pack. 📦 Use <strong>₹/100g</strong> to compare fairly across pack sizes.
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Prices shown are <strong>sample/indicative data</strong>.
              Add a <code className="text-xs bg-gray-100 px-1 rounded">SERPAPI_KEY</code> in <code className="text-xs bg-gray-100 px-1 rounded">backend/.env</code> to enable live prices.
              Use "Search on [Platform]" to verify current prices before buying.
            </p>
          )}
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} KamPare — Compare Smart. Save More.
          </p>
        </div>
      </footer>

      {/* ── Favorites Panel ── */}
      <FavoritesPanel
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        onSearch={handleSearch}
      />
    </div>
  );
}
