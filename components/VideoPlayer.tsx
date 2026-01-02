import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Movie, Episode } from '../types';
import { getSeasonDetails, getMovieDetails } from '../services/api';
import { IMG_PATH } from '../constants';

interface VideoPlayerProps {
  movie: Movie;
  season?: number;
  episode?: number;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, season = 1, episode = 1, onClose }) => {
  const [showUI, setShowUI] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [seasonList, setSeasonList] = useState<number[]>([]);
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  
  // Playback State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [progress, setProgress] = useState(0); 
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Smart Features State
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextEpPrompt, setShowNextEpPrompt] = useState(false);

  const inactivityTimer = useRef<any>(null);
  const progressInterval = useRef<any>(null);

  // --- VIDEO SOURCE LOGIC ---
  const getVideoSource = (id: number, type: string, s: number, e: number) => {
    return `about:blank`; 
  };

  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const src = getVideoSource(movie.id, mediaType, selectedSeason, currentEpisode);
  const activeEpisodeData = currentSeasonEpisodes.find(e => e.episode_number === currentEpisode);

  // --- DATA FETCHING ---
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

  // --- SMART PLAYBACK LOGIC ---
  
  // Progress & Timed Events
  useEffect(() => {
      if (isPlaying && !isBuffering) {
          progressInterval.current = setInterval(() => {
              setProgress(prev => {
                  if (prev >= 100) {
                      setIsPlaying(false);
                      return 100;
                  }
                  
                  // Simulate progress (approx 30 mins duration for demo)
                  const newProgress = prev + 0.05; 

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

  // --- CONTROLS LOGIC ---
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
              const change = (amount / 3600) * 100; // rough calc based on hour duration
              return Math.min(100, Math.max(0, prev + change));
          });
          setIsBuffering(false);
      }, 300);
      resetInactivityTimer();
  }, []);

  const handleNextEpisode = useCallback(() => {
      const currentIndex = currentSeasonEpisodes.findIndex(e => e.episode_number === currentEpisode);
      
      let nextEp: Episode | undefined;
      let nextSeason = selectedSeason;

      if (currentIndex !== -1 && currentIndex < currentSeasonEpisodes.length - 1) {
          // Next ep in current season
          nextEp = currentSeasonEpisodes[currentIndex + 1];
      } else if (seasonList.includes(selectedSeason + 1)) {
          // First ep of next season (Logic simplified: normally requires fetch)
          nextSeason = selectedSeason + 1;
          setSelectedSeason(nextSeason);
          // Trigger fetch in effect, but for now we reset
          setIsBuffering(true);
          // In real app, wait for fetch. Here we just simulate a reset/load
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

  // UI Hiding
  const resetInactivityTimer = useCallback(() => {
    setShowUI(true);
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    if (!showEpisodes && !seasonDropdownOpen && isPlaying) {
        inactivityTimer.current = setTimeout(() => {
            setShowUI(false);
        }, 3000);
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
    
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('mousemove', resetInactivityTimer);
    };
  }, [resetInactivityTimer, onClose, showEpisodes, isPlaying, showSkipIntro, showNextEpPrompt, handleSeek, handleNextEpisode]);

  return (
    <div className="fixed inset-0 z-[100] bg-black font-sans text-white overflow-hidden select-none group/player">
      
      {/* Background Iframe / Video Source */}
      <div className="absolute inset-0 w-full h-full bg-black">
        {/* Buffering Spinner */}
        {isBuffering && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40">
                <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
           <p className="text-gray-500 font-mono text-sm uppercase tracking-widest">
                {mediaType === 'tv' ? `S${selectedSeason}:E${currentEpisode} • ${activeEpisodeData?.name || 'Loading...'}` : movie.title}
           </p>
        </div>
        <iframe
          src={src}
          className="w-full h-full border-0 relative z-10 opacity-70 pointer-events-none" 
          allow="autoplay; encrypted-media; fullscreen"
          title={movie.title || movie.name}
        />
      </div>

      {/* Interaction Layer (Click to Play/Pause) */}
      <div 
        className="absolute inset-0 z-20 cursor-default"
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        onMouseMove={resetInactivityTimer}
      />

      {/* --- SMART OVERLAYS --- */}
      
      {/* Skip Intro Button */}
      <div className={`absolute bottom-32 right-12 z-40 transition-all duration-500 transform ${showSkipIntro && showUI ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          <button 
            onClick={handleSkipIntro}
            className="bg-[#141414]/90 border border-white/20 text-white px-6 py-2 rounded font-bold hover:bg-white/10 hover:border-white transition flex items-center gap-2 backdrop-blur-sm shadow-xl"
          >
              Skip Intro
          </button>
      </div>

      {/* Next Episode Button (Auto-prompt) */}
      <div className={`absolute bottom-32 right-12 z-40 transition-all duration-500 transform ${showNextEpPrompt && showUI && !showSkipIntro ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
          <button 
            onClick={handleNextEpisode}
            className="bg-white text-black px-6 py-2.5 rounded font-bold hover:bg-gray-200 transition flex items-center gap-2 shadow-xl"
          >
              Next Episode
              <span className="material-icons text-xl">skip_next</span>
          </button>
      </div>


      {/* --- UI CONTROLS --- */}
      <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-30 pointer-events-none ${showUI || showEpisodes || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* TOP BAR */}
        <div className="bg-gradient-to-b from-black/90 via-black/40 to-transparent p-6 flex justify-between items-start pointer-events-auto">
            <button 
                onClick={onClose} 
                className="group p-2 rounded-full hover:bg-white/10 transition"
                title="Back to Browse"
            >
                <span className="material-icons text-4xl text-white group-hover:scale-110 transition-transform">arrow_back</span>
            </button>
            <div className="flex gap-4">
                <button className="group p-2 rounded-full hover:bg-white/10 transition">
                    <span className="material-icons text-3xl text-white opacity-80 group-hover:opacity-100">flag</span>
                </button>
            </div>
        </div>

        {/* CENTER CONTENT PLACEHOLDER */}
        <div className="flex-1"></div>

        {/* BOTTOM CONTROLS */}
        <div className="bg-gradient-to-t from-[#141414] via-[#141414]/90 to-transparent px-4 md:px-6 pb-6 pt-12 pointer-events-auto">
            
            {/* Timeline */}
            <div className="relative w-full h-1.5 bg-gray-600/50 hover:h-2.5 transition-all duration-200 rounded-sm mb-4 group/timeline cursor-pointer flex items-center" 
                onClick={(e) => {
                     const rect = e.currentTarget.getBoundingClientRect();
                     const x = e.clientX - rect.left;
                     const perc = (x / rect.width) * 100;
                     setProgress(perc);
                }}
            >
                {/* Buffered Bar */}
                <div className="absolute top-0 left-0 h-full bg-gray-400/50 w-[60%] rounded-sm" /> 
                
                {/* Progress Bar */}
                <div className="absolute top-0 left-0 h-full bg-[#E50914] z-20 rounded-sm" style={{ width: `${progress}%` }} />
                
                {/* Scrubber Knob */}
                <div 
                    className="absolute h-5 w-5 bg-[#E50914] rounded-full z-30 scale-0 group-hover/timeline:scale-100 transition-transform shadow-lg border border-black/20"
                    style={{ left: `${progress}%`, transform: 'translateX(-50%)' }}
                />
                
                {/* Tooltip on hover (Optional Enhancement) */}
                <div className="absolute -top-10 left-0 bg-[#141414] text-white text-xs px-2 py-1 rounded hidden group-hover/timeline:block transform -translate-x-1/2" style={{ left: `${progress}%` }}>
                    {Math.floor((progress / 100) * 30)}:{(Math.floor(((progress / 100) * 30 * 60) % 60)).toString().padStart(2, '0')}
                </div>
            </div>

            {/* Controls Grid */}
            <div className="flex items-center justify-between">
                
                {/* Left: Playback & Volume */}
                <div className="flex items-center space-x-6">
                    <button onClick={togglePlay} className="hover:text-gray-300 text-white transition focus:outline-none">
                        <span className="material-icons text-4xl md:text-5xl">{isPlaying ? 'pause' : 'play_arrow'}</span>
                    </button>
                    <button onClick={() => handleSeek(-10)} className="hover:text-gray-300 text-white transition relative group focus:outline-none">
                        <span className="material-icons text-4xl">replay_10</span>
                    </button>
                    <button onClick={() => handleSeek(10)} className="hover:text-gray-300 text-white transition relative group focus:outline-none">
                        <span className="material-icons text-4xl">forward_10</span>
                    </button>
                    
                    {/* Volume Control */}
                    <div className="flex items-center group/vol">
                        <button onClick={() => setIsMuted(!isMuted)} className="hover:text-gray-300 text-white transition focus:outline-none">
                            <span className="material-icons text-3xl md:text-4xl">{isMuted || volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}</span>
                        </button>
                        <div className="w-0 overflow-hidden group-hover/vol:w-28 transition-all duration-300 ml-1 flex items-center">
                             <input 
                                type="range" 
                                min="0" max="1" step="0.05" 
                                value={isMuted ? 0 : volume}
                                onChange={(e) => {
                                    setVolume(parseFloat(e.target.value));
                                    setIsMuted(parseFloat(e.target.value) === 0);
                                }}
                                className="h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-[#E50914] w-24 ml-2"
                             />
                        </div>
                    </div>
                </div>

                {/* Center: Title Info (Desktop) */}
                <div className="hidden lg:flex flex-col items-center text-center px-4 cursor-default">
                    <h3 className="text-lg font-bold text-white tracking-wide">{movie.title || movie.name}</h3>
                    {mediaType === 'tv' && activeEpisodeData && (
                        <div className="flex items-center text-sm font-medium text-gray-300 mt-1">
                            <span className="text-[#E50914] font-bold mr-2">S{selectedSeason}:E{activeEpisodeData.episode_number}</span>
                            <span className="text-gray-400">|</span>
                            <span className="ml-2">{activeEpisodeData.name}</span>
                        </div>
                    )}
                </div>

                {/* Right: Tools */}
                <div className="flex items-center space-x-5">
                    {mediaType === 'tv' && (
                        <>
                            <button 
                                onClick={handleNextEpisode}
                                className="hidden sm:flex items-center hover:text-white text-gray-400 transition font-bold uppercase text-xs tracking-wider"
                                title="Next Episode (N)"
                            >
                                Next Ep
                                <span className="material-icons text-3xl ml-1 text-gray-400 group-hover:text-white">skip_next</span>
                            </button>
                            <button 
                                onClick={() => setShowEpisodes(!showEpisodes)}
                                className={`transition transform hover:scale-105 ${showEpisodes ? 'text-[#E50914]' : 'text-gray-300 hover:text-white'}`}
                                title="Episodes List"
                            >
                                <span className="material-icons text-4xl -scale-x-100">style</span> 
                            </button>
                        </>
                    )}
                    
                    <button className="text-gray-300 hover:text-white transition transform hover:scale-105" title="Subtitles">
                        <span className="material-icons text-3xl">subtitles</span>
                    </button>
                    <button className="text-gray-300 hover:text-white transition transform hover:scale-105" title="Playback Speed">
                        <span className="material-icons text-3xl">speed</span>
                    </button>
                    <button onClick={toggleFullscreen} className="text-gray-300 hover:text-white transition transform hover:scale-105" title="Fullscreen (F)">
                        <span className="material-icons text-4xl">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span>
                    </button>
                </div>
            </div>
        </div>
      </div>

      {/* --- SIDE PANEL: EPISODES --- */}
      {mediaType === 'tv' && (
          <div 
            className={`absolute top-0 right-0 h-full w-full sm:w-[450px] bg-[#141414]/95 backdrop-blur-xl z-[110] transform transition-transform duration-300 ease-out flex flex-col pointer-events-auto border-l border-white/10
            ${showEpisodes ? 'translate-x-0' : 'translate-x-full'}`}
          >
              {/* Panel Header */}
              <div className="p-6 flex items-center justify-between bg-[#141414] sticky top-0 z-20 shadow-md">
                  <div className="flex flex-col">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Episodes</div>
                      <div className="relative">
                          <button 
                            onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                            className="flex items-center text-lg font-bold text-white hover:text-gray-300 transition bg-black/40 px-3 py-1.5 rounded border border-white/20 gap-2 min-w-[140px] justify-between"
                          >
                              <span>Season {selectedSeason}</span>
                              <span className="material-icons text-xl">arrow_drop_down</span>
                          </button>

                          {/* Season Dropdown Menu */}
                          {seasonDropdownOpen && (
                              <div className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-[#242424] border border-gray-600 rounded shadow-2xl z-50 max-h-60 overflow-y-auto scrollbar-hide py-1">
                                  {seasonList.map(s => (
                                      <div 
                                        key={s} 
                                        className={`px-4 py-3 cursor-pointer text-sm flex items-center justify-between border-b border-gray-700 last:border-0 hover:bg-[#333] ${selectedSeason === s ? 'text-white font-bold bg-white/5' : 'text-gray-300'}`}
                                        onClick={() => {
                                            setSelectedSeason(s);
                                            setSeasonDropdownOpen(false);
                                            fetchSeasonData(s);
                                        }}
                                      >
                                          Season {s}
                                          {selectedSeason === s && <span className="material-icons text-sm text-[#E50914]">check</span>}
                                      </div>
                                  ))}
                              </div>
                          )}
                      </div>
                  </div>
                  <button onClick={() => setShowEpisodes(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition">
                      <span className="material-icons text-2xl text-white">close</span>
                  </button>
              </div>

              {/* Episode List */}
              <div className="flex-1 overflow-y-auto scrollbar-hide bg-[#141414]">
                  {isLoadingEpisodes ? (
                      <div className="flex justify-center items-center h-40">
                          <div className="w-8 h-8 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
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
                                        <div className="flex flex-col p-5 bg-[#1a1a1a] border-l-4 border-[#E50914]">
                                            <div className="flex items-center mb-3">
                                                <span className="text-xl font-bold text-white mr-4 w-6 text-center">{ep.episode_number}</span>
                                                <span className="text-base font-bold text-white flex-1 leading-tight">{ep.name}</span>
                                            </div>
                                            <div className="flex">
                                                {/* Thumbnail */}
                                                <div className="relative w-36 h-20 bg-[#222] rounded overflow-hidden mr-4 flex-shrink-0 shadow-md">
                                                    {ep.still_path ? (
                                                        <img src={`${IMG_PATH}${ep.still_path}`} className="w-full h-full object-cover opacity-80" alt={ep.name} />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">No Image</div>
                                                    )}
                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                        <span className="material-icons text-white text-3xl drop-shadow-md">equalizer</span>
                                                    </div>
                                                </div>
                                                {/* Description */}
                                                <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                                                    {ep.overview || "No description available for this episode."}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        // COMPACT VIEW (Inactive)
                                        <div className="flex items-center p-4 min-h-[4rem]">
                                            <span className="text-lg text-gray-500 font-medium mr-4 w-6 text-center group-hover:text-gray-300 transition-colors">{ep.episode_number}</span>
                                            <div className="flex-1 min-w-0 flex items-center justify-between pr-2">
                                                <span className="text-sm font-bold text-gray-200 group-hover:text-white truncate pr-4 transition-colors">{ep.name}</span>
                                                <span className="text-xs text-gray-500 font-medium flex-shrink-0">{ep.runtime ? `${ep.runtime}m` : ''}</span>
                                            </div>
                                            <div className="w-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-icons text-white text-2xl">play_circle_outline</span>
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