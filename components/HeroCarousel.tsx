import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube';
import { Movie, TMDBResponse } from '../types';
import { IMG_PATH, LOGO_SIZE, REQUESTS } from '../constants';
import { fetchTrailers, getMovieImages } from '../services/api';

interface HeroCarouselProps {
  onSelect: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  fetchUrl?: string;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSelect, onPlay, fetchUrl }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Smart Video State
  const [trailerQueue, setTrailerQueue] = useState<string[]>([]);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const playerRef = useRef<any>(null);
  const videoTimerRef = useRef<any>(null);
  const fadeIntervalRef = useRef<any>(null);

  // Fetch One Random Movie
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const url = fetchUrl || REQUESTS.fetchNetflixOriginals;
        const request = await axios.get<TMDBResponse>(url);
        const validResults = (request?.data?.results || []).filter(m => m.backdrop_path);

        if (validResults.length > 0) {
          const random = validResults[Math.floor(Math.random() * validResults.length)];
          setMovie(random);
        }
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch hero content", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchUrl]);

  // Audio Fading Logic
  const fadeAudioIn = () => {
    const player = playerRef.current;
    if (!player || isMuted) return; // Don't fade in if muted globally

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    // Ensure we start at current measurement or 0
    let vol = player.getVolume();
    if (vol > 100) vol = 100;

    fadeIntervalRef.current = setInterval(() => {
      if (vol < 100) {
        vol += 5; // 20 steps * 20ms = 400ms approx
        player.setVolume(vol);
      } else {
        clearInterval(fadeIntervalRef.current);
      }
    }, 20);
  };

  const fadeAudioOut = (callback?: () => void) => {
    const player = playerRef.current;
    if (!player) {
      if (callback) callback();
      return;
    }

    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    let vol = player.getVolume();

    fadeIntervalRef.current = setInterval(() => {
      if (vol > 0) {
        vol -= 5;
        player.setVolume(vol);
      } else {
        clearInterval(fadeIntervalRef.current);
        if (callback) callback();
      }
    }, 20);
  };


  // Hover Logic for Video Playback
  useEffect(() => {
    if (playerRef.current && isVideoReady && showVideo) {
      if (isHovered) {
        // Play
        // If unmuted, set volume to 0 then fade in?
        // Actually, just play.
        playerRef.current.playVideo();
        if (!isMuted) fadeAudioIn();
      } else {
        // Pause with fade out
        if (!isMuted) {
          fadeAudioOut(() => {
            try { playerRef.current.pauseVideo(); } catch (e) { }
          });
        } else {
          try { playerRef.current.pauseVideo(); } catch (e) { }
        }
      }
    }
  }, [isHovered, isVideoReady, showVideo, isMuted]);

  // Scroll Listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowVideo(false);
        setIsVideoReady(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync mute state with player (Hard Mute Switch)
  useEffect(() => {
    if (playerRef.current && isVideoReady) {
      if (isMuted) {
        playerRef.current.mute();
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      }
      else {
        playerRef.current.unMute();
        // If we are currently hovered and playing, restore volume?
        if (isHovered) playerRef.current.setVolume(100);
      }
    }
  }, [isMuted, isVideoReady, isHovered]);

  // Handle Movie Assets (Logo & Video)
  useEffect(() => {
    if (!movie) return;

    setLogoUrl(null);
    setShowVideo(false);
    setIsVideoReady(false);
    setTrailerQueue([]);
    clearTimeout(videoTimerRef.current);

    const fetchAssets = async () => {
      try {
        const mediaType = (movie.media_type || (movie.title ? 'movie' : 'tv')) as 'movie' | 'tv';

        // Fetch Logo
        try {
          const imageData = await getMovieImages(movie.id, mediaType);
          if (imageData && imageData.logos) {
            const logo = imageData.logos.find((l: any) => l.iso_639_1 === 'en' || l.iso_639_1 === null);
            if (logo) {
              setLogoUrl(`https://image.tmdb.org/t/p/${LOGO_SIZE}${logo.file_path}`);
            }
          }
        } catch (e) { }

        // Start Video Loading Timer
        videoTimerRef.current = setTimeout(async () => {
          if (window.scrollY < 100) {
            try {
              const keys = await fetchTrailers(movie.id, mediaType);
              if (keys && keys.length > 0) {
                setTrailerQueue(keys);
                setShowVideo(true);
              }
            } catch (e) { }
          }
        }, 1000);

      } catch (e) { }
    };
    fetchAssets();

    return () => clearTimeout(videoTimerRef.current);
  }, [movie]);

  if (loading) {
    return (
      <div className="relative h-[55vh] sm:h-[70vh] md:h-[85vh] w-full bg-[#141414] overflow-hidden">
        <div className="absolute inset-0 bg-[#1f1f1f] animate-pulse" />
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div
      className="relative h-[55vh] sm:h-[70vh] md:h-[85vh] w-full overflow-hidden group bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Image - Visible initially. Hides ONLY if video is ready. 
          If video pauses (mouse leave), video stays visible (opacity 100), so image remains hidden.
      */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${showVideo && isVideoReady ? "opacity-0" : "opacity-100"}`}>
        <img
          src={`${IMG_PATH}${movie.backdrop_path}`}
          className="w-full h-full object-cover object-center"
          alt="backdrop"
        />
      </div>

      {/* Background Video Layer */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${showVideo && isVideoReady ? 'opacity-100' : 'opacity-0'}`}>
        {showVideo && trailerQueue.length > 0 && (
          <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] -translate-x-1/2 -translate-y-1/2 overflow-hidden pointer-events-none">
            <YouTube
              videoId={trailerQueue[0]}
              className="w-full h-full object-cover"
              onReady={(e) => {
                playerRef.current = e.target;
                setIsVideoReady(true);
                if (isMuted) e.target.mute();
                else e.target.unMute();

                // Set initial volume to 0 if we assume fade-in on hover?
                // If not hovered, pause.
                if (!isHovered) {
                  e.target.pauseVideo();
                  e.target.setVolume(0);
                } else {
                  e.target.setVolume(100);
                }
              }}
              onStateChange={(e) => {
                if (e.data === 1) setIsVideoReady(true);
              }}
              onError={(e) => {
                setTrailerQueue(prev => prev.slice(1));
                if (trailerQueue.length <= 1) setShowVideo(false);
              }}
              opts={{
                width: '100%',
                height: '100%',
                playerVars: {
                  autoplay: 1,
                  controls: 0,
                  disablekb: 1,
                  loop: 1,
                  playlist: trailerQueue[0],
                  modestbranding: 1,
                  rel: 0,
                  iv_load_policy: 3,
                  fs: 0,
                  cc_load_policy: 0,
                }
              }}
            />
          </div>
        )}
      </div>

      {/* Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-black/30 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/20 to-transparent z-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 md:h-32 bg-gradient-to-t from-[#141414] via-[#141414]/60 to-transparent z-10 pointer-events-none" />

      {/* Content - Hidden when video is playing/ready? 
          User said: "make the description hide when video start playing... description stays hidden [on pause]"
          So hide if `isVideoReady`.
      */}
      <div className={`absolute top-0 left-0 w-full h-full flex flex-col justify-center z-20 pb-12 sm:pb-0 
        pl-6 md:pl-14 lg:pl-20 pr-4 md:pr-12 pointer-events-none transition-opacity duration-700`}
      >
        <div className="mt-16 sm:mt-0 max-w-[90%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl space-y-4 md:space-y-6 pointer-events-auto">

          {/* Logo/Title */}
          <div className={`h-16 sm:h-24 md:h-32 flex items-end mb-2 origin-bottom-left transition-all duration-700 ${isVideoReady ? 'scale-75 origin-bottom-left translate-y-24' : ''}`}>
            {logoUrl ? (
              <img src={logoUrl} alt="title logo" className="h-full object-contain drop-shadow-2xl" />
            ) : (
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black drop-shadow-xl leading-none text-white tracking-tight">
                {movie?.name || movie?.title || ''}
              </h1>
            )}
          </div>

          {/* Description - Hides when video is ready */}
          <p className={`text-sm md:text-base text-gray-100 line-clamp-3 drop-shadow-md font-normal leading-relaxed text-shadow-sm max-w-lg transition-opacity duration-700 ${isVideoReady ? 'opacity-0' : 'opacity-100'}`}>
            {movie?.overview}
          </p>

          {/* Buttons - Moves down when video is ready */}
          <div className={`flex items-center space-x-3 pt-2 transition-transform duration-700 ${isVideoReady ? 'translate-y-8' : ''}`}>
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center justify-center bg-white text-black px-5 md:px-7 h-10 md:h-12 rounded-[4px] font-bold hover:bg-white/90 transition transform hover:scale-105 active:scale-95 text-sm md:text-base"
            >
              <svg className="w-5 h-5 md:w-7 md:h-7 mr-1 md:mr-2 text-black fill-current" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z" /></svg>
              Play
            </button>
            <button
              onClick={() => onSelect(movie)}
              className="flex items-center justify-center bg-gray-500/70 text-white px-6 md:px-9 h-10 md:h-12 rounded-[4px] font-bold hover:bg-gray-500/50 backdrop-blur-md transition transform hover:scale-105 active:scale-95 text-sm md:text-base"
            >
              <span className="material-icons mr-2 text-2xl md:text-3xl">info_outline</span>
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Controls (Mute & Rating) - Bottom Right */}
      <div className="absolute right-0 bottom-1/3 flex items-center space-x-4 z-30 pointer-events-auto pr-0">

        {/* Mute Button - Only show if video is active/ready */}
        {showVideo && isVideoReady && (
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="w-8 h-8 md:w-10 md:h-10 border border-white/50 rounded-full flex items-center justify-center bg-black/20 hover:bg-white/10 hover:border-white transition backdrop-blur-md group"
          >
            <span className="material-icons text-white group-hover:scale-110 transition-transform text-lg">
              {isMuted ? 'volume_off' : 'volume_up'}
            </span>
          </button>
        )}

        {/* PG Rating */}
        <div className="bg-gray-500/30 border-l-2 border-white pl-2 pr-4 py-1 backdrop-blur-md">
          <span className="text-white font-medium text-xs md:text-sm uppercase">
            {movie.adult ? '18+' : '13+'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default HeroCarousel;