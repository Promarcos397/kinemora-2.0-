import { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';
import { searchMovies } from '../services/api';

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes
const MIN_VOTE_COUNT = 100; // Filter out obscure content with low votes
const BLACKLISTED_GENRES = [99]; // 99 = Documentary

interface CacheEntry {
  timestamp: number;
  data: Movie[];
}

export const useSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple in-memory cache
  const cache = useRef<Map<string, CacheEntry>>(new Map());

  useEffect(() => {
    const trimmedQuery = query.trim();

    // 1. Reset if empty
    if (trimmedQuery.length === 0) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // 2. Minimum length check to avoid spamming API
    if (trimmedQuery.length < 2) {
      return;
    }

    setIsLoading(true);
    setError(null);

    // 3. Check Cache
    const cached = cache.current.get(trimmedQuery.toLowerCase());
    if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
      setResults(cached.data);
      setIsLoading(false);
      return;
    }

    // 4. Debounce & Fetch
    const timeoutId = setTimeout(async () => {
      try {
        const rawResults = await searchMovies(trimmedQuery);

        // --- Smart Search Algorithm ---
        // 1. Unpack "Person" results into their "known_for" movies
        // 2. Filter out items without images
        // 3. Filter by vote count (removes obscure content)
        // 4. Filter out documentaries
        // 5. Remove duplicates
        const processedResults: Movie[] = [];
        const seenIds = new Set<number>();

        // Helper: Check if item passes quality filters
        const passesQualityFilters = (item: Movie): boolean => {
          // Must have image
          if (!item.backdrop_path && !item.poster_path) return false;

          // Vote count floor (filter obscure content)
          if (item.vote_count !== undefined && item.vote_count < MIN_VOTE_COUNT) return false;

          // Genre blacklist (filter documentaries unless explicitly searched)
          if (item.genre_ids && item.genre_ids.some(id => BLACKLISTED_GENRES.includes(id))) {
            // Exception: if query contains "documentary", allow them
            if (!trimmedQuery.toLowerCase().includes('documentary')) return false;
          }

          return true;
        };

        rawResults.forEach((item) => {
          // A) Handle 'Person' results: Expand them into their known movies/shows
          if (item.media_type === 'person' && item.known_for) {
            item.known_for.forEach((work) => {
              if (!seenIds.has(work.id) && passesQualityFilters(work)) {
                seenIds.add(work.id);
                processedResults.push(work);
              }
            });
          }
          // B) Handle direct Movie/TV results
          else if (item.media_type !== 'person') {
            if (!seenIds.has(item.id) && passesQualityFilters(item)) {
              seenIds.add(item.id);
              processedResults.push(item);
            }
          }
        });

        // Sort by popularity (most popular first)
        processedResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        // 5. Update Cache
        cache.current.set(trimmedQuery.toLowerCase(), {
          timestamp: Date.now(),
          data: processedResults
        });

        setResults(processedResults);
      } catch (err) {
        console.error("Search failed", err);
        setError("Failed to fetch results.");
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms debounce

    return () => clearTimeout(timeoutId);
  }, [query]);

  const clearSearch = () => setQuery('');

  return { query, setQuery, results, isLoading, error, clearSearch };
};

export default useSearch;
