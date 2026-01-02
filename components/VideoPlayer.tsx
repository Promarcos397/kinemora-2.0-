import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';
import { Movie, Episode } from '../types';
import { getSeasonDetails, getMovieDetails, getExternalId } from '../services/api';

interface VideoPlayerProps {
  movie: Movie;
  season?: number;
  episode?: number;
  onClose: () => void;
}

// Workaround for ReactPlayer type definition issue in some environments
const ReactPlayerAny = ReactPlayer as any;

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, season = 1, episode = 1, onClose }) => {
  // UI State
  const [showUI, setShowUI] = useState(true);
  const [showEpisodes, setShowEpisodes] = useState(false);
  const [seasonDropdownOpen, setSeasonDropdownOpen] = useState(false);
  
  // Data State
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamError, setStreamError] = useState(false);
  const [seasonList, setSeasonList] = useState<number[]>([]);
  const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState<Episode[]>([]);
  const [selectedSeason, setSelectedSeason] = useState(season);
  const [currentEpisode, setCurrentEpisode] = useState(episode);
  const [activeEpisodeData, setActiveEpisodeData] = useState<Episode | undefined>(undefined);
  const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

  // Playback State
  const [isPlaying, setIsPlaying] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Smart Features
  const [showSkipIntro, setShowSkipIntro] = useState(false);
  const [showNextEpPrompt, setShowNextEpPrompt] = useState(false);

  const inactivityTimer = useRef<any>(null);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');

  // --- 1. FETCH VIDEO STREAM ---
  useEffect(() => {
    let isMounted = true;
    const fetchStream = async () => {
      setStreamUrl(null);
      setStreamError(false);
      setIsBuffering(true);

      try {
        // A. Get IMDb ID
        const imdbId = await getExternalId(movie.id, mediaType as 'movie' | 'tv');
        
        if (!imdbId) {
            console.error("No IMDb ID found");
            if (isMounted) setStreamError(true);
            return;
        }

        // B. Construct Vercel API URL
        let apiUrl = `https://vidsrc-calls.vercel.app/vidsrc/${imdbId}`;
        if (mediaType === 'tv') {
            apiUrl += `?s=${selectedSeason}&e=${currentEpisode}`;
        }

        // C. Fetch from Vercel API
        const response = await axios.get(apiUrl);
        
        if (isMounted) {
            if (response.data?.sources?.length > 0) {
                const source = response.data.sources[0]; 
                if (source?.data?.stream) {
                    setStreamUrl(source.data.stream);
                } else {
                    setStreamError(true);
                }
            } else {
                setStreamError(true);
            }
        }
      } catch (err) {
          console.error("Error fetching stream:", err);
          if (isMounted) setStreamError(true);
      } finally {
          if (isMounted && !streamUrl) setIsBuffering(false); 
      }
    };

    fetchStream();
    return () => { isMounted = false; };
  }, [movie.id, mediaType, selectedSeason, currentEpisode]);

  // --- 2. FETCH EPISODE DATA (TV Only) ---
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

  useEffect(() => {
     if (currentSeasonEpisodes.length > 0) {
         const ep = currentSeasonEpisodes.find(e => e.episode_number === currentEpisode);
         setActiveEpisodeData(ep);
     }
  }, [currentEpisode, currentSeasonEpisodes]);

  // --- 3. PLAYER EVENT HANDLERS ---
  const handleProgress = (state: any) => {
      if (!isBuffering) {
          const perc = state.played * 100;
          setProgress(perc);
          setShowSkipIntro(perc > 1 && perc < 5);
          setShowNextEpPrompt(perc > 95);
      }
  };

  const handleSeek = (amountSeconds: number) => {
      if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime();
          playerRef.current.seekTo(currentTime + amountSeconds);
          resetInactivityTimer();
      }
  };

  const handleSeekToPercentage = (perc: number) => {
      if (playerRef.current) {
          setIsBuffering(true);
          playerRef.current.seekTo(perc / 100, 'fraction');
          setProgress(perc);
      }
  };

  const togglePlay = () => setIsPlaying(!isPlaying);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
        containerRef.current.requestFullscreen().catch((e) => console.log(e));
        setIsFullscreen(true);
    } else {
        document.exitFullscreen();
        setIsFullscreen(false);
    }
  };

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
    window.addEventListener('mousemove', resetInactivityTimer);
    return () => {
        window.removeEventListener('mousemove', resetInactivityTimer);
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [resetInactivityTimer]);

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          resetInactivityTimer();
          switch(e.code) {
              case 'Space': e.preventDefault(); togglePlay(); break;
              case 'ArrowRight': e.preventDefault(); handleSeek(10); break;
              case 'ArrowLeft': e.preventDefault(); handleSeek(-10); break;
              case 'ArrowUp': e.preventDefault(); setVolume(v => Math.min(1, v + 0.1)); break;
              case 'ArrowDown': e.preventDefault(); setVolume(v => Math.max(0, v - 0.1)); break;
              case 'KeyF': toggleFullscreen(); break;
              case 'Escape': onClose(); break;
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, onClose]);

  const handleEpisodeChange = (ep: Episode) => {
      setIsBuffering(true);
      setCurrentEpisode(ep.episode_number);
      setProgress(0);
      setStreamUrl(null); // Force reload state
      setStreamError(false);
  };

  const handleNextEpisode = () => {
      const nextEpNum = currentEpisode + 1;
      const nextEp = currentSeasonEpisodes.find(e => e.episode_number === nextEpNum);
      
      if (nextEp) {
          handleEpisodeChange(nextEp);
      } else {
          // Try next season
          const nextSeason = selectedSeason + 1;
          if (seasonList.includes(nextSeason)) {
             setSelectedSeason(nextSeason);
             setCurrentEpisode(1);
             setIsBuffering(true);
             setStreamUrl(null);
             setStreamError(false);
          }
      }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[100] bg-black font-sans text-white overflow-hidden select-none group/player">
      <div className="absolute inset-0 w-full h-full bg-black">
        {streamUrl ? (
            <ReactPlayerAny
                ref={playerRef}
                url={streamUrl}
                width="100%"
                height="100%"
                playing={isPlaying}
                volume={volume}
                muted={isMuted}
                onProgress={handleProgress}
                onBuffer={() => setIsBuffering(true)}
                onBufferEnd={() => setIsBuffering(false)}
                onEnded={() => setShowNextEpPrompt(true)}
                onError={() => {
                    setStreamError(true);
                    setStreamUrl(null);
                }}
                config={{ file: { forceHLS: true, attributes: { crossOrigin: "anonymous" } } } as any}
            />
        ) : (
            <div className="absolute inset-0 flex items-center justify-center">
                {streamError ? (
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-2">Stream Unavailable</div>
                        <div className="text-gray-500 text-sm">We couldn't find a stream for this title.</div>
                    </div>
                ) : (
                    <div className="text-gray-500 animate-pulse">Connecting to server...</div>
                )}
            </div>
        )}
        {isBuffering && !streamError && (
            <div className="absolute inset-0 flex items-center justify-center z-50 bg-black/40 pointer-events-none">
                <div className="w-16 h-16 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin"></div>
            </div>
        )}
      </div>

      <div className="absolute inset-0 z-20" onClick={togglePlay} onDoubleClick={toggleFullscreen} />

      {/* Overlays */}
      {showSkipIntro && showUI && (
          <div className="absolute bottom-32 right-12 z-40 animate-fadeIn">
              <button onClick={() => handleSeek(80)} className="bg-[#141414]/90 border border-white/20 text-white px-6 py-2 rounded font-bold hover:bg-white/10 transition backdrop-blur-sm">Skip Intro</button>
          </div>
      )}
      {showNextEpPrompt && showUI && (
          <div className="absolute bottom-32 right-12 z-40 animate-fadeIn">
              <button onClick={handleNextEpisode} className="bg-white text-black px-6 py-2.5 rounded font-bold hover:bg-gray-200 transition flex items-center gap-2 shadow-xl">Next Episode <span className="material-icons text-xl">skip_next</span></button>
          </div>
      )}

      {/* Controls UI */}
      <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-30 pointer-events-none ${showUI || showEpisodes || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-gradient-to-b from-black/90 via-black/40 to-transparent p-6 flex justify-between items-start pointer-events-auto">
            <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 transition"><span className="material-icons text-4xl text-white">arrow_back</span></button>
            <div className="md:hidden text-center">
               <div className="text-sm font-bold truncate max-w-[200px]">{movie.title || movie.name}</div>
               {mediaType === 'tv' && <div className="text-xs text-gray-400">S{selectedSeason}:E{currentEpisode}</div>}
            </div>
        </div>
        
        <div className="bg-gradient-to-t from-[#141414] via-[#141414]/90 to-transparent px-6 pb-6 pt-12 pointer-events-auto">
            <div className="relative w-full h-1.5 bg-gray-600/50 hover:h-2.5 transition-all duration-200 rounded-sm mb-4 cursor-pointer group/timeline flex items-center" onClick={(e) => { const rect = e.currentTarget.getBoundingClientRect(); handleSeekToPercentage(((e.clientX - rect.left) / rect.width) * 100); }}>
                <div className="absolute top-0 left-0 h-full bg-[#E50914] z-20 rounded-sm" style={{ width: `${progress}%` }} />
                <div className="absolute h-5 w-5 bg-[#E50914] rounded-full z-30 scale-0 group-hover/timeline:scale-100 transition-transform shadow-lg" style={{ left: `${progress}%`, transform: 'translateX(-50%)' }} />
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    <button onClick={togglePlay} className="hover:text-gray-300 transition"><span className="material-icons text-5xl">{isPlaying ? 'pause' : 'play_arrow'}</span></button>
                    <button onClick={() => handleSeek(-10)} className="hover:text-gray-300 transition"><span className="material-icons text-4xl">replay_10</span></button>
                    <button onClick={() => handleSeek(10)} className="hover:text-gray-300 transition"><span className="material-icons text-4xl">forward_10</span></button>
                    <div className="flex items-center group/vol">
                        <button onClick={() => setIsMuted(!isMuted)} className="hover:text-gray-300 transition"><span className="material-icons text-3xl">{isMuted || volume === 0 ? 'volume_off' : 'volume_up'}</span></button>
                        <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300 ml-2">
                             <input type="range" min="0" max="1" step="0.05" value={isMuted ? 0 : volume} onChange={(e) => { setVolume(parseFloat(e.target.value)); setIsMuted(false); }} className="h-1 bg-gray-500 rounded-lg appearance-none cursor-pointer accent-[#E50914] w-full" />
                        </div>
                    </div>
                </div>
                
                <div className="hidden lg:flex flex-col items-center">
                    <h3 className="text-lg font-bold">{movie.title || movie.name}</h3>
                    {mediaType === 'tv' && <span className="text-sm text-gray-300">S{selectedSeason}:E{currentEpisode} {activeEpisodeData ? `• ${activeEpisodeData.name}` : ''}</span>}
                </div>

                <div className="flex items-center space-x-5">
                    {mediaType === 'tv' && (
                        <>
                            <button onClick={handleNextEpisode} className="flex items-center hover:text-white text-gray-400 font-bold uppercase text-xs" title="Next Ep">Next <span className="material-icons text-2xl ml-1">skip_next</span></button>
                            <button onClick={() => setShowEpisodes(!showEpisodes)} className={`transition hover:text-white ${showEpisodes ? 'text-[#E50914]' : 'text-gray-300'}`} title="Episodes"><span className="material-icons text-4xl -scale-x-100">style</span></button>
                        </>
                    )}
                    <button onClick={toggleFullscreen} className="hover:text-white text-gray-300 transition"><span className="material-icons text-4xl">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span></button>
                </div>
            </div>
        </div>
      </div>

      {/* Episodes Panel */}
      {mediaType === 'tv' && (
          <div className={`absolute top-0 right-0 h-full w-[400px] bg-[#141414]/95 backdrop-blur-xl z-[110] transition-transform duration-300 border-l border-white/10 ${showEpisodes ? 'translate-x-0' : 'translate-x-full'}`}>
              <div className="p-6 flex items-center justify-between border-b border-gray-700">
                  <div className="flex flex-col">
                    <h3 className="text-lg font-bold uppercase text-gray-400">Episodes</h3>
                    <div className="relative mt-2">
                         <button 
                            onClick={() => setSeasonDropdownOpen(!seasonDropdownOpen)}
                            className="flex items-center bg-black/50 border border-white/20 px-3 py-1 rounded text-sm font-bold"
                         >
                            Season {selectedSeason} <span className="material-icons ml-1">arrow_drop_down</span>
                         </button>
                         {seasonDropdownOpen && (
                             <div className="absolute top-full left-0 mt-1 w-32 bg-[#222] border border-gray-700 rounded shadow-xl max-h-60 overflow-y-auto z-50">
                                 {seasonList.map(s => (
                                     <div 
                                        key={s} 
                                        onClick={() => { setSelectedSeason(s); setSeasonDropdownOpen(false); }}
                                        className={`px-4 py-2 text-sm cursor-pointer hover:bg-white/10 ${selectedSeason === s ? 'text-[#E50914] font-bold' : ''}`}
                                     >
                                        Season {s}
                                     </div>
                                 ))}
                             </div>
                         )}
                    </div>
                  </div>
                  <button onClick={() => setShowEpisodes(false)}><span className="material-icons text-2xl">close</span></button>
              </div>
              <div className="p-4 overflow-y-auto h-full pb-20 scrollbar-hide">
                  {isLoadingEpisodes ? (
                      <div className="flex justify-center py-10"><div className="w-8 h-8 border-2 border-[#E50914] border-t-transparent rounded-full animate-spin"></div></div>
                  ) : (
                      currentSeasonEpisodes.map(ep => (
                        <div key={ep.id} onClick={() => handleEpisodeChange(ep)} className={`flex gap-4 p-4 border-b border-gray-800 cursor-pointer hover:bg-white/5 transition ${currentEpisode === ep.episode_number ? 'bg-white/10 border-l-4 border-[#E50914]' : ''}`}>
                            <span className="font-bold text-gray-500 text-lg w-6">{ep.episode_number}</span>
                            <div className="flex-1">
                                <h4 className="font-bold text-sm mb-1">{ep.name}</h4>
                                <p className="text-xs text-gray-400 line-clamp-2">{ep.overview}</p>
                            </div>
                        </div>
                      ))
                  )}
              </div>
          </div>
      )}
    </div>
  );
};

export default VideoPlayer;