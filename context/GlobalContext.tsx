import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '../types';

interface GlobalContextType {
  myList: Movie[];
  toggleList: (movie: Movie) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [myList, setMyList] = useState<Movie[]>(() => {
    try {
      const saved = localStorage.getItem('kinemora-list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('kinemora-list', JSON.stringify(myList));
  }, [myList]);

  const toggleList = (movie: Movie) => {
    setMyList((prev) => {
      const exists = prev.find((m) => m.id === movie.id);
      if (exists) {
        return prev.filter((m) => m.id !== movie.id);
      }
      return [...prev, movie];
    });
  };

  return (
    <GlobalContext.Provider value={{ myList, toggleList }}>
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