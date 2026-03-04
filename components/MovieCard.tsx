import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { SpeakerSlashIcon, SpeakerHighIcon, PlayIcon, CheckIcon, PlusIcon, ThumbsUpIcon, CaretDownIcon, BookOpenIcon } from '@phosphor-icons/react';
import { useYouTubePlayer } from '../hooks/useYouTubePlayer';
import YouTube from 'react-youtube';
import { Movie } from '../types';
import { useGlobalContext } from '../context/GlobalContext';
import { GENRES, LOGO_SIZE } from '../constants';
import { fetchTrailer, getMovieImages, prefetchStream } from '../services/api';

interface MovieCardProps {
  movie: Movie;
  onSelect: (movie: Movie, time?: number, videoId?: string) => void;
  isGrid?: boolean;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, onSelect, isGrid = false }) => {
  const { t } = useTranslation();
  const { myList, toggleList, getVideoState, updateVideoState, getEpisodeProgress, getLastWatchedEpisode, top10TV, top10Movies } = useGlobalContext();
  const [isHovered, setIsHovered] = useState(false);
  const { trailerUrl, setTrailerUrl, isMuted, setIsMuted, playerRef } = useYouTubePlayer();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  // 'center' | 'left' | 'right' - determines expansion direction
  const [hoverPosition, setHoverPosition] = useState<'center' | 'left' | 'right'>('center');

  const isAdded = myList.find(m => m.id === movie.id);
  const timerRef = useRef<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // --- Dynamic Badge Logic (strict thresholds to reduce clutter) ---
  const getBadgeInfo = () => {
    const isTV = movie.media_type === 'tv' || (!movie.media_type && !movie.title);
    const movieIdNum = Number(movie.id);

    // Sync with New & Popular Top 10 Lists
    if (isTV && top10TV?.includes(movieIdNum)) {
      return { text: 'Top 10', type: 'top' };
    }
    if (!isTV && top10Movies?.includes(movieIdNum)) {
      return { text: 'Top 10', type: 'top' };
    }

    const dateStr = movie.release_date || movie.first_air_date;
    const now = new Date();

    // Check release recency
    if (dateStr) {
      const releaseDate = new Date(dateStr);
      const diffTime = releaseDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Coming soon (within next 30 days)
      if (diffDays > 0 && diffDays <= 30) {
        return { text: 'Coming Soon', type: 'upcoming' };
      }

      // Recently added (within last 45 days)
      if (diffDays >= -45 && diffDays <= 0) {
        return {
          text: isTV ? 'New Episodes' : 'Recently Added',
          type: 'new'
        };
      }
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
        const data = await getMovieImages(String(movie.id), mediaType);

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




  // Prefetch stream on hover
  const handleMouseEnter = (e: React.MouseEvent) => {
    // Determine screen position for smart popup alignment
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const buffer = 150;
      if (rect.left < buffer) setHoverPosition('left');
      else if (window.innerWidth - rect.right < buffer) setHoverPosition('right');
      else setHoverPosition('center');
    }

    // Set timer for hover effect (existing logic)
    timerRef.current = setTimeout(() => {
      setIsHovered(true);

      // Request stream prefetch when user dwells on the card
      const mediaType = (movie.media_type || (movie.title ? 'movie' : 'tv')) as 'movie' | 'tv';
      const releaseDate = movie.release_date || movie.first_air_date;
      const year = releaseDate ? new Date(releaseDate).getFullYear() : undefined;

      if (year) {
        console.log(`[MovieCard] Prefetching stream for: ${movie.title || movie.name}`);
        // For TV shows, we ideally want to prefetch the resume episode, but for hover, S1E1 is safe default
        // or we could check getEpisodeProgress/resumeContext logic here if cheap.
        // For now, defaulting to 1,1 is standard behavior for "first play".
        prefetchStream(
          movie.title || movie.name || '',
          year,
          String(movie.id),
          mediaType,
          1,
          1
        );
      }
    }, 500); // 500ms dwell time
  };

  const handleMouseLeave = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsHovered(false);
    setTrailerUrl(null);
    setIsMuted(true);
  };


  const getGenreNames = () => {
    if (!movie.genre_ids) return [];
    return movie.genre_ids.map(id => t(`genres.${id}`, { defaultValue: GENRES[id] })).filter(Boolean).slice(0, 3);
  };

  // Dynamic Class Calculation
  const getPositionClasses = () => {
    switch (hoverPosition) {
      case 'left': return 'left-0 origin-left';
      case 'right': return 'right-0 origin-right';
      default: return 'left-1/2 -ml-[160px] md:-ml-[170px] origin-center';
    }
  };

  // Handler that saves state to context before opening modal
  const handleOpenModal = () => {
    const currentTime = playerRef.current?.getCurrentTime() || 0;
    if (trailerUrl) {
      updateVideoState(movie.id, currentTime, trailerUrl);
    }
    onSelect(movie, currentTime, trailerUrl);
  };

  const isBook = ['series', 'comic', 'manga', 'local'].includes(movie.media_type || '');

  // Pre-calculate Image Source safe for Comics
  const imageSrc = (movie.poster_path?.startsWith('http') || movie.backdrop_path?.startsWith('http') || movie.poster_path?.startsWith('comic://') || movie.backdrop_path?.startsWith('comic://'))
    ? (movie.backdrop_path || movie.poster_path)
    : `https://image.tmdb.org/t/p/w500${movie.backdrop_path || movie.poster_path}`;

  return (
    <div
      ref={cardRef}
      className={`relative transition-all duration-300 z-10 
        ${isGrid
          ? 'w-full aspect-video cursor-pointer hover:z-50'
          : 'flex-none w-[calc((100vw-3rem)/2.3)] sm:w-[calc((100vw-3rem)/3.3)] md:w-[calc((100vw-3.5rem)/4.3)] lg:w-[calc((100vw-4rem)/6.2)] aspect-video cursor-pointer hover:z-[40]'
        }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(movie)}
    >
      <div className="w-full h-full relative rounded-sm overflow-hidden">
        {/* Base Image */}
        <img
          src={imageSrc}
          className={`w-full h-full object-cover ${isBook ? 'object-[50%_30%]' : 'object-center'}`}
          alt={movie.name || movie.title}
          loading="lazy"
        />

        {/* Base Title Overlay */}
        {!isHovered && (
          <>
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-end justify-center pb-2 px-2 opacity-100 transition-opacity duration-300">
              {logoUrl ? (
                <img src={logoUrl} alt={movie.title || movie.name} className="h-full max-h-5 w-auto object-contain drop-shadow-md" />
              ) : (
                <h3 className={`text-white font-leaner text-center tracking-wide leading-tight drop-shadow-md line-clamp-3 mb-2 w-full px-1 ${isBook ? 'text-2xl' : 'text-xl'}`}>
                  {movie.title || movie.name}
                </h3>
              )}
            </div>

            {/* Dynamic Badges on Base Card */}
            {badge && !isBook && badge.type === 'top' && (
              /* Top 10 — Ribbon shape (two bottom points) matching Netflix */
              <div
                className="absolute top-0 right-0 z-10 w-[23px] h-[32px] bg-[#E50914] flex flex-col items-center justify-start pt-[2px] pr-[1px] shadow-sm pointer-events-none"
                style={{ clipPath: 'polygon(100% 0, 100% 100%, 100% 85%, 0 100%, 0 0)' }}
              >
                <div className="text-white text-[9px] font-bold tracking-tighter, leading-none mb-[2px]" style={{ fontFamily: "'Niva Bold', sans-serif", letterSpacing: '0.5px' }}>TOP</div>
                <div className="text-white text-[13px] leading-none" style={{ fontFamily: "'Niva Bold', sans-serif", letterSpacing: '-0.5px' }}>10</div>
              </div>
            )}
            {badge && !isBook && badge.type === 'new' && (
              <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center">
                <div className="bg-[#E50914] text-white text-[8px] font-bold px-3 py-[3px] tracking-wider uppercase leading-none">
                  {badge.text}
                </div>
              </div>
            )}
            {badge && !isBook && badge.type === 'upcoming' && (
              <div className="absolute bottom-0 left-0 right-0 z-10 flex justify-center">
                <div className="bg-black/70 border border-white/30 text-white text-[8px] font-bold px-3 py-[3px] tracking-wider uppercase leading-none backdrop-blur-sm">
                  {badge.text}
                </div>
              </div>
            )}

            {isBook && (
              <div className="absolute top-2 left-2 bg-black/50 border border-white/40 text-white px-2 py-0.5 text-[10px] font-medium uppercase backdrop-blur-sm">
                Comic
              </div>
            )}
          </>
        )}
      </div>

      {/* Progress Bar underneath the poster */}
      {!isHovered && (() => {
        let progress = 0;
        const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');

        if (mediaType === 'tv') {
          const ep = getLastWatchedEpisode(String(movie.id));
          if (ep && ep.duration > 0) {
            progress = (ep.time / ep.duration) * 100;
          }
        } else {
          const state = getVideoState(movie.id);
          if (state && state.duration && state.duration > 0) {
            progress = (state.time / state.duration) * 100;
          }
        }

        if (progress > 0 && progress < 100) {
          return (
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-[#333] shadow-md pointer-events-none z-0">
              <div className="h-full bg-[#E50914]" style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} />
            </div>
          );
        }
        return null;
      })()}

      {/* Hover Popup - Active on all views */}
      {isHovered && (
        <div
          className={`absolute top-[-60px] md:top-[-70px] w-[280px] md:w-[300px] bg-[#181818] rounded-md shadow-[0_14px_36px_rgba(0,0,0,0.75),0_8px_16px_rgba(0,0,0,0.6)] z-[40] animate-scaleIn ring-1 ring-zinc-700/50 ${getPositionClasses()}`}
          onClick={(e) => e.stopPropagation()} // Prevent click from bubbling to base card
        >
          {/* Media Container */}
          <div className="relative h-[135px] md:h-[157px] bg-[#141414] overflow-hidden" onClick={handleOpenModal}>
            {(trailerUrl && !isBook) ? (
              <div className="absolute top-[40%] left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
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
                      disablekb: 1,
                      fs: 0,
                      rel: 0,
                      iv_load_policy: 3,
                      cc_load_policy: 0,
                      // No start offset - seamless playback
                    }
                  }}
                  onReady={(e) => {
                    playerRef.current = e.target;
                    if (isMuted) {
                      e.target.mute();
                    } else {
                      e.target.unMute();
                    }

                    // Seamless sync from Context - only seek if same video
                    const savedState = getVideoState(movie.id);
                    if (savedState && savedState.time > 0 && savedState.videoId === trailerUrl) {
                      e.target.seekTo(savedState.time, true);
                    }
                  }}
                  onEnd={(e) => {
                    // Seamless loop from start
                    e.target.seekTo(0);
                    e.target.playVideo();
                  }}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <img
                src={imageSrc}
                className={`w-full h-full object-cover ${isBook ? 'object-[50%_30%]' : 'object-center'}`}
                alt="preview"
              />
            )}

            {/* Mute Button - Hide for books */}
            {trailerUrl && !isBook && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                className="absolute bottom-4 right-4 w-8 h-8 rounded-full border border-white/30 bg-black/50 hover:bg-white/10 flex items-center justify-center transition"
              >
                {isMuted ? <SpeakerSlashIcon size={12} className="text-white" /> : <SpeakerHighIcon size={12} className="text-white" />}
              </button>
            )}

            <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-[#181818] to-transparent" />

            <div className="absolute bottom-3 left-4 right-12 pointer-events-none">
              {logoUrl ? (
                <img src={logoUrl} alt="title logo" className="h-8 w-auto object-contain origin-bottom-left drop-shadow-md" />
              ) : (
                <h4 className="text-white font-leaner text-4xl line-clamp-2 drop-shadow-md tracking-wide text-center mb-2 leading-none">{movie.title || movie.name}</h4>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="px-3 pt-2.5 pb-3 space-y-2.5 bg-[#181818]">
            {/* Action Buttons Row */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                {/* Play/Read Button */}
                <button
                  onClick={handleOpenModal}
                  className="bg-white text-black rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:bg-neutral-200 transition"
                  title={isBook ? "Read Now" : "Play"}
                >
                  {isBook ? <BookOpenIcon size={18} weight="fill" /> : <PlayIcon size={22} weight="fill" className="ml-0.5" />}
                </button>
                {/* Add to List */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleList(movie); }}
                  className="border-2 border-gray-500 bg-[#2a2a2a]/80 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-white hover:border-white transition"
                  title="Add to My List"
                >
                  {isAdded ? <CheckIcon size={16} weight="bold" /> : <PlusIcon size={16} weight="bold" />}
                </button>
                {/* Rate / Thumbs Up */}
                <button
                  className="border-2 border-gray-500 bg-[#2a2a2a]/80 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center text-white hover:border-white transition"
                  title="Rate"
                >
                  <ThumbsUpIcon size={16} weight="bold" />
                </button>
              </div>

              {/* More Info - Chevron Down */}
              <button
                onClick={handleOpenModal}
                className="border-2 border-gray-500 bg-[#2a2a2a]/80 rounded-full w-8 h-8 md:w-9 md:h-9 flex items-center justify-center hover:border-white transition text-white"
                title="More Info"
              >
                <CaretDownIcon size={18} weight="bold" />
              </button>
            </div>

            {/* Metadata Row */}
            <div className="flex items-center flex-wrap gap-1.5 text-[13px] font-medium">
              {/* Maturity Rating Badge */}
              <span className="border border-white/40 text-white/90 px-1 py-[1px] text-[10px] font-medium">
                {movie.adult ? 'TV-MA' : movie.vote_average >= 7.5 ? 'TV-14' : 'TV-PG'}
              </span>

              {/* Runtime or Season count */}
              <span className="text-white/70">
                {isBook ? (movie.media_type === 'series' ? 'Series' : 'Comic') :
                  movie.media_type === 'tv' ? `${Math.max(1, Math.ceil((movie.vote_count || 10) / 500))} Seasons` :
                    movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` :
                      `${Math.floor((movie.popularity || 100) / 10 + 80)}m`
                }
              </span>

              {!isBook && <span className="border border-gray-500 text-gray-400 px-1 py-[0.5px] text-[9px] rounded-[2px]">HD</span>}
            </div>

            {/* Genres Row — bullet-separated */}
            <div className="flex flex-wrap items-center text-[12px] font-medium">
              {getGenreNames().map((genre, idx) => (
                <span key={idx} className="flex items-center">
                  <span className="text-white/80 hover:text-white cursor-default">{genre}</span>
                  {idx < getGenreNames().length - 1 && <span className="text-gray-500 mx-2 text-[8px]">•</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;