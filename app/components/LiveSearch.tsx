"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, Loader2, Film, Star } from "lucide-react";
import { searchMovies, IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

export default function LiveSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        const data = await searchMovies(query);
        setResults(data.slice(0, 5)); // Top 5 matching results
        setLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 400); // 400ms debounce delay

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-64 sm:w-80" ref={searchRef}>
      <div className="relative">
        <Search className="w-4 h-4 text-[#94a3b8] absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search movies globally..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true);
          }}
          className="bg-white border border-[#cbd5e1] pl-10 pr-10 py-2.5 rounded-xl text-xs font-mono text-[#0f172a] focus:outline-none focus:border-[#0284c7] w-full shadow-sm transition-all"
        />
        {loading && (
          <Loader2 className="w-4 h-4 text-[#0284c7] animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
        )}
      </div>

      {/* Autocomplete Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute left-0 right-0 mt-2 bg-white border border-[#e2e8f0] rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-2 border-b border-[#f1f5f9] text-[10px] font-mono font-bold text-[#64748b] uppercase px-3">
            TMDB Realtime Results
          </div>
          <div className="max-h-72 overflow-y-auto divide-y divide-[#f1f5f9]">
            {results.map((movie) => (
              <Link
                key={movie.id}
                href={`/movie/${movie.id}`}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-3 hover:bg-[#f8fafc] transition-colors cursor-pointer group"
              >
                <img
                  src={
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${movie.poster_path}`
                      : "https://images.unsplash.com/photo-1536440136628-849c177e76a1"
                  }
                  alt={movie.title}
                  className="w-10 h-12 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-serif font-bold text-[#0f172a] truncate group-hover:text-[#0284c7] transition-colors">
                    {movie.title}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-[#64748b] mt-0.5">
                    <span>{movie.release_date?.split("-")[0] || "N/A"}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3 h-3 fill-current" />
                      {movie.vote_average?.toFixed(1)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}