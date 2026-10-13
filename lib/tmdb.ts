import { Movie } from "@/types/movie";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || "";

export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
export const BACKDROP_BASE_URL = "https://image.tmdb.org/t/p/original";

// Fallback Mock Data
export const MOCK_MOVIES: Movie[] = [
  {
    id: 550,
    title: "Fight Club",
    overview: "An ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    poster_path: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    release_date: "1999-10-15",
    vote_average: 8.4,
    vote_count: 26000,
  },
  {
    id: 157336,
    title: "Interstellar",
    overview: "The adventures of a group of explorers who make use of a newly discovered wormhole to surpass the limitations on human space travel.",
    poster_path: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=600&q=80",
    backdrop_path: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80",
    release_date: "2014-11-05",
    vote_average: 8.4,
    vote_count: 32000,
  },
];

export async function fetchTrendingMovies(page = 1) {
  if (!API_KEY) {
    console.warn("TMDB API Key missing! Using fallback mock data.");
    return { results: MOCK_MOVIES, total_pages: 5 };
  }

  try {
    const res = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`
    );
    if (!res.ok) throw new Error("API Fetch failed");
    return await res.json();
  } catch (err) {
    console.error("TMDB Fetch Error:", err);
    return { results: MOCK_MOVIES, total_pages: 5 };
  }
}
export async function fetchMovieDetails(id: string) {
  if (!API_KEY) return null;

  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
    );
    if (!res.ok) throw new Error("Failed to fetch movie details");
    return await res.json();
  } catch (err) {
    console.error("Movie Details Fetch Error:", err);
    return null;
  }
}


export async function fetchGenres() {
  if (!API_KEY) return [];

  try {
    const res = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`
    );
    if (!res.ok) throw new Error("Failed to fetch genres");
    const data = await res.json();
    return data.genres || [];
  } catch (err) {
    console.error("Genre Fetch Error:", err);
    return [];
  }
}

export async function fetchMovieTrailer(id: string) {
  if (!API_KEY) return null;

  try {
    const res = await fetch(
      `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`
    );
    if (!res.ok) throw new Error("Failed to fetch movie trailers");
    const data = await res.json();
    
    // Official Trailer ya Teaser khojna
    const trailer = data.results?.find(
      (vid: { type: string; site: string }) =>
        vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
    );

    return trailer ? trailer.key : null;
  } catch (err) {
    console.error("Trailer Fetch Error:", err);
    return null;
  }
}

export async function searchMovies(query: string) {
  if (!API_KEY || !query.trim()) return [];

  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        query
      )}&language=en-US&page=1`
    );
    if (!res.ok) throw new Error("Failed to search movies");
    const data = await res.json();
    return data.results || [];
  } catch (err) {
    console.error("Search Error:", err);
    return [];
  }
}