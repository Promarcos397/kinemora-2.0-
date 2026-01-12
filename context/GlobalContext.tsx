import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Movie, AppSettings } from '../types';
import { setApiLanguage } from '../services/api';

interface VideoState {
  time: number;
  videoId?: string;
}

interface GlobalContextType {
  myList: Movie[];
  continueWatching: Movie[];
  settings: AppSettings;
  toggleList: (movie: Movie) => void;
  addToHistory: (movie: Movie) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  videoStates: { [key: number]: VideoState };
  updateVideoState: (movieId: number, time: number, videoId?: string) => void;
  getVideoState: (movieId: number) => VideoState | undefined;
  clearVideoState: (movieId: number) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const DEFAULT_SETTINGS: AppSettings = {
  autoplayPreviews: true,
  autoplayNextEpisode: true,
  showSubtitles: true,
  subtitleSize: 'medium',
  subtitleColor: 'white',
  subtitleBackground: 'none', // Default Window OFF
  subtitleOpacity: 75,
  subtitleBlur: 0,
  subtitleFontFamily: 'monospace', // Consolas default
  subtitleEdgeStyle: 'drop-shadow', // Drop shadow effect
  subtitleWindowColor: 'black',
  displayLanguage: 'en-US',  // Default TMDB content language
  subtitleLanguage: 'en',    // Default subtitle language
};

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // My List State
  const [myList, setMyList] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('kinemora-list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Continue Watching History State
  const [continueWatching, setContinueWatching] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('kinemora-history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('kinemora-settings');
      // Merge with defaults to ensure new fields (opacity/blur) exist if loading old localstorage
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // Video Sync State (Ephemeral) - Now stores both time AND videoId
  const [videoStates, setVideoStates] = useState<{ [key: number]: VideoState }>({});

  // Persist My List
  useEffect(() => {
    localStorage.setItem('kinemora-list', JSON.stringify(myList));
  }, [myList]);

  // Persist History
  useEffect(() => {
    localStorage.setItem('kinemora-history', JSON.stringify(continueWatching));
  }, [continueWatching]);

  // Persist Settings
  useEffect(() => {
    localStorage.setItem('kinemora-settings', JSON.stringify(settings));
  }, [settings]);

  // Sync API language with settings
  useEffect(() => {
    setApiLanguage(settings.displayLanguage);
  }, [settings.displayLanguage]);

  const toggleList = useCallback((movie: Movie) => {
    setMyList((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  }, []);

  const addToHistory = useCallback((movie: Movie) => {
    setContinueWatching((prev) => {
      // Prevent redundant updates if the movie is already at the top
      if (prev.length > 0 && prev[0].id === movie.id) {
        return prev;
      }
      // Remove if exists to bubble it to the top
      const filtered = prev.filter((m) => m.id !== movie.id);
      // Add to front, limit to 20 items
      return [movie, ...filtered].slice(0, 20);
    });
  }, []);

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Updated function to store both time and videoId
  const updateVideoState = useCallback((movieId: number, time: number, videoId?: string) => {
    setVideoStates(prev => ({
      ...prev,
      [movieId]: { time, videoId: videoId || prev[movieId]?.videoId }
    }));
  }, []);

  const getVideoState = useCallback((movieId: number): VideoState | undefined => {
    return videoStates[movieId];
  }, [videoStates]);

  const clearVideoState = useCallback((movieId: number) => {
    setVideoStates(prev => {
      const next = { ...prev };
      delete next[movieId];
      return next;
    });
  }, []);

  return (
    <GlobalContext.Provider value={{
      myList,
      continueWatching,
      settings,
      toggleList,
      addToHistory,
      updateSettings,
      videoStates,
      updateVideoState,
      getVideoState,
      clearVideoState
    }}>
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};
