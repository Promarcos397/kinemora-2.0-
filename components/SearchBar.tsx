import React, { useState, useRef, useEffect } from 'react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  const [isActive, setIsActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus when active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isActive]);

  // Click outside to collapse
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        if (!searchQuery) {
          setIsActive(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchQuery]);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    setSearchQuery('');
    inputRef.current?.focus();
  };

  const toggleSearch = () => setIsActive(!isActive);

  return (
    <div 
      ref={containerRef}
      className={`relative flex items-center transition-all duration-300 ease-out
        ${isActive || searchQuery 
            ? 'bg-black/80 border border-white w-full' 
            : 'bg-transparent border border-transparent w-8'} 
        p-1 overflow-hidden`}
    >
      <button 
        onClick={toggleSearch} 
        className="focus:outline-none flex items-center justify-center z-10 shrink-0"
        aria-label="Toggle Search"
      >
         <span className={`material-icons cursor-pointer select-none text-xl md:text-2xl transition-colors duration-300 ${isActive || searchQuery ? 'text-white' : 'text-white hover:text-gray-300'}`}>
           search
         </span>
      </button>
      
      <input 
        ref={inputRef}
        type="text" 
        placeholder="Titles, people, genres"
        className={`bg-transparent border-none outline-none text-white text-xs md:text-sm ml-2 transition-all duration-300 
          ${isActive || searchQuery ? 'w-32 sm:w-48 md:w-60 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Clear Button */}
      <span 
          className={`material-icons text-white hover:text-gray-300 cursor-pointer text-lg mx-1 transition-opacity duration-300
              ${searchQuery && isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onMouseDown={handleClear}
      >
          close
      </span>
    </div>
  );
};

export default SearchBar;