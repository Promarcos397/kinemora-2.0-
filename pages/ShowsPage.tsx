import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { REQUESTS } from '../constants';
import { Movie } from '../types';
import HeroCarousel from '../components/HeroCarousel';
import Row from '../components/Row';
import CategorySubNav, { Genre } from '../components/CategorySubNav';
import { useGlobalContext } from '../context/GlobalContext';

const TV_GENRES = [
    { id: 10759, name: 'Action & Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 10762, name: 'Kids' },
    { id: 9648, name: 'Mystery' },
    { id: 10763, name: 'News' },
    { id: 10764, name: 'Reality' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10766, name: 'Soap' },
    { id: 10767, name: 'Talk' },
    { id: 10768, name: 'War & Politics' },
    { id: 37, name: 'Western' },
];

interface PageProps {
    onSelectMovie: (movie: Movie, time?: number, videoId?: string) => void;
    onPlay: (movie: Movie) => void;
}

const ShowsPage: React.FC<PageProps> = ({ onSelectMovie, onPlay }) => {
    const { t } = useTranslation();
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
    const { isKidsMode } = useGlobalContext();

    return (
        <div className={`relative ${isKidsMode ? 'bg-[#141414]' : ''}`}>
            {/* Netflix-style sub-navigation: Overlaid on top of Hero */}
            <div className="absolute top-16 md:top-20 left-0 right-0 w-full z-40 pointer-events-auto">
                <CategorySubNav
                    title={t('nav.shows', { defaultValue: 'Series' })}
                    genres={isKidsMode ? TV_GENRES.filter(g => [16, 35, 10751, 10762, 10759, 99].includes(g.id)) : TV_GENRES}
                    selectedGenre={selectedGenre}
                    onGenreSelect={setSelectedGenre}
                />
            </div>

            <HeroCarousel
                key="shows"
                fetchUrl={isKidsMode ? REQUESTS.fetchKidsHero : (selectedGenre ? REQUESTS.fetchByGenre('tv', selectedGenre.id, 'popularity.desc') : REQUESTS.fetchTrendingTV)}
                onSelect={onSelectMovie}
                onPlay={onPlay}
            />
            <main className="relative z-10 pb-12 -mt-16 sm:-mt-24 md:-mt-36 space-y-4 md:space-y-6">
                {isKidsMode ? (
                    <>
                        <Row title="Start Watching" fetchUrl={REQUESTS.fetchKidsHero} onSelect={onSelectMovie} />
                        <Row title="Fairies, Fiends, Film Time!" fetchUrl={REQUESTS.fetchKidsTVPlayful} onSelect={onSelectMovie} />
                        <Row title="Calm and Gentle" fetchUrl={REQUESTS.fetchKidsTVFamily} onSelect={onSelectMovie} />
                        <Row title="Trending Now" fetchUrl={REQUESTS.fetchKidsTVTrending} onSelect={onSelectMovie} />
                    </>
                ) : !selectedGenre ? (
                    // 1. No Genre Selected -> Netflix generic themed rows
                    <>
                        <Row title="Boredom Busters" fetchUrl={REQUESTS.fetchBoredomBustersTV} onSelect={onSelectMovie} />
                        <Row title="US Series" fetchUrl={REQUESTS.fetchUSSeries} onSelect={onSelectMovie} />
                        <Row title="Familiar Favourite Series" fetchUrl={REQUESTS.fetchFamiliarFavoritesTV} onSelect={onSelectMovie} />
                        <Row title="Exciting Series" fetchUrl={REQUESTS.fetchExcitingSeriesTV} onSelect={onSelectMovie} />
                        <Row title="We think you'll love these" fetchUrl={REQUESTS.fetchLoveTheseTV} onSelect={onSelectMovie} />
                        <Row title={t('rows.netflixOriginals', { defaultValue: 'Netflix Originals' })} fetchUrl={REQUESTS.fetchNetflixOriginals} onSelect={onSelectMovie} />
                    </>
                ) : (
                    // 2. Genre Selected -> Specific to that genre
                    <>
                        <Row title={`${selectedGenre.name} Series`} fetchUrl={REQUESTS.fetchByGenre('tv', selectedGenre.id, 'popularity.desc')} onSelect={onSelectMovie} />
                        <Row title={`Trending ${selectedGenre.name}`} fetchUrl={REQUESTS.fetchByGenre('tv', selectedGenre.id, 'vote_count.desc')} onSelect={onSelectMovie} />
                        <Row title={`Critically Acclaimed ${selectedGenre.name}`} fetchUrl={REQUESTS.fetchByGenre('tv', selectedGenre.id, 'vote_average.desc')} onSelect={onSelectMovie} />
                        <Row title={`Latest ${selectedGenre.name} Releases`} fetchUrl={REQUESTS.fetchByGenre('tv', selectedGenre.id, 'first_air_date.desc')} onSelect={onSelectMovie} />
                    </>
                )}
            </main>
        </div>
    );
};

export default ShowsPage;
