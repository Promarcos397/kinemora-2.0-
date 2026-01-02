import React from 'react';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';

interface SearchResultsPageProps {
  query: string;
  results: Movie[];
  onSelectMovie: (movie: Movie) => void;
  isLoading: boolean;
}

const SearchResultsPage: React.FC<SearchResultsPageProps> = ({ query, results, onSelectMovie, isLoading }) => {
  return (
    <div className="pt-28 px-6 md:px-14 lg:px-20 pb-12 min-h-screen">
      <div className="text-gray-500 text-sm mb-4">
        Explore titles related to: <span className="text-white">"{query}"</span>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8 animate-pulse">
            {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-video bg-[#222] rounded-md border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
                </div>
            ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-4 gap-y-8">
          {results.map(movie => (
            movie.backdrop_path && (
              <MovieCard key={movie.id} movie={movie} onSelect={onSelectMovie} isGrid={true} />
            )
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 text-center">
          <div className="text-xl text-white mb-2">Your search for "{query}" did not have any matches.</div>
          <div className="text-gray-400 text-sm">Suggestions:</div>
          <ul className="text-gray-400 text-sm list-disc list-inside mt-2 text-left">
            <li>Try different keywords</li>
            <li>Looking for a movie or TV show?</li>
            <li>Try using a movie, TV show title, or an actor</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;