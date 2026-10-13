"use client";

import React from "react";
import { X, Trash2, Film, Play } from "lucide-react";
import { Movie } from "@/types/movie";
import { IMAGE_BASE_URL } from "@/lib/tmdb";
import Link from "next/link";

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlistMovies: Movie[];
  onRemove: (id: number) => void;
}

export default function WatchlistDrawer({
  isOpen,
  onClose,
  watchlistMovies,
  onRemove,
}: WatchlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop Overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide-over Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#e2e8f0] bg-[#f8fafc]">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-[#0284c7]" />
              <h2 className="text-lg font-serif font-bold text-[#0f172a]">
                My Watchlist ({watchlistMovies.length})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-200 text-[#64748b] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {watchlistMovies.length === 0 ? (
              <div className="text-center py-20 space-y-3">
                <Film className="w-12 h-12 text-[#cbd5e1] mx-auto" />
                <p className="text-sm text-[#64748b] font-mono">
                  Your watchlist is currently empty.
                </p>
              </div>
            ) : (
              watchlistMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-4 bg-[#f8fafc] border border-[#e2e8f0] p-3 rounded-2xl shadow-sm relative group"
                >
                  <img
                    src={
                      movie.poster_path?.startsWith("http")
                        ? movie.poster_path
                        : `${IMAGE_BASE_URL}${movie.poster_path}`
                    }
                    alt={movie.title}
                    className="w-16 h-20 object-cover rounded-xl shadow"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-mono text-[#64748b] block">
                      {movie.release_date?.split("-")[0]}
                    </span>
                    <h3 className="font-serif text-sm font-bold text-[#0f172a] truncate">
                      {movie.title}
                    </h3>
                    <Link
                      href={`/movie/${movie.id}`}
                      onClick={onClose}
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0284c7] hover:underline mt-2"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>View Details</span>
                    </Link>
                  </div>
                  <button
                    onClick={() => onRemove(movie.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-[#e2e8f0] bg-[#f8fafc]">
            <button
              onClick={onClose}
              className="w-full bg-[#0f172a] hover:bg-[#0284c7] text-white py-3 rounded-xl text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              Continue Browsing
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}