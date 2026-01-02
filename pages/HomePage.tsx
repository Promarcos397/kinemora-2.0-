import React, { useState, useEffect } from 'react';
import { REQUESTS } from '../constants';
import { Movie } from '../types';
import HeroCarousel from '../components/HeroCarousel';
import Row from '../components/Row';
import { useGlobalContext } from '../context/GlobalContext';
import { getRecommendations } from '../services/api';

interface PageProps {
  onSelectMovie: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
}

const HomePage: React.FC<PageProps> = ({ onSelectMovie, onPlay }) => {
  const { myList, continueWatching } = useGlobalContext();
  const [recommendationMovie, setRecommendationMovie] = useState<Movie | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);

  // Pick a random movie from 'My List' and fetch recommendations for it
  useEffect(() => {
    if (myList.length > 0) {
        const randomMovie = myList[Math.floor(Math.random() * myList.length)];
        setRecommendationMovie(randomMovie);
        
        const fetchRecs = async () => {
            const type = (randomMovie.media_type || (randomMovie.title ? 'movie' : 'tv')) as 'movie' | 'tv';
            const recs = await getRecommendations(randomMovie.id, type);
            setRecommendations(recs);
        };
        fetchRecs();
    }
  }, [myList.length]);
  
  return (
    <>
      <HeroCarousel onSelect={onSelectMovie} onPlay={onPlay} fetchUrl={REQUESTS.fetchNetflixOriginals} />
      {/* Main Content */}
      <main className="relative z-10 pb-12 -mt-12 sm:-mt-20 md:-mt-32 space-y-6 md:space-y-10">
        
        {/* Continue Watching Row - Pinned to top if exists */}
        {continueWatching.length > 0 && (
            <Row title="Continue Watching" data={continueWatching} onSelect={onSelectMovie} />
        )}

        {myList.length > 0 && <Row title="My List" data={myList} onSelect={onSelectMovie} />}
        
        {/* Dynamic Recommendation Row */}
        {recommendationMovie && recommendations.length > 0 && (
            <Row 
                title={`Because you added ${recommendationMovie.title || recommendationMovie.name}`} 
                data={recommendations} 
                onSelect={onSelectMovie} 
            />
        )}

        <Row title="Trending Now" fetchUrl={REQUESTS.fetchTrending} onSelect={onSelectMovie} />
        <Row title="Action Movies" fetchUrl={REQUESTS.fetchActionMovies} onSelect={onSelectMovie} />
        <Row title="Netflix Originals" fetchUrl={REQUESTS.fetchNetflixOriginals} onSelect={onSelectMovie} />
        
        {/* Separated Genres */}
        <Row title="Romance Movies" fetchUrl={REQUESTS.fetchRomanceMovies} onSelect={onSelectMovie} />
        <Row title="Comedies" fetchUrl={REQUESTS.fetchComedyMovies} onSelect={onSelectMovie} />
        <Row title="Sci-Fi Hits" fetchUrl={REQUESTS.fetchSciFiMovies} onSelect={onSelectMovie} />
        <Row title="Documentaries" fetchUrl={REQUESTS.fetchDocumentaries} onSelect={onSelectMovie} />
        <Row title="Scary Movies" fetchUrl={REQUESTS.fetchHorrorMovies} onSelect={onSelectMovie} />
      </main>
    </>
  );
};

export default HomePage;