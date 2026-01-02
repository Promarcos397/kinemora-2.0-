import React from 'react';
import { REQUESTS } from '../constants';
import { Movie } from '../types';
import HeroCarousel from '../components/HeroCarousel';
import Row from '../components/Row';

interface PageProps {
  onSelectMovie: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

const MoviesPage: React.FC<PageProps> = ({ onSelectMovie, onPlay }) => {
  return (
    <>
      <HeroCarousel onSelect={onSelectMovie} onPlay={onPlay} fetchUrl={REQUESTS.fetchTopRated} />
      {/* Removed overflow-hidden */}
      <main className="relative z-10 pb-12 -mt-12 sm:-mt-20 md:-mt-32 space-y-6 md:space-y-10">
        <Row title="Top Rated Movies" fetchUrl={REQUESTS.fetchTopRated} onSelect={onSelectMovie} />
        <Row title="Action Thrillers" fetchUrl={REQUESTS.fetchActionMovies} onSelect={onSelectMovie} />
        <Row title="Trending Now" fetchUrl={REQUESTS.fetchTrending} onSelect={onSelectMovie} />
        
        {/* Separated Genres */}
        <Row title="Sci-Fi & Fantasy" fetchUrl={REQUESTS.fetchSciFiMovies} onSelect={onSelectMovie} />
        <Row title="Comedy Hits" fetchUrl={REQUESTS.fetchComedyMovies} onSelect={onSelectMovie} />
        <Row title="Romance Movies" fetchUrl={REQUESTS.fetchRomanceMovies} onSelect={onSelectMovie} />
        <Row title="Scary Movies" fetchUrl={REQUESTS.fetchHorrorMovies} onSelect={onSelectMovie} />
      </main>
    </>
  );
};

export default MoviesPage;