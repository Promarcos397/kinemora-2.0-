import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types';

interface GlobalContextType {
  myList: Movie[];
  continueWatching: Movie[];
  toggleList: (movie: Movie) => void;
  addToHistory: (movie: Movie) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

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

  // Persist My List
  useEffect(() => {
    localStorage.setItem('kinemora-list', JSON.stringify(myList));
  }, [myList]);

  // Persist History
  useEffect(() => {
    localStorage.setItem('kinemora-history', JSON.stringify(continueWatching));
  }, [continueWatching]);

  const toggleList = (movie: Movie) => {
    setMyList((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  const addToHistory = (movie: Movie) => {
    setContinueWatching((prev) => {
      // Remove if exists to bubble it to the top
      const filtered = prev.filter((m) => m.id !== movie.id);
      // Add to front, limit to 20 items
      return [movie, ...filtered].slice(0, 20);
    });
  };

  return (
    <GlobalContext.Provider value={{ myList, continueWatching, toggleList, addToHistory }}>
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