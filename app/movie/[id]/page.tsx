"use client";

import React, { useState, useEffect, use } from "react";
import {
  fetchMovieDetails,
  fetchMovieTrailer,
  BACKDROP_BASE_URL,
  IMAGE_BASE_URL,
} from "@/lib/tmdb";
import { Star, ArrowLeft, Calendar, Play } from "lucide-react";
import Link from "next/link";
import TrailerModal from "@/app/components/TrailerModal";

export default function MovieDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const movieId = resolvedParams.id;

  // States
  const [movie, setMovie] = useState<any>(null);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const [details, key] = await Promise.all([
        fetchMovieDetails(movieId),
        fetchMovieTrailer(movieId),
      ]);
      setMovie(details);
      setTrailerKey(key);
      setLoading(false);
    }
    getData();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center text-white font-mono text-xs">
        Loading Movie Details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-[#0f172a] font-sans">
        <h1 className="text-2xl font-bold font-serif mb-4">Movie Details Not Found</h1>
        <Link href="/" className="text-sm text-[#0284c7] underline font-mono">
          &larr; Back to Discovery Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Top Navigation Back Link */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#94a3b8] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </Link>
      </div>

      {/* Hero Backdrop Banner */}
      <div className="relative w-full h-[450px] overflow-hidden">
        <img
          src={
            movie.backdrop_path
              ? `${BACKDROP_BASE_URL}${movie.backdrop_path}`
              : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba"
          }
          alt={movie.title}
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 -mt-32 relative z-10 pb-20">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Poster Card */}
          <div className="w-64 sm:w-72 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#1e293b]">
            <img
              src={
                movie.poster_path
                  ? `${IMAGE_BASE_URL}${movie.poster_path}`
                  : "https://images.unsplash.com/photo-1536440136628-849c177e76a1"
              }
              alt={movie.title}
              className="w-full aspect-[2/3] object-cover"
            />
          </div>

          {/* Details Metadata */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-[#0284c7] text-white text-xs font-mono font-bold uppercase px-3 py-1 rounded-md">
                Feature Film
              </span>
              <div className="flex items-center gap-1 text-amber-400 font-mono text-sm font-bold bg-white/5 border border-white/10 px-3 py-1 rounded-md">
                <Star className="w-4 h-4 fill-current" />
                <span>{movie.vote_average?.toFixed(1)} / 10</span>
              </div>
              <div className="flex items-center gap-1 text-[#94a3b8] font-mono text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>{movie.release_date}</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight">
              {movie.title}
            </h1>

            <p className="text-base text-[#94a3b8] font-light leading-relaxed max-w-3xl">
              {movie.overview}
            </p>

            {/* Genres */}
            {movie.genres && (
              <div className="flex flex-wrap gap-2 pt-2">
                {movie.genres.map((g: { id: number; name: string }) => (
                  <span
                    key={g.id}
                    className="text-xs font-mono bg-[#1e293b] text-[#cbd5e1] px-3 py-1.5 rounded-lg border border-white/5"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Trigger Trailer Modal */}
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Watch Trailer / Stream</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Video Overlay Modal */}
      <TrailerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoKey={trailerKey}
        title={movie.title}
      />
    </div>
  );
}


