import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { Movie } from './types';
import useSearch from './hooks/useSearch';
import { useTitle } from './context/TitleContext';
import { useGlobalContext } from './context/GlobalContext';
import { prefetchStream } from './services/api';

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
import CharactersPage from './pages/CharactersPage';
import ProfileSelection from './pages/ProfileSelection';

const App: React.FC = () => {
  const [profileGatePassed, setProfileGatePassed] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { query, setQuery, results, isLoading, mode, setMode } = useSearch();
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

  // Prefetch last played on mount
  useEffect(() => {
    try {
      const last = localStorage.getItem('kinemora-last-played');
      if (last) {
        const data = JSON.parse(last);
        if (data.id && data.title && data.year) {
          prefetchStream(data.title, data.year, String(data.id), data.type, data.season, data.episode);
          console.log('[App] Prefetching last played:', data.title);
        }
      }
    } catch (e) { }
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
      setPageTitle('Films');
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

    // Save last played for preloading on next app start
    const releaseDate = movie.release_date || movie.first_air_date;
    const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;
    localStorage.setItem('kinemora-last-played', JSON.stringify({
      id: movie.id,
      title: movie.title || movie.name,
      type,
      year,
      season: season || 1,
      episode: episode || 1,
      timestamp: Date.now()
    }));

    navigate(url);
    setSelectedMovie(null);
  };

  // Prefetch last played on app start
  useEffect(() => {
    const lastPlayed = localStorage.getItem('kinemora-last-played');
    if (lastPlayed) {
      try {
        const { title, type, year, season, episode, timestamp } = JSON.parse(lastPlayed);
        // Only prefetch if played within last 7 days
        if (Date.now() - timestamp < 7 * 24 * 60 * 60 * 1000) {
          const api = (window as any).electron?.pstream;
          if (api?.prefetchStream) {
            console.log('[App] Prefetching last played:', title);
            api.prefetchStream(title, type, year, season, episode);
          }
        }
      } catch (e) { /* ignore */ }
    }
  }, []);

  // Determine active tab for Layout based on path
  const getActiveTab = () => {
    const path = location.pathname;
    if (path === '/') return 'home';
    if (path === '/tv') return 'tv';
    if (path === '/movies') return 'movies';
    if (path === '/new') return 'new';
    if (path === '/list') return 'list';
    if (path === '/characters') return 'characters';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const activeTab = getActiveTab();
  const isWatching = location.pathname.startsWith('/watch');

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

  if (!profileGatePassed) {
    return (
      <div className="h-screen bg-[#141414]">
        <TitleBar isOverlay={true} />
        <ProfileSelection onSelected={() => setProfileGatePassed(true)} />
      </div>
    );
  }

  return (
    <div className={`pt-8 ${selectedMovie ? 'overflow-hidden h-screen' : ''}`}>
      <TitleBar isOverlay={false} />
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
            mode={mode}
            setMode={setMode}
          />
        ) : (
          <Routes>
            <Route path="/" element={<HomePage onSelectMovie={handleSelectMovie} onPlay={handlePlay} seekTime={heroSeekTime} />} />
            <Route path="/characters" element={<CharactersPage onSelectMovie={handleSelectMovie} onPlay={handlePlay} seekTime={heroSeekTime} />} />
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
