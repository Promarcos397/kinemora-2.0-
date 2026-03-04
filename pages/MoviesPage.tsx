import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { REQUESTS } from '../constants';
import { Movie } from '../types';
import HeroCarousel from '../components/HeroCarousel';
import Row from '../components/Row';
import CharacterRow from '../components/CharacterRow';
import CategorySubNav, { Genre } from '../components/CategorySubNav';
import { useGlobalContext } from '../context/GlobalContext';

interface PageProps {
  onSelectMovie: (movie: Movie, time?: number, videoId?: string) => void;
  onPlay: (movie: Movie) => void;
  seekTime?: number;
}

const MOVIE_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

const MoviesPage: React.FC<PageProps> = ({ onSelectMovie, onPlay, seekTime }) => {
  const { t } = useTranslation();
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const { continueWatching, isKidsMode } = useGlobalContext();

  return (
    <div className={`relative ${isKidsMode ? 'bg-[#141414]' : ''}`}>
      {/* Netflix-style sub-navigation: Overlaid on top of Hero */}
      <div className="absolute top-16 md:top-20 left-0 right-0 w-full z-40 pointer-events-auto">
        <CategorySubNav
          title={t('nav.movies', { defaultValue: 'Films' })}
          genres={isKidsMode ? MOVIE_GENRES.filter(g => [16, 35, 10751, 14, 12, 10762].includes(g.id)) : MOVIE_GENRES}
          selectedGenre={selectedGenre}
          onGenreSelect={setSelectedGenre}
        />
      </div>

      <HeroCarousel
        key="movies"
        onSelect={onSelectMovie}
        onPlay={onPlay}
        fetchUrl={isKidsMode ? REQUESTS.fetchKidsMoviesFamily : (selectedGenre ? REQUESTS.fetchByGenre('movie', selectedGenre.id, 'popularity.desc') : REQUESTS.fetchTopRated)}
        seekTime={seekTime}
      />

      <main className="relative z-10 pb-12 -mt-16 sm:-mt-24 md:-mt-36 space-y-4 md:space-y-6">
        {isKidsMode ? (
          <>
            <Row title="Family Movie Night" fetchUrl={REQUESTS.fetchKidsMoviesFamily} onSelect={onSelectMovie} />
            <CharacterRow onSelectMovie={onSelectMovie} />
            <Row title="Adventures Galore" fetchUrl={REQUESTS.fetchKidsMoviesAnimation} onSelect={onSelectMovie} />
          </>
        ) : !selectedGenre ? (
          // 1. No Genre Selected -> Netflix generic themed rows
          <>
            <Row title="Boredom Busters" fetchUrl={REQUESTS.fetchBoredomBustersMovies} onSelect={onSelectMovie} />
            <Row title={t('rows.topRated', { defaultValue: 'Top Rated' })} fetchUrl={REQUESTS.fetchTopRated} onSelect={onSelectMovie} />

            {continueWatching.length > 0 && (
              <Row title={t('rows.continueWatching', { defaultValue: 'Continue Watching' })} data={continueWatching} onSelect={onSelectMovie} />
            )}

            <Row title="Familiar Favourite Films" fetchUrl={REQUESTS.fetchFamiliarFavoritesMovies} onSelect={onSelectMovie} />
            <Row title="Exciting Films" fetchUrl={REQUESTS.fetchExcitingMovies} onSelect={onSelectMovie} />
            <Row title="We think you'll love these" fetchUrl={REQUESTS.fetchLoveTheseMovies} onSelect={onSelectMovie} />
          </>
        ) : (
          // 2. Genre Selected -> Specific to that genre
          <>
            <Row title={`${selectedGenre.name} Films`} fetchUrl={REQUESTS.fetchByGenre('movie', selectedGenre.id, 'popularity.desc')} onSelect={onSelectMovie} />
            <Row title={`Trending ${selectedGenre.name}`} fetchUrl={REQUESTS.fetchByGenre('movie', selectedGenre.id, 'vote_count.desc')} onSelect={onSelectMovie} />
            <Row title={`Critically Acclaimed ${selectedGenre.name}`} fetchUrl={REQUESTS.fetchByGenre('movie', selectedGenre.id, 'vote_average.desc')} onSelect={onSelectMovie} />
            <Row title={`Latest ${selectedGenre.name} Releases`} fetchUrl={REQUESTS.fetchByGenre('movie', selectedGenre.id, 'primary_release_date.desc')} onSelect={onSelectMovie} />
          </>
        )}
      </main>
    </div>
  );
};

export default MoviesPage;