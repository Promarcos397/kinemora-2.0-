import React, { useState, useRef, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Movie } from '../types';
import { useGlobalContext } from '../context/GlobalContext';
import { GENRES, LOGO_SIZE } from '../constants';
import { fetchTrailer, getMovieImages } from '../services/api';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie) => void;
  isGrid?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect, isGrid = false }) => {
  const { myList, toggleList } = useGlobalContext();
  const [isHovered, setIsHovered] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  // 'center' | 'left' | 'right' - determines expansion direction
  const [hoverPosition, setHoverPosition] = useState<'center' | 'left' | 'right'>('center');
  
  const isAdded = myList.find(m => m.id === movie.id);
  const timerRef = useRef<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);

  // --- Dynamic Badge Logic ---
  const getBadgeInfo = () => {
    const dateStr = movie.release_date || movie.first_air_date;
    if (!dateStr) return null;

    const releaseDate = new Date(dateStr);
    const now = new Date();
    // Calculate difference in days
    const diffTime = releaseDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Future Release
    if (diffDays > 0) {
        return { text: "COMING SOON", type: "upcoming" };
    }

    // Released within last 60 days
    if (diffDays >= -60) {
        return { 
            text: movie.media_type === 'tv' ? "NEW EPISODES" : "RECENTLY ADDED", 
            type: "new" 
        };
    }

    // High Rating (Top Rated)
    if (movie.vote_average >= 8.0) {
        return { text: "TOP RATED", type: "top" };
    }

    return null;
  };

  const badge = getBadgeInfo();

  // Fetch Logo on mount
  useEffect(() => {
    let isMounted = true;
    const fetchLogo = async () => {
        try {
            const mediaType = (movie.media_type || (movie.title ? 'movie' : 'tv')) as 'movie' | 'tv';
            const data = await getMovieImages(movie.id, mediaType);
            
            if (!isMounted) return;

            if (data && data.logos) {
                const logo = data.logos.find((l: any) => l.iso_639_1 === 'en' || l.iso_639_1 === null);
                if (logo) {
                    setLogoUrl(`https://image.tmdb.org/t/p/${LOGO_SIZE}${logo.file_path}`);
                }
            }
        } catch (e) { }
    };

    fetchLogo();
    return () => { isMounted = false; };
  }, [movie.id, movie.media_type, movie.title]);

  // Sync mute state with player instance
  useEffect(() => {
    if (playerRef.current) {
        if (isMuted) {
            playerRef.current.mute();
        } else {
            playerRef.current.unMute();
        }
    }
  }, [isMuted]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (isGrid) return; // Disable hover effect on grid views to avoid clutter

    // Determine screen position for smart popup alignment
    if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const buffer = 150; // Increased buffer for wider popup

        if (rect.left < buffer) {
            setHoverPosition('left');
        } else if (rect.right > windowWidth - buffer) {
            setHoverPosition('right');
        } else {
            setHoverPosition('center');
        }
    }

    timerRef.current = setTimeout(async () => {
      setIsHovered(true);
      try {
        const mediaType = (movie.media_type || (movie.title ? 'movie' : 'tv')) as 'movie' | 'tv';
        const trailerKey = await fetchTrailer(movie.id, mediaType);
        if (trailerKey) {
            setTrailerUrl(trailerKey);
        }
      } catch (e) { }
    }, 600); // 600ms delay like Netflix
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsHovered(false);
    setTrailerUrl("");
    setIsMuted(false);
    playerRef.current = null;
  };

  const getGenreNames = () => {
    if (!movie.genre_ids) return [];
    return movie.genre_ids.map(id => GENRES[id]).filter(Boolean).slice(0, 3);
  };

  // Dynamic Class Calculation
  const getPositionClasses = () => {
      switch (hoverPosition) {
          case 'left': return 'left-0 origin-left';
          case 'right': return 'right-0 origin-right';
          default: return 'left-1/2 -ml-[150px] md:-ml-[180px] origin-center';
      }
  };

  return (
    <div 
      ref={cardRef}
      className={`relative transition-all duration-300 z-10 
        ${isGrid 
            ? 'w-full aspect-video cursor-pointer hover:z-50' 
            : 'flex-none w-[180px] h-[101px] md:w-[240px] md:h-[135px] cursor-pointer hover:z-[40]'
        }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(movie)}
    >
      {/* Base Image */}
      <img 
        src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`} 
        className={`w-full h-full object-cover ${isGrid ? 'rounded-md' : 'rounded-sm md:rounded-md'}`}
        alt={movie.name || movie.title}
        loading="lazy"
      />
      
      {/* Base Title Overlay (Show when not hovering OR if in grid mode) */}
      {!isHovered && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent rounded-b-md flex items-end justify-center pb-2 px-2 opacity-100 transition-opacity duration-300">
                {logoUrl ? (
                    <img src={logoUrl} alt={movie.title || movie.name} className="h-full max-h-8 w-auto object-contain drop-shadow-md" />
                ) : (
                    <h3 className="text-white text-[10px] font-bold drop-shadow-md line-clamp-2 leading-tight text-center">
                        {movie.title || movie.name}
                    </h3>
                )}
            </div>

            {/* Dynamic Badges on Base Card */}
            {badge && (
                 <div className={`absolute top-2 left-2 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm 
                    ${badge.type === 'upcoming' 
                        ? 'bg-black/60 border border-white/40 backdrop-blur-sm' // Coming Soon Style
                        : 'bg-[#E50914]' // New/Top Rated Style (Red)
                    }`}>
                     {badge.text}
                 </div>
            )}
          </>
      )}

      {/* Hover Popup - Only active if NOT grid */}
      {isHovered && !isGrid && (
        <div 
          className={`absolute top-[-70px] md:top-[-100px] w-[300px] md:w-[360px] bg-[#141414] rounded-md shadow-black/80 shadow-2xl z-[40] animate-scaleIn overflow-hidden ring-1 ring-zinc-800 ${getPositionClasses()}`}
          onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to base card
        >
          {/* Media Container */}
          <div className="relative h-[170px] md:h-[200px] bg-[#141414]" onClick={() => onSelect(movie)}>
            {trailerUrl ? (
              <YouTube 
                videoId={trailerUrl} 
                opts={{ 
                    height: '100%', 
                    width: '100%', 
                    playerVars: { 
                        autoplay: 1, 
                        controls: 0, 
                        modestbranding: 1, 
                        loop: 1, 
                        playlist: trailerUrl,
                    } 
                }} 
                onReady={(e) => {
                  playerRef.current = e.target;
                  if (isMuted) {
                      e.target.mute();
                  } else {
                      e.target.unMute();
                  }
                }}
                className="w-full h-full object-cover pointer-events-none transform scale-[1.35]"
              />
            ) : (
              <img src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`} className="w-full h-full object-cover" alt="preview" />
            )}
            
            {/* Mute Button */}
            {trailerUrl && (
                <button 
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="absolute bottom-4 right-4 w-8 h-8 rounded-full border border-white/30 bg-black/50 hover:bg-white/10 flex items-center justify-center transition"
                >
                    <span className="material-icons text-white text-xs">{isMuted ? 'volume_off' : 'volume_up'}</span>
                </button>
            )}

            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#141414] to-transparent" />
            
             <div className="absolute bottom-3 left-4 right-12 pointer-events-none">
                {logoUrl ? (
                    <img src={logoUrl} alt="title logo" className="h-10 w-auto object-contain origin-bottom-left drop-shadow-md" />
                ) : (
                    <h4 className="text-white font-bold drop-shadow-md text-lg line-clamp-1">{movie.title || movie.name}</h4>
                )}
             </div>
          </div>

          {/* Info Section */}
          <div className="p-4 space-y-3 bg-[#141414]">
            {/* Action Buttons Row */}
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                {/* Play Button - Solid White */}
                <button 
                  onClick={() => onSelect(movie)}
                  className="bg-white text-black rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-neutral-200 transition"
                >
                  <span className="material-icons text-2xl md:text-3xl ml-0.5">play_arrow</span>
                </button>
                {/* Add to List - Outline */}
                <button 
                  onClick={(e) => { e.stopPropagation(); toggleList(movie); }}
                  className="border-2 border-gray-400 bg-[#2a2a2a]/60 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-300 hover:border-white hover:text-white transition group"
                  title="Add to My List"
                >
                  <span className="material-icons text-lg md:text-xl group-hover:scale-100">{isAdded ? 'check' : 'add'}</span>
                </button>
                {/* Like - Outline */}
                <button className="border-2 border-gray-400 bg-[#2a2a2a]/60 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center text-gray-300 hover:border-white hover:text-white transition">
                  <span className="material-icons text-sm md:text-base">thumb_up</span>
                </button>
              </div>
              
              {/* More Info - Chevron Down */}
              <button 
                onClick={() => onSelect(movie)} 
                className="border-2 border-gray-400 bg-[#2a2a2a]/60 rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:border-white transition text-gray-300 hover:text-white ml-auto"
                title="More Info"
              >
                <span className="material-icons text-xl md:text-2xl">keyboard_arrow_down</span>
              </button>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center flex-wrap gap-2 text-sm font-medium">
              <span className="text-[#46d369] font-bold">{(movie.vote_average * 10).toFixed(0)}% Match</span>
              
              {/* Age Rating */}
              {movie.adult ? (
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-[#E50914] text-white text-[10px] font-bold">
                    18
                  </span>
              ) : (
                  <span className="border border-gray-400 text-gray-400 px-1.5 py-[1px] text-xs uppercase">
                    13+
                  </span>
              )}
             
              {/* Duration / Seasons */}
              <span className="text-gray-400 text-xs">{(movie.media_type === 'tv' ? 'Series' : 'Movie')}</span>

              <span className="border border-gray-500 text-gray-400 px-1 py-[0.5px] text-[9px] rounded-[2px] h-fit flex items-center">HD</span>
            </div>

            {/* Genres Row */}
            <div className="flex flex-wrap items-center gap-x-2 text-xs font-medium text-white">
                {getGenreNames().map((genre, idx) => (
                  <div key={idx} className="flex items-center">
                    <span className="text-gray-300 hover:text-white cursor-default">{genre}</span>
                    {idx < getGenreNames().length - 1 && <span className="text-gray-600 ml-2 text-[8px]">•</span>}
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;