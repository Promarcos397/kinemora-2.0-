import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Movie } from './types';
import useSearch from './hooks/useSearch';
import { useTitle } from './context/TitleContext';
import { useGlobalContext } from './context/GlobalContext';

// Components
import Layout from './components/Layout';
import InfoModal from './components/InfoModal';
import WatchPage from './pages/WatchPage';
import TitleBar from './components/TitleBar';

// Pages
import HomePage from './pages/HomePage';
import ShowsPage from './pages/ShowsPage';
import MoviesPage from './pages/MoviesPage';
import NewPopularPage from './pages/NewPopularPage';
import MyListPage from './pages/MyListPage';
import SearchResultsPage from './pages/SearchResultsPage';
import SettingsPage from './pages/SettingsPage';

const App: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { query, setQuery, results, isLoading } = useSearch();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { setPageTitle } = useTitle();
  const { updateVideoState } = useGlobalContext();

  // Sync search query from URL on mount
  useEffect(() => {
    const urlQuery = searchParams.get('q');
    if (urlQuery && !query) {
      setQuery(urlQuery);
    }
  }, []);

  // Update page title based on route
  useEffect(() => {
    const path = location.pathname;

    // Don't update title for watch page (WatchPage handles its own title)
    if (path.startsWith('/watch')) return;

    if (query) {
      setPageTitle(`Search: ${query}`);
    } else if (path === '/') {
      setPageTitle('Home');
    } else if (path === '/tv') {
      setPageTitle('Shows');
    } else if (path === '/movies') {
      setPageTitle('Movies');
    } else if (path === '/new') {
      setPageTitle('New & Popular');
    } else if (path === '/list') {
      setPageTitle('My List');
    } else if (path.startsWith('/settings')) {
      setPageTitle('Settings');
    } else {
      setPageTitle('');
    }
  }, [location.pathname, query, setPageTitle]);

  /* State for Video Sync */
  const [heroSeekTime, setHeroSeekTime] = useState(0);
  const [infoInitialTime, setInfoInitialTime] = useState(0);
  const [infoVideoId, setInfoVideoId] = useState<string | undefined>(undefined);

  // Scroll to top on route change
  useEffect(() => {
    if (!location.pathname.startsWith('/watch')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  // Navigation handlers
  const handleSelectMovie = (movie: Movie, time?: number, videoId?: string) => {
    setInfoInitialTime(time || 0);
    setInfoVideoId(videoId);
    setSelectedMovie(movie);
  };

  const handleCloseModal = (finalTime?: number) => {
    setSelectedMovie(null);
    setInfoVideoId(undefined);
    if (finalTime && finalTime > 0) {
      setHeroSeekTime(finalTime);
      if (selectedMovie) {
        updateVideoState(selectedMovie.id, finalTime);
      }
    }
  };

  const handlePlay = (movie: Movie, season?: number, episode?: number) => {
    // Navigate to watch page
    const type = movie.media_type || (movie.title ? 'movie' : 'tv');
    let url = `/watch/${type}/${movie.id}`;
    if (season && episode) {
      url += `?season=${season}&episode=${episode}`;
    }
    navigate(url);
    setSelectedMovie(null);
  };

  // Determine active tab for Layout based on path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/tv') return 'tv';
    if (path === '/movies') return 'movies';
    if (path === '/new') return 'new';
    if (path === '/list') return 'list';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeTab = getActiveTab();
  const isWatching = location.pathname.includes('/watch');

  const handleTabChange = (tab: string) => {
    setQuery('');
    if (tab === 'home') navigate('/');
    else navigate(`/${tab}`);
  };

  // Update URL when search query changes
  const handleSearchChange = (newQuery: string) => {
    setQuery(newQuery);
    // Note: We don't update URL on every keystroke to avoid history spam
    // Deep linking is read on page load
  };

  // Don't render layout for watch page
  if (isWatching) {
    return (
      <>
        <TitleBar isOverlay={true} />
        <Routes>
          <Route path="/watch/:type/:id" element={<WatchPage />} />
        </Routes>
      </>
    );
  }

  return (
    <div className={selectedMovie ? 'overflow-hidden h-screen' : ''}>
      <TitleBar isOverlay={isWatching} />
      <Layout
        searchQuery={query}
        setSearchQuery={handleSearchChange}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        showFooter={!query}
      >
        {/* Search Results Overlay Override */}
        {query.trim().length > 0 ? (
          <SearchResultsPage
            query={query}
            results={results}
            onSelectMovie={handleSelectMovie}
            onPlay={handlePlay}
            isLoading={isLoading}
          />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage onSelectMovie={handleSelectMovie} onPlay={handlePlay} seekTime={heroSeekTime} />} />
            <Route path="/tv" element={<ShowsPage onSelectMovie={handleSelectMovie} onPlay={handlePlay} />} />
            <Route path="/movies" element={<MoviesPage onSelectMovie={handleSelectMovie} onPlay={handlePlay} seekTime={heroSeekTime} />} />
            <Route path="/new" element={<NewPopularPage onSelectMovie={handleSelectMovie} />} />
            <Route path="/list" element={<MyListPage onSelectMovie={handleSelectMovie} />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/:section" element={<SettingsPage />} />
          </Routes>
        )}
      </Layout>

      <InfoModal
        movie={selectedMovie}
        initialTime={infoInitialTime}
        onClose={handleCloseModal}
        onPlay={handlePlay}
        trailerId={infoVideoId}
      />
    </div>
  );
}

export default App;
