import React from 'react';
import { REQUESTS } from '../constants';
import { Movie } from '../types';
import Row from '../components/Row';
import TopTenRow from '../components/TopTenRow';

interface PageProps {
  onSelectMovie: (movie: Movie) => void;
}

const NewPopularPage: React.FC<PageProps> = ({ onSelectMovie }) => {
  return (
    <div className="min-h-screen bg-[#141414]">
       {/* Spacer for fixed Navbar */}
      <div className="h-16 sm:h-20 md:h-24" />

      {/* Removed overflow-hidden */}
      <main className="relative z-10 pb-12 space-y-6 md:space-y-10 lg:space-y-12">
        
        <div className="px-6 md:px-14 lg:px-20 mt-2 mb-2">
             <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white drop-shadow-md">New & Popular</h1>
        </div>

        {/* New on Netflix - Standard landscape row */}
        <Row title="New on Netflix" fetchUrl={REQUESTS.fetchNetflixOriginals} onSelect={onSelectMovie} />

        {/* Top 10 TV Shows - Special Row */}
        <TopTenRow title="Top 10 TV Shows Today" fetchUrl={REQUESTS.fetchTrendingTV} onSelect={onSelectMovie} />

        {/* Top 10 Movies - Special Row */}
        <TopTenRow title="Top 10 Movies Today" fetchUrl={REQUESTS.fetchTrendingMovies} onSelect={onSelectMovie} />

        {/* Worth the Wait - Standard landscape row */}
        <Row title="Worth the Wait" fetchUrl={REQUESTS.fetchUpcoming} onSelect={onSelectMovie} />

        {/* Coming Soon - Extra row for fullness */}
        <Row title="Coming Soon" fetchUrl={REQUESTS.fetchActionMovies} onSelect={onSelectMovie} />

      </main>
    </div>
  );
};

export default NewPopularPage;