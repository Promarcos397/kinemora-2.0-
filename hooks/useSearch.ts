import { useState, useEffect, useRef } from 'react';
import { Movie } from '../types';
import { searchMovies } from '../services/api';

const CACHE_DURATION = 1000 * 60 * 5; // 5 minutes

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
        // 3. Remove duplicates
        const processedResults: Movie[] = [];
        const seenIds = new Set<number>();

        rawResults.forEach((item) => {
            // A) Handle 'Person' results: Expand them into their known movies/shows
            if (item.media_type === 'person' && item.known_for) {
                item.known_for.forEach((work) => {
                    // Recursive check for valid media items inside known_for
                    if (!seenIds.has(work.id) && (work.backdrop_path || work.poster_path)) {
                        seenIds.add(work.id);
                        processedResults.push(work);
                    }
                });
            } 
            // B) Handle direct Movie/TV results
            else if (item.backdrop_path || item.poster_path) {
                // Exclude person objects that don't have known_for or generic items without images
                // Note: some Person results might not have known_for, we skip those if they aren't media
                const isMedia = item.media_type !== 'person';
                
                if (isMedia && !seenIds.has(item.id)) {
                    seenIds.add(item.id);
                    processedResults.push(item);
                }
            }
        });

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