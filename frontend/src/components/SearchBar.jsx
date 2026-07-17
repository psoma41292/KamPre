/**
 * SearchBar component
 * Features:
 *  - Controlled input with debounced autocomplete
 *  - Keyboard navigation (↑ ↓ Enter Escape)
 *  - Voice search (Web Speech API)
 *  - Quick-category chips
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { fetchSuggestions } from "../services/api";

const QUICK_SEARCHES = ["Toor Dal", "Basmati Rice", "Milk", "Atta", "Sugar", "Cooking Oil"];

export default function SearchBar({ onSearch, loading }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [listening, setListening] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Debounced suggestions fetch
  const loadSuggestions = useCallback((val) => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (val.trim().length >= 2) {
        const s = await fetchSuggestions(val);
        setSuggestions(s);
        setShowSuggestions(s.length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);
  }, []);

  useEffect(() => {
    loadSuggestions(query);
    return () => clearTimeout(debounceRef.current);
  }, [query, loadSuggestions]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const q = query.trim();
    if (!q) return;
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveIdx(-1);
    onSearch(q);
  };

  const handleSelect = (s) => {
    setQuery(s);
    setShowSuggestions(false);
    setSuggestions([]);
    setActiveIdx(-1);
    onSearch(s);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0) {
        e.preventDefault();
        handleSelect(suggestions[activeIdx]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  // Voice search via Web Speech API
  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice search is not supported in this browser.");
      return;
    }
    const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new Rec();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    setListening(true);
    rec.start();
    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setListening(false);
      onSearch(transcript);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* ── Search form ── */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white border-2 border-brand-green rounded-2xl shadow-lg overflow-visible focus-within:border-brand-greenDark transition-colors">
          {/* Magnifying glass icon */}
          <span className="pl-4 text-brand-green shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder='Search for groceries (e.g. "Toor Dal", "Rice")'
            className="flex-1 px-3 py-3.5 text-base bg-transparent outline-none placeholder-gray-400"
            autoComplete="off"
            aria-label="Search for grocery items"
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); setSuggestions([]); setShowSuggestions(false); inputRef.current?.focus(); }}
              className="px-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Voice search */}
          <button
            type="button"
            onClick={handleVoice}
            className={`px-3 text-gray-400 hover:text-brand-green transition-colors ${listening ? "text-red-500 animate-pulse" : ""}`}
            aria-label="Voice search"
            title="Voice search"
          >
            <svg className="w-5 h-5" fill={listening ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>

          {/* Search button */}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="m-1 px-5 py-2.5 bg-brand-green hover:bg-brand-greenDark disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors text-sm"
          >
            {loading ? (
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Searching
              </span>
            ) : "Compare"}
          </button>
        </div>

        {/* ── Autocomplete dropdown ── */}
        {showSuggestions && (
          <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
            {suggestions.map((s, i) => (
              <li
                key={s}
                onClick={() => handleSelect(s)}
                className={`px-4 py-2.5 cursor-pointer flex items-center gap-2 text-sm capitalize
                  ${i === activeIdx ? "bg-brand-greenLight text-brand-greenDark font-medium" : "hover:bg-gray-50"}`}
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {s}
              </li>
            ))}
          </ul>
        )}
      </form>

      {/* ── Quick search chips ── */}
      <div className="flex flex-wrap gap-2 mt-3 justify-center">
        {QUICK_SEARCHES.map((item) => (
          <button
            key={item}
            onClick={() => { setQuery(item); onSearch(item); }}
            className="px-3 py-1 bg-white border border-gray-200 hover:border-brand-green hover:bg-brand-greenLight text-gray-600 hover:text-brand-greenDark text-xs rounded-full transition-all font-medium"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}
