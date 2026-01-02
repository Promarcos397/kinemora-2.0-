import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import YouTube from 'react-youtube'; 
import { Movie, TMDBResponse } from '../types';
import { IMG_PATH, LOGO_SIZE, REQUESTS } from '../constants';
import { fetchTrailer, getMovieImages } from '../services/api';

interface HeroCarouselProps {
  onSelect: (movie: Movie) => void;
  onPlay: (movie: Movie) => void;
  fetchUrl?: string;
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ onSelect, onPlay, fetchUrl }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  
  // Smart Video State
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false); 
  const [isMuted, setIsMuted] = useState(true); // Default Muted for hero background
  
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<any>(null);
  const videoTimerRef = useRef<any>(null);

  // Fetch High Quality Movies
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const url = fetchUrl || REQUESTS.fetchNetflixOriginals;
        const request = await axios.get<TMDBResponse>(url);
        const validResults = request.data.results.filter(m => m.backdrop_path).slice(0, 8);
        setMovies(validResults);
        setCurrentIndex(0); 
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch hero content", error);
        setLoading(false);
      }
    }
    fetchData();
  }, [fetchUrl]);

  // Smart Auto-play Logic
  useEffect(() => {
    if (isHovered || movies.length === 0 || showVideo) return;
    
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 8000); 

    return () => clearInterval(intervalRef.current);
  }, [movies.length, isHovered, showVideo]);

  // Hover Logic for Video Playback
  useEffect(() => {
    if (playerRef.current && isVideoReady && showVideo) {
        if (isHovered) {
            try { playerRef.current.pauseVideo(); } catch(e) {}
        } else {
            try { playerRef.current.playVideo(); } catch(e) {}
        }
    }
  }, [isHovered, isVideoReady, showVideo]);

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

  // Sync mute state with player
  useEffect(() => {
    if (playerRef.current && isVideoReady) {
        if (isMuted) playerRef.current.mute();
        else playerRef.current.unMute();
    }
  }, [isMuted, isVideoReady]);

  // Handle Slide Change
  useEffect(() => {
    if (movies.length === 0) return;
    const movie = movies[currentIndex];
    
    setLogoUrl(null);
    setShowVideo(false);
    setIsVideoReady(false); 
    setTrailerKey(null);
    clearTimeout(videoTimerRef.current);

    const fetchAssets = async () => {
      try {
        const mediaType = (movie.media_type || (movie.title ? 'movie' : 'tv')) as 'movie' | 'tv';
        
        try {
            const imageData = await getMovieImages(movie.id, mediaType);
            if (imageData && imageData.logos) {
                const logo = imageData.logos.find((l: any) => l.iso_639_1 === 'en' || l.iso_639_1 === null);
                if (logo) {
                    setLogoUrl(`https://image.tmdb.org/t/p/${LOGO_SIZE}${logo.file_path}`);
                }
            }
        } catch (e) { }

        videoTimerRef.current = setTimeout(async () => {
            if (window.scrollY < 100) {
                try {
                    const key = await fetchTrailer(movie.id, mediaType);
                    if (key) {
                        setTrailerKey(key);
                        setShowVideo(true);
                    }
                } catch(e) { }
            }
        }, 2000);

      } catch (e) { }
    };
    fetchAssets();

    return () => clearTimeout(videoTimerRef.current);
  }, [currentIndex, movies]);

  if (loading) {
      return (
        <div className="relative h-[55vh] sm:h-[70vh] md:h-[85vh] w-full bg-[#141414] overflow-hidden">
            <div className="absolute inset-0 bg-[#1f1f1f] animate-pulse" />
        </div>
      );
  }
  
  if (movies.length === 0) return null;

  const currentMovie = movies[currentIndex];

  return (
    <div 
      className="relative h-[55vh] sm:h-[70vh] md:h-[85vh] w-full overflow-hidden group bg-black"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Images */}
      {movies.map((movie, index) => (
        <div
          key={movie.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out z-0 ${
            index === currentIndex && (!showVideo || !isVideoReady) ? "opacity-100" : "opacity-0"
          }`}
        >
          <img 
            src={`${IMG_PATH}${movie.backdrop_path}`} 
            className="w-full h-full object-cover object-center" 
            alt="backdrop" 
          />
        </div>
      ))}

      {/* Background Video */}
      <div className={`absolute inset-0 z-0 transition-opacity duration-1000 ${showVideo && trailerKey && isVideoReady ? 'opacity-100' : 'opacity-0'}`}>
         {showVideo && trailerKey && (
             <div className="w-full h-full overflow-hidden pointer-events-none relative">
                 <YouTube 
                    videoId={trailerKey}
                    className="absolute top-1/2 left-1/2 w-[300%] h-[300%] -translate-x-1/2 -translate-y-1/2" 
                    onReady={(e) => {
                        playerRef.current = e.target;
                        setIsVideoReady(true);
                        if (isMuted) e.target.mute();
                        else e.target.unMute();
                    }}
                    onStateChange={(e) => {
                        if (e.data === 1) setIsVideoReady(true);
                    }}
                    opts={{
                        playerVars: {
                            autoplay: 1,
                            controls: 0,
                            disablekb: 1,
                            loop: 1,
                            playlist: trailerKey,
                            modestbranding: 1,
                            rel: 0,
                            iv_load_policy: 3,
                            fs: 0,
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

      {/* Content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center z-20 pb-12 sm:pb-0 
        pl-6 md:pl-14 lg:pl-20 pr-4 md:pr-12 pointer-events-none"
      >
        <div className="mt-16 sm:mt-0 max-w-[90%] sm:max-w-lg md:max-w-2xl lg:max-w-3xl space-y-4 md:space-y-6 animate-fadeIn pointer-events-auto">
          
          <div className="h-16 sm:h-24 md:h-32 flex items-end mb-2 origin-bottom-left transition-transform duration-700">
            {logoUrl ? (
              <img src={logoUrl} alt="title logo" className="h-full object-contain drop-shadow-2xl" />
            ) : (
              <h1 className="text-3xl sm:text-4xl md:text-6xl font-black drop-shadow-xl leading-none text-white tracking-tight">
                {currentMovie?.name || currentMovie?.title}
              </h1>
            )}
          </div>

          <p className="text-sm md:text-base text-gray-100 line-clamp-3 drop-shadow-md font-normal leading-relaxed text-shadow-sm max-w-lg">
            {currentMovie?.overview}
          </p>

          <div className="flex items-center space-x-3 pt-2">
            <button 
              onClick={() => onPlay(currentMovie)}
              className="flex items-center justify-center bg-white text-black px-5 md:px-7 h-10 md:h-12 rounded-[4px] font-bold hover:bg-white/90 transition transform hover:scale-105 active:scale-95 text-sm md:text-base"
            >
              <svg 
                className="w-5 h-5 md:w-7 md:h-7 mr-1 md:mr-2 text-black fill-current" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M5 3l14 9-14 9V3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              Play
            </button>
            <button 
              onClick={() => onSelect(currentMovie)}
              className="flex items-center justify-center bg-gray-500/70 text-white px-6 md:px-9 h-10 md:h-12 rounded-[4px] font-bold hover:bg-gray-500/50 backdrop-blur-md transition transform hover:scale-105 active:scale-95 text-sm md:text-base"
            >
              <span className="material-icons mr-2 text-2xl md:text-3xl">info_outline</span> 
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute right-0 bottom-1/3 flex flex-col items-end space-y-4 z-30 pointer-events-auto">
          {showVideo && trailerKey && isVideoReady && (
              <button 
                onClick={() => setIsMuted(!isMuted)}
                className="mr-4 md:mr-12 w-8 h-8 md:w-10 md:h-10 border border-white/50 rounded-full flex items-center justify-center bg-black/20 hover:bg-white/10 hover:border-white transition backdrop-blur-md group"
              >
                  <span className="material-icons text-white group-hover:scale-110 transition-transform text-lg">
                      {isMuted ? 'volume_off' : 'volume_up'}
                  </span>
              </button>
          )}

          <div className="bg-gray-500/30 border-l-2 border-gray-100 pl-2 pr-6 py-1 backdrop-blur-md mt-4">
              <span className="text-white font-medium text-xs md:text-sm uppercase">
                  {currentMovie.adult ? '18+' : '13+'}
              </span>
          </div>
      </div>
    </div>
  );
};

export default HeroCarousel;