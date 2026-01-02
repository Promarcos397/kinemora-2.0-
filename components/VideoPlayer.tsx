import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Movie, Episode } from '../types';
import { getSeasonDetails, getMovieDetails } from '../services/api';
import { IMG_PATH } from '../constants';
import { useGlobalContext } from '../context/GlobalContext';

interface VideoPlayerProps {
  movie: Movie;
  season?: number;
  episode?: number;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, season = 1, episode = 1, onClose }) => {
  const { addToHistory } = useGlobalContext();
  
  // UI State
  const [showUI, setShowUI] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  
  // Data State
  const [seasonList, setSeasonList] = useState<number[]>([]);
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  
  // Playback State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0); 
  // Initialize volume from local storage or default to 1
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem('kinemora-volume');
    return saved ? parseFloat(saved) : 1;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Smart Features State
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextEpPrompt, setShowNextEpPrompt] = useState(false);

  const inactivityTimer = useRef<any>(null);
  const progressInterval = useRef<any>(null);

  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const activeEpisodeData = currentSeasonEpisodes.find(e => e.episode_number === currentEpisode);

  // --- 0. HISTORY & PERSISTENCE ---
  useEffect(() => {
    // Add to history on mount
    addToHistory(movie);
  }, [movie, addToHistory]);

  useEffect(() => {
    // Persist volume settings
    localStorage.setItem('kinemora-volume', volume.toString());
  }, [volume]);

  // --- 1. DATA FETCHING ---
  const fetchSeasonData = useCallback(async (s: number) => {
    if (mediaType !== 'tv') return;
    setIsLoadingEpisodes(true);
    const eps = await getSeasonDetails(movie.id, s);
    setCurrentSeasonEpisodes(eps);
    setIsLoadingEpisodes(false);
  }, [movie.id, mediaType]);

  useEffect(() => {
    if (mediaType === 'tv') {
        const loadSeasons = async () => {
            let totalSeasons = movie.number_of_seasons;
            if (!totalSeasons) {
                const details = await getMovieDetails(movie.id, 'tv');
                if (details) totalSeasons = details.number_of_seasons;
            }
            if (totalSeasons) {
                setSeasonList(Array.from({ length: totalSeasons }, (_, i) => i + 1));
            }
        };
        loadSeasons();
        fetchSeasonData(selectedSeason);
    }
  }, [movie, mediaType, selectedSeason, fetchSeasonData]);

  // --- 2. SMART PLAYBACK LOGIC ---
  
  // Progress & Timed Events (Simulation since we can't read Iframe state)
  useEffect(() => {
      if (isPlaying && !isBuffering) {
          progressInterval.current = setInterval(() => {
              setProgress(prev => {
                  if (prev >= 100) {
                      setIsPlaying(false);
                      return 100;
                  }
                  
                  // Slow progress simulation
                  const newProgress = prev + 0.04; 

                  // Skip Intro Logic: Show between 2% and 8%
                  setShowSkipIntro(newProgress > 2 && newProgress < 8);

                  // Next Episode Prompt: Show after 95%
                  setShowNextEpPrompt(newProgress > 95);

                  return newProgress;
              });
          }, 50); 
      }
      return () => clearInterval(progressInterval.current);
  }, [isPlaying, isBuffering]);

  // --- 3. CONTROLS LOGIC ---
  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleFullscreen = () => {
      if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch((e) => console.log(e));
          setIsFullscreen(true);
      } else {
          document.exitFullscreen();
          setIsFullscreen(false);
      }
  };

  const handleSeek = useCallback((amount: number) => {
      setIsBuffering(true);
      setTimeout(() => {
          setProgress(prev => {
              const change = (amount / 3600) * 100; 
              return Math.min(100, Math.max(0, prev + change));
          });
          setIsBuffering(false);
      }, 300);
      resetInactivityTimer();
  }, []);

  const handleNextEpisode = useCallback(() => {
      const currentIndex = currentSeasonEpisodes.findIndex(e => e.episode_number === currentEpisode);
      
      let nextEp: Episode | undefined;

      if (currentIndex !== -1 && currentIndex < currentSeasonEpisodes.length - 1) {
          // Next ep in current season
          nextEp = currentSeasonEpisodes[currentIndex + 1];
      } else if (seasonList.includes(selectedSeason + 1)) {
          // First ep of next season
          const nextSeason = selectedSeason + 1;
          setSelectedSeason(nextSeason);
          setIsBuffering(true);
          setTimeout(() => setIsBuffering(false), 1000);
          return; 
      }

      if (nextEp) {
          handleEpisodeChange(nextEp);
      }
  }, [currentSeasonEpisodes, currentEpisode, seasonList, selectedSeason]);

  const handleEpisodeChange = (ep: Episode) => {
    setIsBuffering(true);
    setCurrentEpisode(ep.episode_number);
    setProgress(0);
    setShowSkipIntro(false);
    setShowNextEpPrompt(false);
    
    // Smooth reset
    setTimeout(() => {
        setIsBuffering(false);
        setIsPlaying(true);
    }, 800);
  };

  const handleSkipIntro = () => {
      setIsBuffering(true);
      setTimeout(() => {
          setProgress(8.5); // Skip past intro
          setShowSkipIntro(false);
          setIsBuffering(false);
      }, 400);
  };

  // UI Hiding - Smarter Logic
  const resetInactivityTimer = useCallback(() => {
    setShowUI(true);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    
    // Only auto-hide if we aren't interacting with menus and video is "playing"
    if (!showEpisodes && !seasonDropdownOpen && isPlaying) {
        inactivityTimer.current = setTimeout(() => {
            setShowUI(false);
        }, 3500);
    }
  }, [showEpisodes, seasonDropdownOpen, isPlaying]);

  useEffect(() => {
    resetInactivityTimer();
  }, [showEpisodes, seasonDropdownOpen, resetInactivityTimer]);

  // Global Keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        resetInactivityTimer();
        switch(e.code) {
            case 'Space': 
                e.preventDefault();
                togglePlay(); 
                break;
            case 'ArrowRight': 
                e.preventDefault();
                handleSeek(10); 
                break;
            case 'ArrowLeft': 
                e.preventDefault();
                handleSeek(-10); 
                break;
            case 'ArrowUp':
                e.preventDefault();
                setVolume(v => Math.min(1, v + 0.1));
                break;
            case 'ArrowDown':
                e.preventDefault();
                setVolume(v => Math.max(0, v - 0.1));
                break;
            case 'KeyM': 
                setIsMuted(m => !m); 
                break;
            case 'KeyF': 
                toggleFullscreen(); 
                break;
            case 'Escape':
                if (showEpisodes) setShowEpisodes(false);
                else onClose();
                break;
            case 'KeyS':
                if (showSkipIntro) handleSkipIntro();
                break;
            case 'KeyN':
                if (showNextEpPrompt) handleNextEpisode();
                break;
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousemove', resetInactivityTimer);
        window.removeEventListener('click', resetInactivityTimer);
    };
  }, [resetInactivityTimer, onClose, showEpisodes, isPlaying, showSkipIntro, showNextEpPrompt, handleSeek, handleNextEpisode]);

  return (
    <div className="fixed inset-0 z-[100] bg-black font-sans text-white overflow-hidden select-none group/player">
      
      {/* Video Source Placeholder (Backdrop) */}
      <div className="absolute inset-0 w-full h-full bg-black">
        {/* Buffering Spinner */}
        {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40">
                <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50 z-20">
           <p className="text-gray-500 font-mono text-sm uppercase tracking-widest animate-pulse">
                {mediaType === 'tv' ? `S${selectedSeason}:E${currentEpisode} • ${activeEpisodeData?.name || 'Loading...'}` : movie.title}
           </p>
        </div>
        
        {/* Static Background Image simulating a "Playing" video state */}
        <div className="w-full h-full relative overflow-hidden">
             {/* Dimmed Backdrop */}
             <img 
                src={`${IMG_PATH}${movie.backdrop_path || movie.poster_path}`}
                alt={movie.title}
                className={`w-full h-full object-cover transition-opacity duration-1000 ${isPlaying ? 'opacity-40' : 'opacity-20'}`}
             />
             <div className="absolute inset-0 bg-black/40"></div>
             
             {/* Disclaimer Text */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                 <h1 className="text-2xl md:text-4xl font-bold text-white/20 uppercase tracking-widest mb-4">Demo Playback</h1>
                 <p className="text-white/10 text-sm">Streaming Source Unavailable</p>
             </div>
        </div>
      </div>

      {/* Interaction Layer (Overlay for click-to-play simulation) */}
      <div 
        className={`absolute inset-0 z-20 ${showUI ? 'cursor-default' : 'cursor-none'}`}
        onClick={() => {
            togglePlay();
            resetInactivityTimer();
        }}
        onDoubleClick={toggleFullscreen}
        onMouseMove={resetInactivityTimer}
      />

      {/* --- SMART OVERLAYS --- */}
      
      {/* Skip Intro Button */}
      <div className={`absolute bottom-32 right-12 z-40 transition-all duration-500 transform ${showSkipIntro && showUI ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleSkipIntro(); }}
            className="bg-[#141414]/90 border border-white/20 text-white px-6 py-2 rounded font-bold hover:bg-white/10 hover:border-white transition flex items-center gap-2 backdrop-blur-sm shadow-xl"
          >
              Skip Intro
          </button>
      </div>

      {/* Next Episode Button (Auto-prompt) */}
      <div className={`absolute bottom-32 right-12 z-40 transition-all duration-500 transform ${showNextEpPrompt && showUI && !showSkipIntro ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNextEpisode(); }}
            className="bg-white text-black px-6 py-2.5 rounded font-bold hover:bg-gray-200 transition flex items-center gap-2 shadow-xl"
          >
              Next Episode
              <span className="material-icons text-xl">skip_next</span>
          </button>
      </div>


      {/* --- UI CONTROLS --- */}
      <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-30 pointer-events-none ${showUI || showEpisodes || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* TOP BAR */}
        <div className="p-8 flex justify-between items-start pointer-events-auto bg-gradient-to-b from-black/80 to-transparent">
            <button 
                onClick={onClose} 
                className="group p-2 rounded-full hover:bg-white/10 transition"
            >
                <span className="material-icons text-5xl text-white group-hover:scale-110 transition-transform">arrow_back</span>
            </button>
            <button className="group p-2 rounded-full hover:bg-white/10 transition">
                <span className="material-icons text-4xl text-white opacity-80 group-hover:opacity-100">flag</span>
            </button>
        </div>

        {/* CENTER CONTENT PLACEHOLDER */}
        <div className="flex-1"></div>

        {/* BOTTOM CONTROLS */}
        <div className="bg-gradient-to-t from-black via-black/80 to-transparent px-8 pb-8 pt-20 pointer-events-auto">
            
            {/* Timeline */}
            <div className="relative w-full h-1.5 bg-gray-600/50 hover:h-2.5 transition-all duration-200 rounded-none mb-6 group/timeline cursor-pointer flex items-center" 
                onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const x = e.clientX - rect.left;
                     const perc = (x / rect.width) * 100;
                     setProgress(perc);
                }}
            >
                {/* Buffered Bar */}
                <div className="absolute top-0 left-0 h-full bg-gray-400/50 w-[60%] rounded-none" /> 
                
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-full bg-[#E50914] z-20 rounded-none" style={{ width: `${progress}%` }} />
                
                {/* Scrubber Knob */}
                <div 
                    className="absolute h-5 w-5 bg-[#E50914] rounded-full z-30 scale-0 group-hover/timeline:scale-100 transition-transform shadow-lg border-2 border-white"
                    style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                />
            </div>

            {/* Controls Grid */}
            <div className="flex items-center justify-between">
                
                {/* Left: Playback & Volume */}
                <div className="flex items-center space-x-8">
                    <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="hover:text-gray-300 text-white transition focus:outline-none transform hover:scale-110">
                        <span className="material-icons text-[3.5rem]">{isPlaying ? 'pause' : 'play_arrow'}</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleSeek(-10); }} className="hover:text-gray-300 text-white transition relative group focus:outline-none transform hover:scale-110">
                        <span className="material-icons text-[3.5rem]">replay_10</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); handleSeek(10); }} className="hover:text-gray-300 text-white transition relative group focus:outline-none transform hover:scale-110">
                        <span className="material-icons text-[3.5rem]">forward_10</span>
                    </button>
                    
                    {/* Volume Control */}
                    <div className="flex items-center group/vol relative">
                        <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="hover:text-gray-300 text-white transition focus:outline-none transform hover:scale-110">
                            <span className="material-icons text-[3.5rem]">{isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}</span>
                        </button>
                        <div className="w-0 overflow-hidden group-hover/vol:w-32 transition-all duration-300 ml-2 flex items-center">
                             <input 
                                type="range" 
                                min="0" max="1" step="0.05" 
                                value={isMuted ? 0 : volume}
                                onChange={(e) => {
                                    setVolume(parseFloat(e.target.value));
                                    setIsMuted(parseFloat(e.target.value) === 0);
                                }}
                                onClick={(e) => e.stopPropagation()}
                                className="h-1.5 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-[#E50914] w-28"
                             />
                        </div>
                    </div>
                </div>

                {/* Center: Title Info */}
                <div className="hidden lg:flex flex-col items-center text-center px-4 cursor-default flex-1">
                    <h3 className="text-xl font-bold text-white tracking-wide drop-shadow-md">{movie.title || movie.name}</h3>
                    {mediaType === 'tv' && activeEpisodeData && (
                        <div className="flex items-center text-lg font-medium text-gray-300 mt-1 drop-shadow-md">
                            <span className="font-bold mr-2">S{selectedSeason}:E{activeEpisodeData.episode_number}</span>
                            <span className="text-gray-400 mx-2">{activeEpisodeData.name}</span>
                        </div>
                    )}
                </div>

                {/* Right: Tools */}
                <div className="flex items-center space-x-8">
                    {mediaType === 'tv' && (
                        <>
                            <button 
                                onClick={(e) => { e.stopPropagation(); handleNextEpisode(); }}
                                className="hover:text-gray-300 text-white transition focus:outline-none transform hover:scale-110"
                                title="Next Episode"
                            >
                                <span className="material-icons text-[3.5rem]">skip_next</span>
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setShowEpisodes(!showEpisodes); }}
                                className={`transition transform hover:scale-110 ${showEpisodes ? 'text-[#E50914]' : 'text-white hover:text-gray-300'}`}
                                title="Episodes"
                            >
                                <span className="material-icons text-[3.5rem] -scale-x-100">video_library</span> 
                            </button>
                        </>
                    )}
                    
                    <button className="text-white hover:text-gray-300 transition transform hover:scale-110" title="Audio & Subtitles">
                        <span className="material-icons text-[3.5rem]">subtitles</span>
                    </button>
                    <button className="text-white hover:text-gray-300 transition transform hover:scale-110" title="Playback Speed">
                        <span className="material-icons text-[3.5rem]">speed</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="text-white hover:text-gray-300 transition transform hover:scale-110" title="Fullscreen">
                        <span className="material-icons text-[3.5rem]">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- SIDE PANEL: EPISODES --- */}
      {mediaType === 'tv' && (
          <div 
            className={`absolute top-0 right-0 h-full w-full sm:w-[500px] bg-[#141414]/95 backdrop-blur-xl z-[110] transform transition-transform duration-300 ease-out flex flex-col pointer-events-auto border-l border-white/10
            ${showEpisodes ? 'translate-x-0' : 'translate-x-full'}`}
          >
              {/* Panel Header */}
              <div className="p-8 flex items-center justify-between bg-[#141414] sticky top-0 z-20 shadow-xl border-b border-gray-800">
                  <div className="flex flex-col">
                      <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-3">Episodes</div>
                      <div className="relative">
                          <button 
                            onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                            className="flex items-center text-xl font-bold text-white hover:text-gray-300 transition bg-black/40 px-4 py-2 rounded border border-white/20 gap-3 min-w-[160px] justify-between"
                          >
                              <span>Season {selectedSeason}</span>
                              <span className="material-icons text-2xl">arrow_drop_down</span>
                          </button>

                          {/* Season Dropdown Menu */}
                          {seasonDropdownOpen && (
                              <div className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[#242424] border border-gray-600 rounded shadow-2xl z-50 max-h-60 overflow-y-auto scrollbar-hide py-1">
                                  {seasonList.map(s => (
                                      <div 
                                        key={s} 
                                        className={`px-5 py-3 cursor-pointer text-base flex items-center justify-between border-b border-gray-700 last:border-0 hover:bg-[#333] ${selectedSeason === s ? 'text-white font-bold bg-white/5' : 'text-gray-300'}`}
                                        onClick={() => {
                                            setSelectedSeason(s);
                                            setSeasonDropdownOpen(false);
                                            fetchSeasonData(s);
                                        }}
                                      >
                                          Season {s}
                                          {selectedSeason === s && <span className="material-icons text-base text-[#E50914]">check</span>}
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
                  <button onClick={() => setShowEpisodes(false)} className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition group">
                      <span className="material-icons text-3xl text-white group-hover:scale-110">close</span>
                  </button>
              </div>

              {/* Episode List */}
              <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#141414]">
                  {isLoadingEpisodes ? (
                      <div className="flex justify-center items-center h-40">
                          <div className="w-10 h-10 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
                      </div>
                  ) : (
                      <div className="flex flex-col pb-6">
                          {currentSeasonEpisodes.map((ep) => {
                              const isCurrent = currentEpisode === ep.episode_number;
                              return (
                                <div 
                                    key={ep.id}
                                    onClick={() => handleEpisodeChange(ep)}
                                    className={`group cursor-pointer border-b border-gray-800 transition-all duration-200
                                        ${isCurrent ? 'bg-[#1a1a1a]' : 'hover:bg-[#1f1f1f]'}`}
                                >
                                    {isCurrent ? (
                                        // EXPANDED VIEW (Active)
                                        <div className="flex flex-col p-6 bg-[#1a1a1a] border-l-4 border-[#E50914]">
                                            <div className="flex items-center mb-4">
                                                <span className="text-2xl font-bold text-white mr-6 w-8 text-center">{ep.episode_number}</span>
                                                <span className="text-lg font-bold text-white flex-1 leading-tight">{ep.name}</span>
                                            </div>
                                            <div className="flex">
                                                {/* Thumbnail */}
                                                <div className="relative w-40 h-24 bg-[#222] rounded overflow-hidden mr-5 flex-shrink-0 shadow-lg border border-white/10">
                                                    {ep.still_path ? (
                                                        <img src={`${IMG_PATH}${ep.still_path}`} className="w-full h-full object-cover opacity-80" alt={ep.name} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="material-icons text-white text-4xl drop-shadow-md">equalizer</span>
                                                    </div>
                                                </div>
                                                {/* Description */}
                                                <p className="text-sm text-gray-400 line-clamp-3 leading-relaxed">
                                                    {ep.overview || "No description available for this episode."}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        // COMPACT VIEW (Inactive)
                                        <div className="flex items-center p-5 min-h-[5rem]">
                                            <span className="text-xl text-gray-500 font-bold mr-6 w-8 text-center group-hover:text-gray-300 transition-colors">{ep.episode_number}</span>
                                            <div className="flex-1 min-w-0 flex items-center justify-between pr-2">
                                                <span className="text-base font-bold text-gray-300 group-hover:text-white truncate pr-4 transition-colors">{ep.name}</span>
                                                <span className="text-sm text-gray-500 font-medium flex-shrink-0">{ep.runtime ? `${ep.runtime}m` : ''}</span>
                                            </div>
                                            <div className="w-10 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-icons text-white text-3xl">play_circle_outline</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                              );
                          })}
                      </div>
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default VideoPlayer;