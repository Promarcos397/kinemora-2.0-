import React, { useEffect, useState, useRef, useCallback } from 'react';
import YouTube from 'react-youtube';
import { Movie, Episode } from '../types';
import { IMG_PATH } from '../constants';
import { useGlobalContext } from '../context/GlobalContext';
import { fetchTrailer, fetchTrailers, getMovieCredits, getMovieDetails, getRecommendations, getSeasonDetails } from '../services/api';

interface InfoModalProps {
    movie: Movie | null;
    onClose: () => void;
    onPlay: (movie: Movie, season?: number, episode?: number) => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ movie, onClose, onPlay }) => {
    const { myList, toggleList } = useGlobalContext();
    const [detailedMovie, setDetailedMovie] = useState<Movie | null>(null);
    const [trailerQueue, setTrailerQueue] = useState<string[]>([]);
    const [isPlayingTrailer, setIsPlayingTrailer] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [cast, setCast] = useState<string[]>([]);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);

    // Episode / Season State
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [selectedSeason, setSelectedSeason] = useState(1);
    const [loadingEpisodes, setLoadingEpisodes] = useState(false);
    const [isSeasonDropdownOpen, setIsSeasonDropdownOpen] = useState(false);

    const playerRef = useRef<any>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Determine media type safely
    const mediaType = movie
        ? (movie.media_type || (movie.title ? 'movie' : 'tv')) as 'movie' | 'tv'
        : 'movie';

    // Close dropdown if clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSeasonDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (movie) {
            setDetailedMovie(null);
            setTrailerQueue([]);
            setIsPlayingTrailer(false);
            setCast([]);
            setRecommendations([]);
            setEpisodes([]);
            setSelectedSeason(1);
            setIsSeasonDropdownOpen(false);

            // 1. Fetch Full Details
            getMovieDetails(movie.id, mediaType).then(data => {
                if (data) setDetailedMovie(data);
            });

            // 2. Fetch Trailers (Queue)
            fetchTrailers(movie.id, mediaType).then(keys => {
                if (keys && keys.length > 0) {
                    setTrailerQueue(keys);
                    // setTrailerKey is deprecated, using queue
                }
            });

            // 3. Fetch Credits
            getMovieCredits(movie.id, mediaType).then(credits => {
                if (credits && credits.length > 0) {
                    setCast(credits.slice(0, 5).map((c: any) => c.name));
                }
            });

            // 4. Fetch Recommendations
            getRecommendations(movie.id, mediaType).then(recs => {
                setRecommendations(recs.slice(0, 12));
            });

            // 5. Fetch Episodes (if TV)
            if (mediaType === 'tv') {
                fetchEpisodes(movie.id, 1);
            }
        }
    }, [movie, mediaType]);

    const fetchEpisodes = useCallback(async (id: number, season: number) => {
        setLoadingEpisodes(true);
        const eps = await getSeasonDetails(id, season);
        setEpisodes(eps);
        setLoadingEpisodes(false);
    }, []);

    // Handle Season Change Trigger
    useEffect(() => {
        if (mediaType === 'tv' && movie) {
            fetchEpisodes(movie.id, selectedSeason);
        }
    }, [selectedSeason, mediaType, movie, fetchEpisodes]);

    useEffect(() => {
        if (playerRef.current) {
            if (isMuted) playerRef.current.mute();
            else playerRef.current.unMute();
        }
    }, [isMuted]);

    if (!movie) return null;

    const activeMovie = detailedMovie || movie;
    const isAdded = myList.find(m => m.id === movie.id);

    const year = (activeMovie.release_date || activeMovie.first_air_date)?.substring(0, 4) || "";

    const duration = activeMovie.runtime
        ? `${Math.floor(activeMovie.runtime / 60)}h ${activeMovie.runtime % 60}m`
        : activeMovie.number_of_seasons
            ? `${activeMovie.number_of_seasons} Season${activeMovie.number_of_seasons > 1 ? 's' : ''}`
            : "";

    const genreNames = activeMovie.genres
        ? activeMovie.genres.map(g => g.name).slice(0, 3).join(', ')
        : activeMovie.genre_ids?.map(id => "Genre").slice(0, 3).join(', ');

    const handleRecommendationClick = (rec: Movie) => {
        onClose();
    };

    const handlePlayClick = () => {
        if (mediaType === 'tv') {
            // Play S1E1 or selectedSeason E1
            onPlay(activeMovie, selectedSeason, 1);
        } else {
            onPlay(activeMovie);
        }
    };

    const totalSeasons = activeMovie.number_of_seasons || 1;

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/60 flex justify-center overflow-y-auto backdrop-blur-sm scrollbar-hide animate-fadeIn"
            onClick={onClose}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-[850px] bg-[#181818] rounded-xl shadow-2xl mt-8 mb-8 overflow-hidden animate-slideUp h-fit mx-4 ring-1 ring-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 bg-[#181818] p-1.5 rounded-full hover:bg-[#2a2a2a] transition flex items-center justify-center border border-transparent hover:border-white/20"
                >
                    <span className="material-icons text-white text-xl">close</span>
                </button>

                {/* --- Hero Section --- */}
                <div className="relative h-[250px] sm:h-[350px] md:h-[480px] w-full bg-black group">
                    {!isPlayingTrailer ? (
                        <>
                            <div className="absolute inset-0">
                                <img
                                    src={`${IMG_PATH}${activeMovie.backdrop_path || activeMovie.poster_path}`}
                                    className="w-full h-full object-cover"
                                    alt="modal hero"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
                            </div>

                            <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 space-y-4 md:space-y-6">
                                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white drop-shadow-xl w-[80%] leading-none mb-2">
                                    {activeMovie.title || activeMovie.name}
                                </h2>

                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={handlePlayClick}
                                        className="bg-white text-black px-6 sm:px-8 h-10 sm:h-12 rounded-[4px] font-bold text-base sm:text-lg flex items-center hover:bg-gray-200 transition"
                                    >
                                        <span className="material-icons text-2xl mr-2">play_arrow</span>
                                        Play
                                    </button>
                                    <button
                                        onClick={() => toggleList(activeMovie)}
                                        className="border-2 border-gray-500 bg-[#2a2a2a]/60 text-gray-300 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center hover:border-white hover:text-white transition"
                                        title={isAdded ? "Remove from List" : "Add to List"}
                                    >
                                        <span className="material-icons text-xl sm:text-2xl">{isAdded ? 'check' : 'add'}</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="w-full h-full relative">
                            {trailerQueue.length > 0 ? (
                                <YouTube
                                    videoId={trailerQueue[0]}
                                    className="w-full h-full"
                                    onEnd={() => setIsPlayingTrailer(false)}
                                    onReady={(e) => {
                                        playerRef.current = e.target;
                                        if (isMuted) e.target.mute();
                                        else e.target.unMute();
                                    }}
                                    onError={(e) => {
                                        console.warn("InfoModal Video error, trying next...", e);
                                        setTrailerQueue(prev => {
                                            const newQueue = prev.slice(1);
                                            if (newQueue.length === 0) {
                                                setIsPlayingTrailer(false);
                                            }
                                            return newQueue;
                                        });
                                    }}
                                    opts={{
                                        width: '100%',
                                        height: '100%',
                                        playerVars: {
                                            autoplay: 1,
                                            modestbranding: 1,
                                            rel: 0,
                                        }
                                    }}
                                />
                            ) : (
                                // Should practically not happen if isPlayingTrailer is managed correctly, but as safety:
                                <div className="w-full h-full bg-black flex items-center justify-center text-white">
                                    <p>Video unavailable</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* --- Details Body --- */}
                <div className="px-6 md:px-12 pb-12 bg-[#181818]">
                    <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-x-8 gap-y-6">

                        {/* Left Column: Stats & Description */}
                        <div className="space-y-4">
                            {/* Metadata Row */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-white font-medium text-sm md:text-base mt-2">
                                <span className="text-[#46d369] font-bold">{((activeMovie.vote_average || 0) * 10).toFixed(0)}% Match</span>
                                <span className="text-gray-400 font-light">{year}</span>
                                <span className="text-gray-400 font-light">{duration}</span>
                                <span className="border border-gray-500 px-1.5 py-0.5 text-[10px] rounded-[2px] text-gray-400 h-fit leading-none">HD</span>
                            </div>

                            {/* Age & Warning Row */}
                            <div className="flex items-center gap-3">
                                <span className="border border-white/40 bg-transparent text-white px-2 py-0.5 text-sm font-medium uppercase">
                                    {activeMovie.adult ? '18+' : '13+'}
                                </span>
                                {activeMovie.adult && <span className="text-sm text-gray-400">violence, language, gore</span>}
                                {!activeMovie.adult && <span className="text-sm text-gray-400">language, mild themes</span>}
                            </div>

                            <p className="text-white text-sm md:text-[15px] leading-relaxed pt-2">
                                {activeMovie.overview}
                            </p>
                        </div>

                        {/* Right Column: Cast & Genres */}
                        <div className="text-sm space-y-3 pt-2">
                            <div className="flex flex-wrap gap-1">
                                <span className="text-gray-500">Cast:</span>
                                {cast.slice(0, 4).map((name, i) => (
                                    <span key={i} className="text-white hover:underline cursor-pointer">{name}{i < cast.slice(0, 4).length - 1 ? ',' : ''}</span>
                                ))}
                            </div>
                            <div className="flex flex-wrap gap-1">
                                <span className="text-gray-500">Genres:</span>
                                <span className="text-white">{genreNames}</span>
                            </div>
                        </div>
                    </div>

                    {/* --- Episodes Section (TV Only) --- */}
                    {mediaType === 'tv' && (
                        <div className="mt-10">
                            <div className="flex items-center justify-between mb-4 border-b border-gray-700 pb-2">
                                <h3 className="text-xl md:text-2xl font-bold text-white">Episodes</h3>

                                {/* Season Dropdown */}
                                {totalSeasons > 0 && (
                                    <div className="relative" ref={dropdownRef}>
                                        <button
                                            onClick={() => setIsSeasonDropdownOpen(!isSeasonDropdownOpen)}
                                            className="flex items-center bg-[#242424] border border-gray-600 rounded px-3 py-1.5 text-sm font-bold hover:bg-[#333] transition min-w-[120px] justify-between"
                                        >
                                            Season {selectedSeason}
                                            <span className="material-icons ml-2 text-base">
                                                {isSeasonDropdownOpen ? 'arrow_drop_up' : 'arrow_drop_down'}
                                            </span>
                                        </button>

                                        {isSeasonDropdownOpen && (
                                            <div className="absolute right-0 top-full mt-1 w-32 bg-[#242424] border border-gray-700 rounded shadow-xl z-50 max-h-60 overflow-y-auto scrollbar-hide">
                                                {Array.from({ length: totalSeasons }, (_, i) => i + 1).map(s => (
                                                    <div
                                                        key={s}
                                                        onClick={() => {
                                                            setSelectedSeason(s);
                                                            setIsSeasonDropdownOpen(false);
                                                        }}
                                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#404040] ${selectedSeason === s ? 'bg-[#333] font-bold text-white' : 'text-gray-300'}`}
                                                    >
                                                        Season {s}
                                                        {selectedSeason === s && <span className="hidden">✓</span>}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 max-h-[400px] overflow-y-auto scrollbar-hide pr-2">
                                {loadingEpisodes ? (
                                    <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>
                                ) : episodes.length > 0 ? (
                                    episodes.map((ep) => (
                                        <div
                                            key={ep.id}
                                            onClick={() => onPlay(activeMovie, selectedSeason, ep.episode_number)}
                                            className="flex items-center group cursor-pointer p-4 rounded-md hover:bg-[#333] transition border-b border-gray-800 last:border-0"
                                        >
                                            <div className="text-gray-400 text-xl font-medium w-8 text-center flex-shrink-0 mr-4">
                                                {ep.episode_number}
                                            </div>
                                            <div className="relative w-28 h-16 md:w-36 md:h-20 bg-gray-800 flex-shrink-0 rounded overflow-hidden mr-4">
                                                {ep.still_path ? (
                                                    <img src={`${IMG_PATH}${ep.still_path}`} className="w-full h-full object-cover" alt={ep.name} />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                                )}
                                                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition" />
                                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                                    <div className="bg-white/90 rounded-full p-1 shadow-lg">
                                                        <span className="material-icons text-black text-sm md:text-base">play_arrow</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="text-white font-bold text-sm md:text-base truncate pr-4">{ep.name}</h4>
                                                    <span className="text-gray-400 text-xs whitespace-nowrap">{ep.runtime ? `${ep.runtime}m` : ''}</span>
                                                </div>
                                                <p className="text-gray-400 text-xs md:text-sm line-clamp-2 leading-relaxed">
                                                    {ep.overview || "No description available."}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-center py-6">No episodes information available.</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* --- More Like This Section --- */}
                    {recommendations.length > 0 && (
                        <div className="mt-10">
                            <h3 className="text-xl md:text-2xl font-bold text-white mb-4">More Like This</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:gap-4">
                                {recommendations.map(rec => (
                                    <div key={rec.id} className="bg-[#2f2f2f] rounded-md overflow-hidden shadow-lg cursor-pointer hover:bg-[#404040] transition relative group" onClick={() => handleRecommendationClick(rec)}>
                                        <div className="relative aspect-video">
                                            <img
                                                src={`https://image.tmdb.org/t/p/w500${rec.backdrop_path || rec.poster_path}`}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition"
                                                alt={rec.title}
                                            />
                                            <div className="absolute top-2 right-2 text-white font-bold drop-shadow-md text-xs">
                                                {(rec.vote_average * 10).toFixed(0)}% Match
                                            </div>
                                        </div>
                                        <div className="p-3">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1 pr-2">
                                                    <div className="flex items-center space-x-2 text-xs text-gray-400 mb-1">
                                                        <span className="border border-gray-500 px-1 rounded-[2px]">13+</span>
                                                        <span>{(rec.release_date || rec.first_air_date)?.substring(0, 4)}</span>
                                                    </div>
                                                    <p className="text-sm font-semibold text-gray-200 line-clamp-2 h-10 leading-tight">
                                                        {rec.overview || "No description available."}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default InfoModal;