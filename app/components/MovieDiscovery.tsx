"use client";

import React, { useState, useEffect } from "react";
import {
  Star,
  Loader2,
  Play,
  Bookmark,
  Film,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Clapperboard,
  SlidersHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/movie";
import EditorialSection from "./EditorialSection";
import LiveSearch from "./LiveSearch";
import Link from "next/link";
import {
  fetchTrendingMovies,
  fetchGenres,
  IMAGE_BASE_URL,
  BACKDROP_BASE_URL,
} from "@/lib/tmdb";
import WatchlistDrawer from "./WatchlistDrawer";

export default function MovieDiscovery() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<{ id: number; name: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [heroIndex, setHeroIndex] = useState(0);

  // Initial Fetch on Mount & Load Watchlist from LocalStorage
  useEffect(() => {
    async function loadInitialData() {
      setLoading(true);
      const [moviesData, genresData] = await Promise.all([
        fetchTrendingMovies(1),
        fetchGenres(),
      ]);

      if (moviesData && moviesData.results) {
        setMovies(moviesData.results);
      }
      if (genresData) {
        setGenres(genresData);
      }
      setLoading(false);
    }
    loadInitialData();

    const saved = localStorage.getItem("cinestream_watchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Save Watchlist to LocalStorage on change
  const toggleWatchlist = (id: number) => {
    setWatchlist((prev) => {
      const updated = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      localStorage.setItem("cinestream_watchlist", JSON.stringify(updated));
      return updated;
    });
  };

  // Filter movies currently in Watchlist
  const watchlistMovies = movies.filter((m) => watchlist.includes(m.id));

  const handleLoadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const data = await fetchTrendingMovies(nextPage);

    if (data && data.results) {
      setMovies((prev) => [...prev, ...data.results]);
      setPage(nextPage);
    }
    setLoading(false);
  };

  // Image URL Helper Functions
  const getPosterUrl = (path: string) => {
    if (!path)
      return "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80";
    return path.startsWith("http") ? path : `${IMAGE_BASE_URL}${path}`;
  };

  const getBackdropUrl = (path: string) => {
    if (!path)
      return "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80";
    return path.startsWith("http") ? path : `${BACKDROP_BASE_URL}${path}`;
  };

  const currentHero = movies[heroIndex % movies.length] || movies[0];

  const nextHero = () =>
    setHeroIndex((prev) => (prev + 1) % (movies.length || 1));
  const prevHero = () =>
    setHeroIndex(
      (prev) => (prev - 1 + (movies.length || 1)) % (movies.length || 1)
    );

  // Genre Filter Logic
  const filteredMovies = movies.filter((m) => {
    const matchesGenre = selectedGenre
      ? m.genre_ids?.includes(selectedGenre)
      : true;
    return matchesGenre;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] font-sans">
      {/* 1. WordPress Style Top Announcement Bar */}
      <div className="bg-[#1e293b] text-[#94a3b8] text-xs py-2 px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-2 border-b border-[#334155]">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Clapperboard className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Welcome to CineStream Studio Engine</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>Jaipur, Rajasthan</span>
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>+91 98765 43210</span>
          </span>
          <span className="hidden sm:flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>contact@cinestream.io</span>
          </span>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-[#e2e8f0] px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-[#0284c7] text-white p-2 rounded-xl">
            <Film className="w-6 h-6" />
          </div>
          <span className="text-2xl font-serif font-bold tracking-tight text-[#0f172a]">
            CineStream<span className="text-[#0284c7]">Pro</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#475569]">
          <a href="#" className="text-[#0284c7] hover:text-[#0284c7] transition-colors">
            Home
          </a>
          <a href="#" className="hover:text-[#0284c7] transition-colors">
            Trending
          </a>
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="hover:text-[#0284c7] transition-colors cursor-pointer font-semibold"
          >
            Watchlist ({watchlist.length})
          </button>
          <a href="#categories" className="hover:text-[#0284c7] transition-colors">
            Categories
          </a>
          <a href="#" className="hover:text-[#0284c7] transition-colors">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors cursor-pointer shadow-md">
            Get Pro Pass
          </button>
        </div>
      </header>

      {/* 3. Hero Section */}
      <section className="relative w-full h-[550px] bg-[#0f172a] overflow-hidden flex items-center">
        {currentHero && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img
                src={getBackdropUrl(currentHero.backdrop_path)}
                alt={currentHero.title}
                className="w-full h-full object-cover opacity-35"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a] via-[#0f172a]/80 to-transparent" />
            </motion.div>
          </AnimatePresence>
        )}

        <button
          onClick={prevHero}
          className="absolute left-6 z-20 bg-white/90 hover:bg-white text-[#0f172a] p-3 rounded-full shadow-lg transition-all cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextHero}
          className="absolute right-6 z-20 bg-white/90 hover:bg-white text-[#0f172a] p-3 rounded-full shadow-lg transition-all cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {currentHero && (
          <div className="relative z-10 max-w-7xl mx-auto px-12 lg:px-20 w-full">
            <div className="max-w-2xl space-y-5">
              <span className="inline-block bg-[#0284c7] text-white text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-md tracking-wider">
                Featured Cinema #0{heroIndex + 1}
              </span>
              <h1 className="text-4xl sm:text-6xl font-serif font-bold text-white leading-tight">
                {currentHero.title}
              </h1>
              <p className="text-sm sm:text-base text-[#94a3b8] font-normal leading-relaxed line-clamp-3">
                {currentHero.overview}
              </p>
              <div className="pt-2 flex items-center gap-4">
                <Link
                  href={`/movie/${currentHero.id}`}
                  className="bg-white hover:bg-[#f1f5f9] text-[#0f172a] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-lg shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-current text-[#0284c7]" />
                  <span>Read More / Watch</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 4. Filter & Movie Grid Section */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-8" id="categories">
        {/* Section Header with Live Search Component */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#e2e8f0] pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0f172a]">
              Trending Discovery Catalog
            </h2>
            <p className="text-xs text-[#64748b] mt-1 font-mono">
              Explore handpicked cinematic titles powered by Next.js 15
            </p>
          </div>

          {/* Integrated Live Global Search */}
          <LiveSearch />
        </div>

        {/* Horizontal Category / Genre Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#0284c7] pr-3 border-r border-[#cbd5e1]">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Genres:</span>
          </div>

          <button
            onClick={() => setSelectedGenre(null)}
            className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedGenre === null
                ? "bg-[#0284c7] text-white shadow-md"
                : "bg-white text-[#64748b] border border-[#e2e8f0] hover:border-[#0284c7]"
            }`}
          >
            All Categories
          </button>

          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => setSelectedGenre(genre.id)}
              className={`px-4 py-2 rounded-full text-xs font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedGenre === genre.id
                  ? "bg-[#0284c7] text-white shadow-md"
                  : "bg-white text-[#64748b] border border-[#e2e8f0] hover:border-[#0284c7]"
              }`}
            >
              {genre.name}
            </button>
          ))}
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-2">
          {filteredMovies.map((movie, index) => (
            <motion.div
              key={`${movie.id}-${index}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -6 }}
              className="group bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-[#f1f5f9]">
                <img
                  src={getPosterUrl(movie.poster_path)}
                  alt={movie.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <button
                  onClick={() => toggleWatchlist(movie.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border transition-colors cursor-pointer ${
                    watchlist.includes(movie.id)
                      ? "bg-[#0284c7] text-white border-[#0284c7]"
                      : "bg-white/80 text-[#0f172a] border-[#e2e8f0] hover:bg-white"
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 fill-current" />
                </button>

                <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md border border-[#e2e8f0] px-2.5 py-1 rounded-full flex items-center gap-1.5 text-xs font-mono font-bold text-amber-500 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <span className="text-[10px] font-mono text-[#64748b] block">
                  RELEASED:{" "}
                  {movie.release_date ? movie.release_date.split("-")[0] : "N/A"}
                </span>
                <h3 className="font-serif text-lg font-bold text-[#0f172a] line-clamp-1 group-hover:text-[#0284c7] transition-colors">
                  {movie.title}
                </h3>
                <p className="text-xs text-[#64748b] line-clamp-2 font-light leading-relaxed">
                  {movie.overview}
                </p>

                <Link
                  href={`/movie/${movie.id}`}
                  className="pt-2 w-full flex items-center justify-center gap-2 bg-[#f8fafc] hover:bg-[#0284c7] text-[#0f172a] hover:text-white border border-[#e2e8f0] hover:border-[#0284c7] py-2.5 rounded-xl text-xs font-mono font-bold uppercase transition-all cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Details</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Pagination */}
        <div className="text-center pt-8 border-t border-[#e2e8f0]">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="bg-[#0f172a] hover:bg-[#0284c7] text-white px-8 py-3.5 rounded-xl text-xs font-mono font-bold uppercase tracking-widest transition-all inline-flex items-center gap-3 cursor-pointer shadow-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Fetching Next Page...</span>
              </>
            ) : (
              <>
                <Film className="w-4 h-4" />
                <span>Load More Movies (Page {page + 1})</span>
              </>
            )}
          </button>
        </div>
      </main>

      {/* 5. Headless WordPress Editorial Section */}
      <EditorialSection />

      {/* Watchlist Slide-over Drawer */}
      <WatchlistDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        watchlistMovies={watchlistMovies}
        onRemove={toggleWatchlist}
      />
    </div>
  );
}