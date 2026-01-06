import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Hls from 'hls.js';
import { Movie, Episode } from '../types';
import { getSeasonDetails, getMovieDetails, getExternalIds } from '../services/api';

import { streamService } from '../services/stream/StreamService';
import { useGlobalContext } from '../context/GlobalContext';
import { parseSubtitles, captionIsVisible, sanitize, CaptionCueType, makeQueId } from '../utils/captions';

import { getSkipIntervals, SkipInterval } from '../services/IntroService';
import VideoPlayerControls from './VideoPlayerControls';
import VideoPlayerSettings from './VideoPlayerSettings';
import { SkipForwardIcon, ArrowLeftIcon } from '@phosphor-icons/react';

interface VideoPlayerProps {
    movie: Movie;
    season?: number;
    episode?: number;
    onClose: () => void;
}

// Caption Rendering Component
const CaptionCue: React.FC<{ cue: CaptionCueType }> = ({ cue }) => {
    const { settings } = useGlobalContext();

    const parsedHtml = useMemo(() => {
        let textToUse = cue.content;
        const textWithNewlines = (textToUse || "")
            .replaceAll(/ i'/g, " I'")
            .replaceAll(/\r?\n/g, "<br />");

        return sanitize(textWithNewlines, {
            ALLOWED_TAGS: ["c", "b", "i", "u", "span", "ruby", "rt", "br"],
            ADD_TAGS: ["v", "lang"],
            ALLOWED_ATTR: ["title", "lang"],
        });
    }, [cue.content]);

    const getTextEffectStyles = () => {
        switch (settings.subtitleEdgeStyle) {
            case "raised":
                return { textShadow: "0 2px 0 rgba(0,0,0,0.8), 0 1.5px 1.5px rgba(0,0,0,0.9)" };
            case "depressed":
                return { textShadow: "0 -2px 0 rgba(0,0,0,0.8), 0 -1.5px 1.5px rgba(0,0,0,0.9)" };
            case "uniform":
                const thickness = 2;
                const color = "rgba(0,0,0,0.8)";
                return {
                    textShadow: [
                        `${thickness}px ${thickness}px 0 ${color}`,
                        `-${thickness}px ${thickness}px 0 ${color}`,
                        `${thickness}px -${thickness}px 0 ${color}`,
                        `-${thickness}px -${thickness}px 0 ${color}`,
                    ].join(", "),
                };
            case "drop-shadow":
                return { textShadow: "2.5px 2.5px 4.5px rgba(0,0,0,0.9)" };
            case "outline":
                return { textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" };
            case "none":
            default:
                return { textShadow: "0 2px 4px rgba(0,0,0,0.5)" };
        }
    };

    const bgColor = settings.subtitleBackground === 'box'
        ? (settings.subtitleWindowColor || 'black')
        : 'transparent';

    const colorMap: Record<string, string> = { 'black': '0,0,0', 'white': '255,255,255', 'blue': '0,0,255' };
    const rgb = colorMap[bgColor] || '0,0,0';
    const bgString = settings.subtitleBackground === 'box'
        ? `rgba(${rgb}, ${settings.subtitleOpacity / 100})`
        : 'transparent';

    return (
        <p
            className="mb-1 rounded px-4 py-1 text-center leading-normal"
            style={{
                color: settings.subtitleColor,
                fontSize: settings.subtitleSize === 'small' ? '1.5rem' : settings.subtitleSize === 'medium' ? '2rem' : settings.subtitleSize === 'large' ? '2.5rem' : settings.subtitleSize === 'huge' ? '3rem' : '1rem',
                backgroundColor: bgString,
                backdropFilter:
                    settings.subtitleBlur > 0
                        ? `blur(${settings.subtitleBlur}px)`
                        : "none",
                fontFamily: settings.subtitleFontFamily,
                fontWeight: "normal",
                ...getTextEffectStyles(),
            }}
        >
            <span dangerouslySetInnerHTML={{ __html: parsedHtml }} dir="ltr" />
        </p>
    );
};

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, season = 1, episode = 1, onClose }) => {
    const { addToHistory, settings } = useGlobalContext();

    const [showUI, setShowUI] = useState(true);
    const [activePanel, setActivePanel] = useState<'none' | 'episodes' | 'seasons' | 'audioSubtitles' | 'quality'>('none');
    const menuCloseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Delayed menu close (allows time to move from button to panel)
    const scheduleMenuClose = useCallback(() => {
        menuCloseTimeoutRef.current = setTimeout(() => {
            setActivePanel('none');
        }, 300); // 300ms delay to allow moving to panel
    }, []);

    const cancelMenuClose = useCallback(() => {
        if (menuCloseTimeoutRef.current) {
            clearTimeout(menuCloseTimeoutRef.current);
            menuCloseTimeoutRef.current = null;
        }
    }, []);

    const [seasonList, setSeasonList] = useState<number[]>([]);
    const [currentSeasonEpisodes, setCurrentSeasonEpisodes] = useState<Episode[]>([]);
    const [selectedSeason, setSelectedSeason] = useState(season);
    const [currentEpisode, setCurrentEpisode] = useState(episode);
    const [isLoadingEpisodes, setIsLoadingEpisodes] = useState(false);

    const [isPlaying, setIsPlaying] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(() => {
        const saved = localStorage.getItem('kinemora-volume');
        return saved ? parseFloat(saved) : 1;
    });
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [imdbId, setImdbId] = useState<string | undefined>(movie.imdb_id);

    // Fetch IMDB ID if missing
    useEffect(() => {
        const fetchIds = async () => {
            // Reset
            setImdbId(movie.imdb_id);

            if (!movie.imdb_id && movie.id) {
                try {
                    const type = movie.media_type || (movie.title ? 'movie' : 'tv');
                    const ids = await getExternalIds(movie.id, type as any);
                    if (ids && ids.imdb_id) {
                        setImdbId(ids.imdb_id);
                        console.log('[VideoPlayer] Fetched missing IMDB ID:', ids.imdb_id);
                    }
                } catch (e) { console.warn("[VideoPlayer] Failed to fetch IMDB ID", e); }
            }
        };
        fetchIds();
    }, [movie]);

    const [qualities, setQualities] = useState<Array<{ height: number; level: number }>>([]);
    const [currentQuality, setCurrentQuality] = useState<number>(-1);

    const [captions, setCaptions] = useState<Array<{ id: string; label: string; url: string; lang: string }>>([]);
    const [currentCaption, setCurrentCaption] = useState<string | null>(null);
    const [failedProviders, setFailedProviders] = useState<string[]>([]);
    const [currentProviderName, setCurrentProviderName] = useState<string | null>(null);
    const [parsedCaptions, setParsedCaptions] = useState<CaptionCueType[]>([]);
    const [activeCues, setActiveCues] = useState<CaptionCueType[]>([]);

    // Proxy configuration managed via PStreamAdapter now?
    // We'll fallback to direct or simple proxy if needed, but avoiding hardcoded list to respect user changes.
    // const PROXIES = [ ... ]; 
    // const getProxiedUrl = ...

    // Quick helper for subtitles (legacy support if needed)
    const getSimpleProxyUrl = (url: string) => {
        return `https://kmovie-proxy.ibrahimar397.workers.dev/?url=${encodeURIComponent(url)}`;
    };

    const [showSkipIntro, setShowSkipIntro] = useState(false);
    const [skipIntervals, setSkipIntervals] = useState<SkipInterval[]>([]);
    const [currentSkip, setCurrentSkip] = useState<SkipInterval | null>(null);
    const introShownRef = useRef(false);  // Track if intro has been triggered for this episode (Ref to avoid stale closure)
    const [showRating, setShowRating] = useState(false);
    const [showNextEp, setShowNextEp] = useState(false);

    const inactivityTimer = useRef<any>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
    const activeEpisodeData = currentSeasonEpisodes.find(e => e.episode_number === currentEpisode);

    useEffect(() => { addToHistory(movie); }, [movie, addToHistory]);
    useEffect(() => {
        localStorage.setItem('kinemora-volume', volume.toString());
        if (videoRef.current) videoRef.current.volume = isMuted ? 0 : volume;
    }, [volume, isMuted]);

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
                if (totalSeasons) setSeasonList(Array.from({ length: totalSeasons }, (_, i) => i + 1));
            };
            loadSeasons();
            fetchSeasonData(selectedSeason);
        }
    }, [movie.id, mediaType, selectedSeason, fetchSeasonData]);

    // Rating Badge Timer - 3 seconds
    useEffect(() => {
        const showTimer = setTimeout(() => setShowRating(true), 3000);
        const hideTimer = setTimeout(() => setShowRating(false), 8000);
        return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }, []);

    // Skip Intro Timer
    useEffect(() => {
        if (showSkipIntro) {
            const timer = setTimeout(() => setShowSkipIntro(false), 15000);
            return () => clearTimeout(timer);
        }
    }, [showSkipIntro]);

    // Resume Progress
    useEffect(() => {
        const savedTime = localStorage.getItem(`kinemora-progress-${movie.id}`);
        if (savedTime && videoRef.current) {
            const time = parseFloat(savedTime);
            if (time > 0) {
                setTimeout(() => {
                    if (videoRef.current) videoRef.current.currentTime = time;
                }, 1000);
            }
        }
    }, [movie.id]);

    useEffect(() => {
        const fetchStream = async () => {
            setIsBuffering(true);
            setQualities([]);
            setCaptions([]);
            setCurrentCaption(null);
            setParsedCaptions([]);
            setActiveCues([]);

            try {
                // 1. Search using StreamService
                const query = mediaType === 'movie' ? movie.title : movie.name;
                if (!query) throw new Error("No title found");

                console.log(`Searching via StreamService for: ${query}`);
                const searchResults = await streamService.search(query, failedProviders);

                if (searchResults.length === 0) {
                    console.error("StreamService found no results");
                    setIsBuffering(false);
                    return;
                }

                // 2. Get Details (using the best result)
                const targetType = mediaType === 'movie' ? 'Movie' : 'TV';
                let firstResult = searchResults.find((r: any) => r.type && (r.type === targetType || r.type.includes(targetType)));

                if (!firstResult) {
                    console.warn(`No exact type match for ${targetType}, using first result`);
                    firstResult = searchResults[0];
                }

                console.log("Using result:", firstResult);
                setCurrentProviderName(firstResult.provider);

                const info = await streamService.getInfo(firstResult.id, firstResult.provider);
                if (!info) throw new Error("Could not get info");

                // 3. Find correct episode
                let episodeId = '';
                if (mediaType === 'movie') {
                    if (info.episodes && info.episodes.length > 0) {
                        episodeId = info.episodes[0].id;
                    }
                } else {
                    const targetEp = info.episodes?.find((e: any) => e.number === currentEpisode && e.season === selectedSeason);
                    if (targetEp) episodeId = targetEp.id;
                    else if (info.episodes?.length > 0) {
                        const targetEpBroad = info.episodes.find((e: any) => e.number === currentEpisode);
                        if (targetEpBroad) episodeId = targetEp.id;
                    }
                }

                if (!episodeId) {
                    console.error("Episode/Movie stream ID not found in info");
                    setIsBuffering(false);
                    return;
                }

                // 4. Get Stream Link
                console.log(`Fetching stream link for episodeId: ${episodeId}`);
                const streamData = await streamService.getStreamLink(
                    episodeId,
                    firstResult.id,
                    firstResult.provider,
                    ((info as any).tmdbId || movie.id || '').toString(),
                    (mediaType === 'tv' ? 'show' : 'movie') as 'movie' | 'show',
                    selectedSeason,
                    currentEpisode,
                    imdbId || undefined
                );

                if (!streamData || !streamData.sources || streamData.sources.length === 0) {
                    console.error("No sources found in streamData, switching provider...");
                    setFailedProviders(prev => currentProviderName ? [...prev, currentProviderName] : prev);
                    setIsBuffering(false);
                    return;
                }

                // Get M3U8
                const source = streamData.sources.find(s => s.isM3U8) || streamData.sources[0];
                let streamUrl = source.url;

                // Proxy logic commented out to defer to Adapter/User control
                // streamUrl = getSimpleProxyUrl(streamUrl); 

                // Handle Subtitles
                if (streamData.subtitles && streamData.subtitles.length > 0) {
                    setCaptions(prev => {
                        const newCaps = streamData.subtitles.map(c => ({
                            id: `con-${Math.random()}`,
                            label: c.label || c.lang || 'Unknown',
                            lang: c.lang || 'en',
                            url: c.url
                        }));
                        return [...prev, ...newCaps];
                    });
                }

                console.log("Playing URL:", streamUrl);

                if (Hls.isSupported() && videoRef.current) {
                    if (hlsRef.current) hlsRef.current.destroy();

                    const hls = new Hls({
                        capLevelToPlayerSize: true,
                        // Config can go here
                    });

                    hls.loadSource(streamUrl);
                    hls.attachMedia(videoRef.current);
                    hlsRef.current = hls;

                    hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                        const levels = data.levels.map((lvl, index) => ({ height: lvl.height, level: index }));
                        levels.sort((a, b) => b.height - a.height);
                        setQualities(levels);
                        videoRef.current?.play().catch(e => console.error("Autoplay failed", e));
                        setIsBuffering(false);
                    });
                    // Error handling
                    hls.on(Hls.Events.ERROR, function (event, data) {
                        if (data.type === Hls.ErrorTypes.NETWORK_ERROR && data.response && data.response.code === 403) {
                            console.warn("403 Forbidden detected. Switching provider...");
                            hls.destroy();
                            setFailedProviders(prev => currentProviderName ? [...prev, currentProviderName] : prev);
                            return;
                        }

                        if (data.fatal) {
                            switch (data.type) {
                                case Hls.ErrorTypes.NETWORK_ERROR:
                                    hls.startLoad();
                                    break;
                                case Hls.ErrorTypes.MEDIA_ERROR:
                                    hls.recoverMediaError();
                                    break;
                                default:
                                    hls.destroy();
                                    setFailedProviders(prev => currentProviderName ? [...prev, currentProviderName] : prev);
                                    break;
                            }
                        }
                    });

                } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
                    videoRef.current.src = streamUrl;
                    videoRef.current.addEventListener('loadedmetadata', () => {
                        videoRef.current?.play();
                        setIsBuffering(false);
                    });
                }

            } catch (err) {
                console.error("Error fetching stream:", err);
                setIsBuffering(false);
            }
        };
        fetchStream();
        return () => { if (hlsRef.current) hlsRef.current.destroy(); };
    }, [movie, currentEpisode, selectedSeason, mediaType, failedProviders]);

    useEffect(() => {
        if (!currentCaption) {
            setParsedCaptions([]);
            setActiveCues([]);
            return;
        }

        const loadCaptions = async () => {
            try {
                let response = await fetch(currentCaption);
                if (!response.ok) throw new Error("Network response was not ok");
                let text = await response.text();

                if (text.trim().startsWith("<!DOCTYPE html>") || text.trim().startsWith("<html")) {
                    throw new Error("Received HTML instead of VTT/SRT");
                }

                const parsed = parseSubtitles(text);
                setParsedCaptions(parsed);
            } catch (e) {
                console.warn("Direct fetch failed, trying proxy for subtitles:", e);
                try {
                    const proxyUrl = getSimpleProxyUrl(currentCaption);
                    const response = await fetch(proxyUrl);
                    const text = await response.text();
                    const parsed = parseSubtitles(text);
                    setParsedCaptions(parsed);
                } catch (proxyErr) {
                    console.error("Failed to load/parse subtitles via proxy:", proxyErr);
                    setParsedCaptions([]);
                }
            }
        };
        loadCaptions();
    }, [currentCaption]);

    const parsedCaptionsRef = useRef(parsedCaptions);
    useEffect(() => { parsedCaptionsRef.current = parsedCaptions; }, [parsedCaptions]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            if (video.duration) {
                setDuration(video.duration);
                const percentage = (video.currentTime / video.duration) * 100;
                setProgress(percentage);

                // Skip Intro Logic (TV Only) - Trigger at 3s
                if (mediaType === 'tv' && !introShownRef.current && video.currentTime > 3) {
                    setShowSkipIntro(true);
                    introShownRef.current = true;
                }

                // Next Episode Logic
                if (mediaType === 'tv') {
                    if (percentage >= 98.2) setShowNextEp(true);
                    else setShowNextEp(false);

                    if (percentage >= 99.5 && !isBuffering) {
                        handleNextEpisode();
                    }
                }

                // Save progress
                if (Math.abs(video.currentTime - (parseFloat(localStorage.getItem(`kinemora-progress-${movie.id}`) || '0'))) > 5) {
                    localStorage.setItem(`kinemora-progress-${movie.id}`, video.currentTime.toString());
                    const completion = (video.currentTime / video.duration) * 100;
                    localStorage.setItem(`kinemora-completion-${movie.id}`, completion.toString());
                }
            }

            const currentCaptions = parsedCaptionsRef.current;
            if (currentCaptions.length > 0) {
                const delay = 0;
                const visible = currentCaptions.filter(cue => captionIsVisible(cue.start, cue.end, delay, video.currentTime));
                setActiveCues(visible);
            } else {
                setActiveCues([]);
            }
        };

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onWaiting = () => setIsBuffering(true);
        const onPlaying = () => setIsBuffering(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('play', onPlay);
        video.addEventListener('pause', onPause);
        video.addEventListener('waiting', onWaiting);
        video.addEventListener('playing', onPlaying);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('play', onPlay);
            video.removeEventListener('pause', onPause);
            video.removeEventListener('waiting', onWaiting);
            video.removeEventListener('playing', onPlaying);
        };
    }, []);

    const togglePlay = () => { if (videoRef.current) videoRef.current.paused ? videoRef.current.play() : videoRef.current.pause(); };
    const handleSeek = useCallback((amount: number) => { if (videoRef.current) videoRef.current.currentTime += amount; resetInactivityTimer(); }, []);

    const handleNextEpisode = useCallback(() => {
        const currentIndex = currentSeasonEpisodes.findIndex(e => e.episode_number === currentEpisode);
        let nextEp: Episode | undefined;
        if (currentIndex !== -1 && currentIndex < currentSeasonEpisodes.length - 1) {
            nextEp = currentSeasonEpisodes[currentIndex + 1];
        } else if (seasonList.includes(selectedSeason + 1)) {
            const nextSeason = selectedSeason + 1;
            setSelectedSeason(nextSeason);
            setIsBuffering(true);
            setTimeout(() => setIsBuffering(false), 1000);
            return;
        }
        if (nextEp) handleEpisodeChange(nextEp);
    }, [currentSeasonEpisodes, currentEpisode, seasonList, selectedSeason]);

    // Previous episode handler for P keyboard shortcut
    const handlePreviousEpisode = useCallback(() => {
        const currentIndex = currentSeasonEpisodes.findIndex(e => e.episode_number === currentEpisode);
        let prevEp: Episode | undefined;
        if (currentIndex > 0) {
            prevEp = currentSeasonEpisodes[currentIndex - 1];
        } else if (seasonList.includes(selectedSeason - 1)) {
            // Go to previous season's last episode
            const prevSeason = selectedSeason - 1;
            setSelectedSeason(prevSeason);
            setIsBuffering(true);
            setTimeout(() => setIsBuffering(false), 1000);
            return;
        }
        if (prevEp) handleEpisodeChange(prevEp);
    }, [currentSeasonEpisodes, currentEpisode, seasonList, selectedSeason]);

    const handleEpisodeChange = (ep: Episode) => {
        setIsBuffering(true);
        setCurrentEpisode(ep.episode_number);
        setProgress(0);
        setShowSkipIntro(false);
        introShownRef.current = false;
        setShowNextEp(false);
        setCaptions([]);
        setQualities([]);
        setCurrentCaption(null);
        setParsedCaptions([]);
        setTimeout(() => { setIsBuffering(false); setIsPlaying(true); }, 800);
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const time = videoRef.current.currentTime;
        const duration = videoRef.current.duration;
        const buffered = videoRef.current.buffered;
        // Skip Intro/Outro Check
        const activeSkip = skipIntervals.find(interval => time >= interval.startTime && time < interval.endTime);
        setCurrentSkip(activeSkip || null);
        // Next Episode Auto-Prompt
        if (duration - time < 60) {
            if (!showNextEp && (currentSeasonEpisodes.length > 0 || seasonList.length > 0)) setShowNextEp(true);
        } else {
            if (showNextEp) setShowNextEp(false);
        }
    };

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(err => console.error(err)); setIsFullscreen(true); }
        else { if (document.exitFullscreen) { document.exitFullscreen(); setIsFullscreen(false); } }
    }, []);

    const resetInactivityTimer = useCallback(() => {
        setShowUI(true);
        if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
        if (activePanel === 'none' && isPlaying) {
            inactivityTimer.current = setTimeout(() => { setShowUI(false); }, 3500);
        }
    }, [activePanel, isPlaying]);

    useEffect(() => { resetInactivityTimer(); }, [activePanel, resetInactivityTimer]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            resetInactivityTimer();
            switch (e.code) {
                case 'Space': e.preventDefault(); togglePlay(); break;
                case 'KeyK': e.preventDefault(); togglePlay(); break; // Netflix-style play/pause
                case 'ArrowRight': e.preventDefault(); handleSeek(10); break;
                case 'ArrowLeft': e.preventDefault(); handleSeek(-10); break;
                case 'ArrowUp': e.preventDefault(); setVolume(v => Math.min(1, v + 0.1)); break;
                case 'ArrowDown': e.preventDefault(); setVolume(v => Math.max(0, v - 0.1)); break;
                case 'KeyM': setIsMuted(m => !m); break;
                case 'KeyF': toggleFullscreen(); break;
                case 'KeyN': if (movie.media_type === 'tv') handleNextEpisode(); break; // Next episode (TV only)
                case 'KeyP': if (movie.media_type === 'tv') handlePreviousEpisode(); break; // Previous episode (TV only)
                case 'Escape': if (activePanel !== 'none') setActivePanel('none'); else onClose(); break;
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
    }, [resetInactivityTimer, onClose, activePanel, handleSeek, handleNextEpisode, handlePreviousEpisode, movie.media_type]);

    const handleQualityChange = (levelIndex: number) => { if (hlsRef.current) { hlsRef.current.currentLevel = levelIndex; setCurrentQuality(levelIndex); } setActivePanel('none'); };
    const handleSubtitleChange = (url: string | null) => { setCurrentCaption(url); setActivePanel('none'); };

    return (
        <div className={`fixed inset-0 z-[100] bg-black font-['Consolas'] text-white overflow-hidden select-none group/player ${showUI ? '' : 'cursor-none'}`}>

            <div className="absolute inset-0 w-full h-full bg-black">
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    autoPlay
                    playsInline
                    crossOrigin="anonymous"
                    onTimeUpdate={handleTimeUpdate}
                />
            </div>

            {/* Back Button (Top Left) */}
            <div className={`absolute top-6 left-6 z-50 transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
                <button
                    onClick={onClose}
                    className="flex items-center justify-center w-14 h-14 rounded-full bg-transparent hover:bg-[#E50914] text-white transition-all duration-300 backdrop-blur-sm group/back"
                >
                    <ArrowLeftIcon size={42} weight="bold" />
                </button>
            </div>

            {/* Loading Spinner */}
            {isBuffering && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                    <div className="w-14 h-14 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
                    <span className="text-white/70 text-sm mt-4">Fetching...</span>
                </div>
            )}

            {activeCues.length > 0 && (
                <div className="absolute bottom-32 left-0 right-0 flex flex-col items-center pointer-events-none z-10 px-4 transition-all duration-300">
                    {activeCues.map((cue, i) => (
                        <CaptionCue key={makeQueId(i, cue.start, cue.end)} cue={cue} />
                    ))}
                </div>
            )}

            <div className="absolute inset-0 z-20 cursor-default" onClick={() => { togglePlay(); resetInactivityTimer(); }} onDoubleClick={toggleFullscreen} onMouseMove={resetInactivityTimer} />

            {/* Rating Badge Overlay */}
            {mediaType === 'movie' && isPlaying && (
                <div className={`absolute top-24 left-6 transition-all duration-700 z-[60] ${showRating ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="flex bg-black/60 backdrop-blur-md border-l-[6px] border-[#E50914] py-2 px-4 shadow-xl">
                        <div className="flex flex-col justify-center">
                            <span className="text-white text-sm tracking-wider uppercase drop-shadow-md leading-tight">RATED 12</span>
                            <span className="text-white/80 text-xs font-normal drop-shadow-md leading-tight">language, sex references</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Skip Button (Intro / Outro) */}
            <div className={`absolute bottom-32 left-12 z-40 transition-all duration-500 transform ${currentSkip && showUI ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (currentSkip && videoRef.current) {
                            videoRef.current.currentTime = currentSkip.endTime;
                            setCurrentSkip(null);
                        }
                    }}
                    className="flex items-center justify-center bg-white text-black px-6 h-10 rounded-[4px] hover:bg-white/90 transition transform hover:scale-105 active:scale-95 text-sm shadow-lg border border-gray-300"
                >
                    <SkipForwardIcon size={20} className="mr-2 text-black" />
                    {currentSkip?.type === 'outro' ? 'Skip Outro' : 'Skip Intro'}
                </button>
            </div>

            {/* Next Episode Button */}
            {showNextEp && (
                <div className={`absolute bottom-32 right-12 z-40 transition-all duration-500 transform ${showUI ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNextEpisode(); }}
                        className="flex items-center justify-center bg-white text-black px-6 h-10 rounded-[4px] hover:bg-white/90 transition transform hover:scale-105 active:scale-95 text-sm shadow-lg"
                    >
                        <SkipForwardIcon size={20} className="mr-2 text-black" />
                        Next Episode
                    </button>
                </div>
            )}

            <VideoPlayerControls
                isPlaying={isPlaying}
                isMuted={isMuted}
                progress={progress}
                duration={duration}
                isBuffering={isBuffering}
                showNextEp={showNextEp}
                title={mediaType === 'tv' && activeEpisodeData ? (
                    <>
                        <span className="font-bold">{movie.title || movie.name}</span>
                        <span className="font-normal opacity-90 ml-2">E{activeEpisodeData.episode_number} {activeEpisodeData.name}</span>
                    </>
                ) : (
                    <span className="font-bold">{movie.title || movie.name || ''}</span>
                )}
                onPlayPause={togglePlay}
                onSeek={handleSeek}
                volume={volume}
                onVolumeChange={setVolume}
                onToggleMute={() => setIsMuted(!isMuted)}
                onTimelineSeek={(perc) => {
                    if (videoRef.current && Number.isFinite(videoRef.current.duration)) {
                        const seekTime = (perc / 100) * videoRef.current.duration;
                        videoRef.current.currentTime = seekTime;
                        setProgress(perc);
                    }
                }}
                onNextEpisode={mediaType === 'tv' ? handleNextEpisode : undefined}
                onClose={onClose}
                onToggleFullscreen={toggleFullscreen}
                areSubtitlesOff={currentCaption === null}
                onSubtitlesClick={() => { cancelMenuClose(); setActivePanel('audioSubtitles'); }}
                onSettingsClick={() => { cancelMenuClose(); setActivePanel('quality'); }}
                onSubtitlesHover={() => { cancelMenuClose(); setActivePanel('audioSubtitles'); }}
                onSettingsHover={() => { cancelMenuClose(); setActivePanel('quality'); }}
                onEpisodesClick={mediaType === 'tv' ? () => { cancelMenuClose(); setActivePanel('episodes'); } : undefined}
                onEpisodesHover={mediaType === 'tv' ? () => { cancelMenuClose(); setActivePanel('episodes'); } : undefined}
                onMenuClose={scheduleMenuClose}
                isMenuOpen={activePanel !== 'none'}
            />

            <VideoPlayerSettings
                activePanel={activePanel}
                setActivePanel={setActivePanel}
                seasonList={seasonList}
                currentSeasonEpisodes={currentSeasonEpisodes}
                selectedSeason={selectedSeason}
                playingSeason={activeEpisodeData?.season_number}
                currentEpisode={currentEpisode}
                onSeasonSelect={fetchSeasonData}
                onEpisodeSelect={handleEpisodeChange}
                qualities={qualities}
                currentQuality={currentQuality}
                onQualityChange={handleQualityChange}
                captions={captions}
                currentCaption={currentCaption}
                onSubtitleChange={handleSubtitleChange}
                showTitle={movie.name || movie.title}
                onPanelHover={cancelMenuClose}
                onStartHide={scheduleMenuClose}
            />
        </div>
    );
};

export default VideoPlayer;
