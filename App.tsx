import React, { useState } from 'react';
import { Movie } from './types';
import useSearch from './hooks/useSearch';

// Components
import Layout from './components/Layout';
import InfoModal from './components/InfoModal';
import VideoPlayer from './components/VideoPlayer';

// Pages
import HomePage from './pages/HomePage';
import TVShowsPage from './pages/TVShowsPage';
import MoviesPage from './pages/MoviesPage';
import NewPopularPage from './pages/NewPopularPage';
import MyListPage from './pages/MyListPage';
import SearchResultsPage from './pages/SearchResultsPage';

const App: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [playingSeason, setPlayingSeason] = useState<number | undefined>(undefined);
  const [playingEpisode, setPlayingEpisode] = useState<number | undefined>(undefined);
  
  // Search Logic (Hook)
  const { query, setQuery, results, isLoading } = useSearch();
  
  // Navigation State
  const [activeTab, setActiveTab] = useState("home");

  const handlePlay = (movie: Movie, season?: number, episode?: number) => {
      setPlayingMovie(movie);
      setPlayingSeason(season);
      setPlayingEpisode(episode);
      setSelectedMovie(null); // Close info modal if open
  };

  const closePlayer = () => {
      setPlayingMovie(null);
      setPlayingSeason(undefined);
      setPlayingEpisode(undefined);
  };

  // Router / Page Selector
  const renderContent = () => {
    // 1. Search Results Override
    if (query.trim().length > 0) {
        return (
            <SearchResultsPage 
                query={query} 
                results={results} 
                onSelectMovie={setSelectedMovie} 
                isLoading={isLoading}
            />
        );
    }

    // 2. Tab Navigation
    switch (activeTab) {
        case 'list':
            return <MyListPage onSelectMovie={setSelectedMovie} />;
        case 'tv':
            return <TVShowsPage onSelectMovie={setSelectedMovie} onPlay={handlePlay} />;
        case 'movies':
            return <MoviesPage onSelectMovie={setSelectedMovie} onPlay={handlePlay} />;
        case 'new':
            return <NewPopularPage onSelectMovie={setSelectedMovie} />;
        case 'home':
        default:
            return <HomePage onSelectMovie={setSelectedMovie} onPlay={handlePlay} />;
    }
  };

  return (
    <div className={(selectedMovie || playingMovie) ? 'overflow-hidden h-screen' : ''}>
      
      {/* Video Player Overlay */}
      {playingMovie && (
          <VideoPlayer 
            movie={playingMovie} 
            season={playingSeason}
            episode={playingEpisode}
            onClose={closePlayer} 
          />
      )}

      <Layout 
        searchQuery={query}
        setSearchQuery={setQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        showFooter={!query} // Hide footer during search
      >
        {renderContent()}
      </Layout>

      <InfoModal 
        movie={selectedMovie} 
        onClose={() => setSelectedMovie(null)} 
        onPlay={handlePlay} 
      />
    </div>
  );
}

export default App;