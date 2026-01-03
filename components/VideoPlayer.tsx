import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Hls from 'hls.js';
import { Movie, Episode } from '../types';
import { getSeasonDetails, getMovieDetails, getExternalIds } from '../services/api';

import { getProviders } from '../services/p-stream-backend/providers/providers';
import { isExtensionActive } from '../services/p-stream-backend/extension/messaging';
import { IMG_PATH } from '../constants';
import { useGlobalContext } from '../context/GlobalContext';
import { parseSubtitles, captionIsVisible, sanitize, CaptionCueType, makeQueId } from '../utils/captions';
import { scrapeOpenSubtitlesCaptions } from '../services/opensubtitles';

interface VideoPlayerProps {
    movie: Movie;
    season?: number;
    episode?: number;
    onClose: () => void;
}

// Reusable Popup Panel Component
interface PopupPanelProps {
    title: string;
    onBack?: () => void;
    onClose: () => void;
    children: React.ReactNode;
    headerContent?: React.ReactNode;
}

const PopupPanel: React.FC<PopupPanelProps> = ({ title, onBack, onClose, children, headerContent }) => (
    <div className="absolute bottom-28 right-12 w-[550px] max-h-[75vh] bg-[#141414] z-[110] flex flex-col font-sans border border-[#333] shadow-2xl rounded-lg overflow-hidden animate-fadeIn">
        <div className="flex items-center px-6 py-4 border-b border-[#333] bg-[#181818] sticky top-0 z-10">
            {onBack ? (
                <button onClick={onBack} className="mr-4 text-white hover:text-gray-300 transition">
                    <span className="material-icons text-3xl">arrow_back</span>
                </button>
            ) : null}
            <div className="flex-1">
                {headerContent || <div className="text-xl font-bold text-white">{title}</div>}
            </div>
            <button onClick={onClose} className="ml-4 text-white hover:text-gray-300 transition">
                <span className="material-icons text-3xl">close</span>
            </button>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {children}
        </div>
    </div>
);

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

    const [qualities, setQualities] = useState<Array<{ height: number; level: number }>>([]);
    const [currentQuality, setCurrentQuality] = useState<number>(-1);

    const [captions, setCaptions] = useState<Array<{ id: string; label: string; url: string; lang: string }>>([]);
    const [currentCaption, setCurrentCaption] = useState<string | null>(null);
    const [parsedCaptions, setParsedCaptions] = useState<CaptionCueType[]>([]);
    const [activeCues, setActiveCues] = useState<CaptionCueType[]>([]);
    const [subtitleLanguage, setSubtitleLanguage] = useState<string | null>(null);

    const [showSkipIntro, setShowSkipIntro] = useState(false);
    const [introShown, setIntroShown] = useState(false);  // Track if intro has been triggered for this episode
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

    // Rating Badge Timer
    useEffect(() => {
        const showTimer = setTimeout(() => setShowRating(true), 6000);
        const hideTimer = setTimeout(() => setShowRating(false), 10000);
        return () => { clearTimeout(showTimer); clearTimeout(hideTimer); };
    }, []);

    // Skip Intro Timer
    useEffect(() => {
        if (showSkipIntro) {
            const timer = setTimeout(() => setShowSkipIntro(false), 15000);
            return () => clearTimeout(timer);
        }
    }, [showSkipIntro]);

    useEffect(() => {
        const fetchStream = async () => {
            setIsBuffering(true);
            setQualities([]);
            setCaptions([]);
            setCurrentCaption(null);
            setParsedCaptions([]);
            setActiveCues([]);

            await isExtensionActive();
            const providers = getProviders();
            const tmdbId = movie.id.toString();

            const media = mediaType === 'movie'
                ? { type: 'movie' as const, tmdbId, title: movie.title || '', releaseYear: new Date(movie.release_date || '').getFullYear() }
                : { type: 'show' as const, tmdbId, title: movie.name || '', releaseYear: new Date(movie.first_air_date || '').getFullYear(), episode: { number: currentEpisode, tmdbId: '' }, season: { number: selectedSeason, tmdbId: '', title: `Season ${selectedSeason}` } };

            try {
                // Fetch stream from all providers
                const output = await providers.runAll({ media: media });
                console.log("Stream Output:", output);

                // --- OPEN SUBTITLES FETCH ---
                let imdbId = movie.imdb_id;

                // If we don't have IMDB ID, try to fetch it from external_ids endpoint
                if (!imdbId) {
                    try {
                        const externalIds = await getExternalIds(movie.id, mediaType === 'movie' ? 'movie' : 'tv');
                        if (externalIds && externalIds.imdb_id) {
                            imdbId = externalIds.imdb_id;
                            console.log("Fetched missing IMDB ID via external_ids:", imdbId);
                        } else {
                            // Fallback to details if external_ids fails (though unlikely for valid ID)
                            const details = await getMovieDetails(movie.id, mediaType === 'movie' ? 'movie' : 'tv');
                            if (details && details.imdb_id) {
                                imdbId = details.imdb_id;
                            }
                        }
                    } catch (e) {
                        console.error("Failed to fetch details for IMDB ID", e);
                    }
                }

                if (imdbId) {
                    console.log("Fetching OpenSubtitles for", imdbId);
                    scrapeOpenSubtitlesCaptions(imdbId, mediaType === 'tv' ? selectedSeason : undefined, mediaType === 'tv' ? currentEpisode : undefined)
                        .then(osCaps => {
                            console.log("OpenSubtitles found:", osCaps.length);
                            setCaptions(prev => {
                                const existingUrls = new Set(prev.map(c => c.url));
                                const newCaps = osCaps.filter(c => !existingUrls.has(c.url)).map(c => ({
                                    id: `os-${c.id}`,
                                    label: c.display,
                                    lang: c.language,
                                    url: c.url
                                }));
                                return [...prev, ...newCaps];
                            });
                        });
                } else {
                    console.warn("No IMDB ID available for OpenSubtitles search");
                }

                if (output && output.stream) {
                    const stream = output.stream as any;
                    const streamUrl = stream.playlist;

                    if (stream.captions && stream.captions.length > 0) {
                        const processedCaptions = stream.captions.map((cap: any) => ({
                            id: cap.id || `cap-${Math.random()}`,
                            label: cap.label || cap.language || 'Unknown',
                            lang: cap.language || 'en',
                            url: cap.url
                        }));
                        setCaptions(prev => {
                            const existingUrls = new Set(prev.map(c => c.url));
                            const newCaps = processedCaptions.filter((c: any) => !existingUrls.has(c.url));
                            return [...prev, ...newCaps];
                        });
                    }

                    if (Hls.isSupported() && videoRef.current) {
                        if (hlsRef.current) hlsRef.current.destroy();
                        const hls = new Hls({ capLevelToPlayerSize: true });
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
                    } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
                        videoRef.current.src = streamUrl;
                        videoRef.current.addEventListener('loadedmetadata', () => {
                            videoRef.current?.play();
                            setIsBuffering(false);
                        });
                    }
                } else {
                    console.error("No stream found");
                    setIsBuffering(false);
                }
            } catch (err) {
                console.error("Error fetching stream:", err);
                setIsBuffering(false);
            }
        };
        fetchStream();
        return () => { if (hlsRef.current) hlsRef.current.destroy(); };
    }, [movie, currentEpisode, selectedSeason, mediaType]);

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

                // If it looks like HTML (sometimes blocked/error page), try proxy
                if (text.trim().startsWith("<!DOCTYPE html>") || text.trim().startsWith("<html")) {
                    throw new Error("Received HTML instead of VTT/SRT");
                }

                const parsed = parseSubtitles(text);
                setParsedCaptions(parsed);
            } catch (e) {
                console.warn("Direct fetch failed, trying proxy for subtitles:", e);
                try {
                    // Fallback to a public CORS proxy (demo purposes, better to have own backend)
                    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(currentCaption)}`;
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
                if (mediaType === 'tv' && !introShown && video.currentTime > 3) {
                    setShowSkipIntro(true);
                    setIntroShown(true);
                }

                // Next Episode Logic
                if (mediaType === 'tv') {
                    if (percentage >= 98.2) setShowNextEp(true);
                    else setShowNextEp(false);

                    if (percentage >= 99.5 && !isBuffering) {
                        // Debounce or ensure single call? 
                        // handleNextEpisode resets progress, so checking percentage < 99.5 might be needed if state change is slow
                        // But for now, simple call is fine as handleNextEpisode sets buffering immediately
                        handleNextEpisode();
                    }
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

    const handleEpisodeChange = (ep: Episode) => {
        setIsBuffering(true);
        setCurrentEpisode(ep.episode_number);
        setCurrentEpisode(ep.episode_number);
        setProgress(0);
        setShowSkipIntro(false);
        setIntroShown(false);
        setShowNextEp(false);
        setCaptions([]);
        setQualities([]);
        setCurrentCaption(null);
        setParsedCaptions([]);
        setTimeout(() => { setIsBuffering(false); setIsPlaying(true); }, 800);
    };

    const handleSkipIntro = () => {
        setIsBuffering(true);
        setTimeout(() => { if (videoRef.current) videoRef.current.currentTime += 30; setShowSkipIntro(false); setIsBuffering(false); }, 400);
    };

    const toggleFullscreen = useCallback(() => {
        if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(err => console.error(err)); setIsFullscreen(true); }
        else { if (document.exitFullscreen) { document.exitFullscreen(); setIsFullscreen(false); } }
    }, []);

    // Initial Skip Intro useEffect removed - now tracked via timeUpdate

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
                case 'ArrowRight': e.preventDefault(); handleSeek(10); break;
                case 'ArrowLeft': e.preventDefault(); handleSeek(-10); break;
                case 'ArrowUp': e.preventDefault(); setVolume(v => Math.min(1, v + 0.1)); break;
                case 'ArrowDown': e.preventDefault(); setVolume(v => Math.max(0, v - 0.1)); break;
                case 'KeyM': setIsMuted(m => !m); break;
                case 'KeyF': toggleFullscreen(); break;
                case 'Escape': if (activePanel !== 'none') setActivePanel('none'); else onClose(); break;
                case 'KeyS': if (showSkipIntro) handleSkipIntro(); break;
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
    }, [resetInactivityTimer, onClose, activePanel, showSkipIntro, handleSeek]);

    const handleQualityChange = (levelIndex: number) => { if (hlsRef.current) { hlsRef.current.currentLevel = levelIndex; setCurrentQuality(levelIndex); } setActivePanel('none'); };
    const handleSubtitleChange = (url: string | null) => { setCurrentCaption(url); setActivePanel('none'); };

    return (
        <div className="fixed inset-0 z-[100] bg-black font-sans text-white overflow-hidden select-none group/player">

            <div className="absolute inset-0 w-full h-full bg-black">
                <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline crossOrigin="anonymous" />
            </div>

            {activeCues.length > 0 && (
                <div className="absolute bottom-32 left-0 right-0 flex flex-col items-center pointer-events-none z-10 px-4 transition-all duration-300">
                    {activeCues.map((cue, i) => (
                        <CaptionCue key={makeQueId(i, cue.start, cue.end)} cue={cue} />
                    ))}
                </div>
            )}

            <div className={`absolute inset-0 z-20 ${showUI ? 'cursor-default' : 'cursor-none'}`} onClick={() => { togglePlay(); resetInactivityTimer(); }} onDoubleClick={toggleFullscreen} onMouseMove={resetInactivityTimer} />

            {/* Rating Badge Overlay */}
            {mediaType === 'movie' && ( // Or apply to TV shows too? User said "video", implies generic. Let's apply to all.
                <div className={`absolute top-24 left-0 transition-all duration-700 z-[60] ${showRating ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    <div className="flex bg-black/60 backdrop-blur-md border-l-[6px] border-[#E50914] py-2 px-4 shadow-xl">
                        <div className="flex flex-col justify-center">
                            <span className="text-white font-bold text-sm tracking-wider uppercase drop-shadow-md leading-tight">RATED 12</span>
                            <span className="text-gray-200 text-xs font-normal drop-shadow-md leading-tight">language, sex references</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Skip Intro Button */}
            <div className={`absolute bottom-32 left-12 z-40 transition-all duration-500 transform ${showSkipIntro && showUI ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                <button
                    onClick={(e) => { e.stopPropagation(); handleSkipIntro(); }}
                    className="flex items-center justify-center bg-white text-black px-6 h-10 rounded-[4px] font-bold hover:bg-white/90 transition transform hover:scale-105 active:scale-95 text-sm shadow-lg"
                >
                    <svg className="w-5 h-5 mr-2 text-black fill-current" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z" /></svg>
                    Skip Intro
                </button>
            </div>

            {/* Next Episode Button */}
            {showNextEp && (
                <div className={`absolute bottom-32 right-12 z-40 transition-all duration-500 transform ${showUI ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
                    <button
                        onClick={(e) => { e.stopPropagation(); handleNextEpisode(); }}
                        className="flex items-center justify-center bg-white text-black px-6 h-10 rounded-[4px] font-bold hover:bg-white/90 transition transform hover:scale-105 active:scale-95 text-sm shadow-lg"
                    >
                        <svg className="w-5 h-5 mr-2 text-black fill-current" viewBox="0 0 24 24"><path d="M5 3l14 9-14 9V3z" /></svg>
                        Next Episode
                    </button>
                </div>
            )}

            <div className={`absolute inset-0 flex flex-col justify-between transition-opacity duration-300 z-30 pointer-events-none ${showUI || activePanel !== 'none' || !isPlaying ? 'opacity-100' : 'opacity-0'}`}>
                <div className="p-8 flex justify-between items-start pointer-events-auto bg-gradient-to-b from-black/80 to-transparent">
                    <button onClick={onClose} className="group p-2 rounded-full hover:bg-white/10 transition">
                        <span className="material-icons text-5xl text-white group-hover:scale-110 transition-transform">arrow_back</span>
                    </button>
                </div>

                <div className="bg-gradient-to-t from-black via-black/80 to-transparent px-8 pb-8 pt-20 pointer-events-auto">
                    <div className="relative w-full h-1.5 bg-gray-600/50 hover:h-2.5 transition-all duration-200 rounded-none mb-6 group/timeline cursor-pointer flex items-center" onClick={(e) => { e.stopPropagation(); const rect = e.currentTarget.getBoundingClientRect(); const x = e.clientX - rect.left; const perc = Math.max(0, Math.min(100, (x / rect.width) * 100)); if (videoRef.current && Number.isFinite(videoRef.current.duration)) { const seekTime = (perc / 100) * videoRef.current.duration; videoRef.current.currentTime = seekTime; setProgress(perc); } }}>
                        <div className="absolute top-0 left-0 h-full bg-gray-400/50 w-[0%] rounded-none" style={{ width: isBuffering ? '100%' : '0%' }} />
                        <div className="absolute top-0 left-0 h-full bg-[#E50914] z-20 rounded-none" style={{ width: `${progress}%` }} />
                        <div className="absolute h-5 w-5 bg-[#E50914] rounded-full z-30 scale-0 group-hover/timeline:scale-100 transition-transform shadow-lg border-2 border-white" style={{ left: `${progress}%`, transform: 'translateX(-50%)' }} />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="hover:text-gray-300 transition transform hover:scale-110"><span className="material-icons text-[3rem]">{isPlaying ? 'pause' : 'play_arrow'}</span></button>
                            <button onClick={(e) => { e.stopPropagation(); handleSeek(-10); }} className="hover:text-gray-300 transition transform hover:scale-110"><span className="material-icons text-[3rem]">replay_10</span></button>
                            <button onClick={(e) => { e.stopPropagation(); handleSeek(10); }} className="hover:text-gray-300 transition transform hover:scale-110"><span className="material-icons text-[3rem]">forward_10</span></button>
                            <div className="flex items-center group/vol relative">
                                <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="hover:text-gray-300 transition transform hover:scale-110"><span className="material-icons text-[3rem]">{isMuted ? 'volume_off' : 'volume_up'}</span></button>
                            </div>
                        </div>

                        <div className="flex flex-col items-center">
                            <h3 className="text-xl font-bold text-white drop-shadow-md">{movie.title || movie.name}</h3>
                            {activeEpisodeData && <div className="text-gray-300 font-medium whitespace-nowrap">S{selectedSeason}:E{currentEpisode} {activeEpisodeData.name}</div>}
                        </div>

                        <div className="flex items-center space-x-6">
                            {mediaType === 'tv' && (
                                <button onClick={(e) => { e.stopPropagation(); setActivePanel(activePanel === 'episodes' ? 'none' : 'episodes'); }} className={`transition transform hover:scale-110 ${activePanel === 'episodes' || activePanel === 'seasons' ? 'text-[#E50914]' : 'hover:text-gray-300'}`}>
                                    <span className="material-icons text-[3rem] -scale-x-100">video_library</span>
                                </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); setActivePanel(activePanel === 'audioSubtitles' ? 'none' : 'audioSubtitles'); }} className={`transition transform hover:scale-110 ${activePanel === 'audioSubtitles' ? 'text-[#E50914]' : 'hover:text-gray-300'}`}>
                                <span className="material-icons text-[3rem]">subtitles</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); setActivePanel(activePanel === 'quality' ? 'none' : 'quality'); }} className={`transition transform hover:scale-110 ${activePanel === 'quality' ? 'text-[#E50914]' : 'hover:text-gray-300'}`}>
                                <span className="material-icons text-[3rem]">settings</span>
                            </button>
                            <button onClick={(e) => { e.stopPropagation(); toggleFullscreen(); }} className="hover:text-gray-300 transition transform hover:scale-110"><span className="material-icons text-[3rem]">{isFullscreen ? 'fullscreen_exit' : 'fullscreen'}</span></button>
                        </div>
                    </div>
                </div>
            </div>

            {activePanel === 'episodes' && mediaType === 'tv' && (
                <PopupPanel title={`Season ${selectedSeason}`} onClose={() => setActivePanel('none')} headerContent={<div className="flex items-center w-full"><button onClick={() => setActivePanel('seasons')} className="mr-4 text-white hover:text-gray-300 transition"><span className="material-icons text-3xl">arrow_back</span></button><div className="text-xl font-bold text-white">Season {selectedSeason}</div></div>}>
                    <div className="p-0">
                        {currentSeasonEpisodes.map(ep => {
                            const isActive = currentEpisode === ep.episode_number;
                            return (
                                <div key={ep.id} onClick={() => handleEpisodeChange(ep)} className={`group border-b border-[#282828] cursor-pointer hover:bg-[#202020] transition bg-[#141414] py-2`}>
                                    <div className="flex items-center px-4 py-2">
                                        <div className="text-lg font-bold w-8 text-gray-400 text-center mr-4">{ep.episode_number}</div>
                                        {!isActive && (<div className="flex-1 min-w-0 flex justify-between items-center px-2"><div className="font-bold text-white text-base truncate pr-4">{ep.name}</div><div className="text-gray-400 text-sm font-light min-w-[50px] text-right">{ep.runtime ? `${ep.runtime}m` : ''}</div></div>)}
                                        {isActive && (<div className="flex-1"><div className="flex gap-4"><div className="relative w-40 h-24 bg-gray-800 rounded-sm overflow-hidden flex-shrink-0">{ep.still_path ? (<img src={`${IMG_PATH}${ep.still_path}`} alt="" className="w-full h-full object-cover" />) : (<div className="w-full h-full flex items-center justify-center text-gray-600 bg-black"><span className="material-icons">image</span></div>)}<div className="absolute bottom-0 left-0 w-full h-1 bg-gray-700"><div className="bg-[#E50914] h-full w-[0%]"></div></div><div className="absolute inset-0 flex items-center justify-center bg-black/30"><span className="material-icons text-white text-3xl drop-shadow-lg">play_circle_filled</span></div></div><div className="flex-1 min-w-0 py-1"><div className="font-bold text-white text-base mb-2">{ep.name}</div><div className="text-xs text-gray-400 leading-relaxed line-clamp-3">{ep.overview}</div></div></div></div>)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </PopupPanel>
            )}

            {activePanel === 'seasons' && mediaType === 'tv' && (
                <PopupPanel title={movie.name || movie.title || 'Series'} onClose={() => setActivePanel('none')}>
                    <div className="p-0">
                        {seasonList.map(s => (<div key={s} onClick={() => { setSelectedSeason(s); setActivePanel('episodes'); }} className={`px-6 py-4 text-lg cursor-pointer transition flex justify-between items-center border-b border-[#282828] hover:bg-[#202020] ${selectedSeason === s ? 'bg-[#202020]' : 'bg-[#141414]'}`}><span className={`${selectedSeason === s ? 'font-bold text-white' : 'text-gray-300'}`}>Season {s}</span>{selectedSeason === s && <span className="material-icons text-white">check</span>}</div>))}
                    </div>
                </PopupPanel>
            )}

            {activePanel === 'audioSubtitles' && (
                <div className="absolute bottom-28 right-12 w-[600px] h-auto max-h-[60vh] bg-[#262626] z-[110] rounded shadow-2xl flex flex-col font-sans text-sm text-[#e5e5e5] animate-fadeIn p-4 overflow-hidden">
                    <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 pr-1">
                        {(() => {
                            // Group captions by language label (e.g. "English" from "English (CC)")
                            const groups: Record<string, typeof captions> = {};
                            captions.forEach(cap => {
                                // Extract main language name
                                let groupName = 'Unknown';
                                if (cap.lang) {
                                    // Try to use full language name from simple map or cap.label extraction
                                    // Extract alphanumeric prefix from label as a heuristic for "Language Name"
                                    const match = cap.label.match(/^([a-zA-Z]+)/);
                                    if (match) groupName = match[1];
                                    // if name is short (e.g. 'en'), try to map it (omitted for brevity, relying on label mostly)
                                }
                                // Fallback to label if heuristic fails or just use label's first word
                                if (groupName === 'Unknown' || groupName.length < 2) {
                                    const match = cap.label.match(/^([a-zA-Z]+)/);
                                    if (match) groupName = match[1];
                                    else groupName = cap.label;
                                }

                                if (!groups[groupName]) groups[groupName] = [];
                                groups[groupName].push(cap);
                            });

                            // Determine if we are in Top Level (Language List) or Sub Level (Tracks List)
                            if (subtitleLanguage === null) {
                                // View 1: Language List
                                const sortedLangKeys = Object.keys(groups).sort((a, b) => {
                                    // English first
                                    const isEnA = a.toLowerCase().includes('english');
                                    const isEnB = b.toLowerCase().includes('english');
                                    if (isEnA && !isEnB) return -1;
                                    if (!isEnA && isEnB) return 1;
                                    return a.localeCompare(b);
                                });

                                return (
                                    <>
                                        <div onClick={() => handleSubtitleChange(null)} className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded hover:bg-[#333] transition ${currentCaption === null ? 'font-bold' : ''} mb-2`}>
                                            <span className={`material-icons text-base font-bold w-4 ${currentCaption === null ? 'opacity-100' : 'opacity-0'}`}>check</span>
                                            <span>Off</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                            {sortedLangKeys.map(langKey => (
                                                <div key={langKey} onClick={() => setSubtitleLanguage(langKey)} className="flex items-center justify-between cursor-pointer py-2 px-3 rounded hover:bg-[#333] transition group">
                                                    <span>{langKey}</span>
                                                    <span className="material-icons text-gray-500 text-sm group-hover:text-white">chevron_right</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                );
                            } else {
                                // View 2: Tracks List for Selected Language (same format grid)
                                const pageTitle = subtitleLanguage;
                                return (
                                    <div className="flex flex-col h-full">
                                        <div onClick={() => setSubtitleLanguage(null)} className="flex items-center gap-2 cursor-pointer mb-3 text-gray-400 hover:text-white transition w-max">
                                            <span className="material-icons text-base">arrow_back</span>
                                            <span className="uppercase text-xs font-bold tracking-wider">{pageTitle}</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                                            {groups[subtitleLanguage]?.map(cap => (
                                                <div key={cap.id} onClick={() => handleSubtitleChange(cap.url)} className={`flex items-center gap-3 cursor-pointer py-2 px-3 rounded hover:bg-[#333] transition ${currentCaption === cap.url ? 'font-bold text-white' : 'text-gray-300'}`}>
                                                    <span className={`material-icons text-base font-bold w-4 ${currentCaption === cap.url ? 'opacity-100' : 'opacity-0'}`}>check</span>
                                                    <span>{cap.label}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                </div>
            )}

            {activePanel === 'quality' && (
                <PopupPanel title="Video Quality" onClose={() => setActivePanel('none')}>
                    <div className="p-0 bg-[#141414]">
                        <div onClick={() => handleQualityChange(-1)} className={`px-6 py-4 text-lg cursor-pointer transition flex justify-between items-center border-b border-[#282828] hover:bg-[#202020] ${currentQuality === -1 ? 'bg-[#202020]' : ''}`}><span className={`${currentQuality === -1 ? 'font-bold text-white' : 'text-gray-300'}`}>Auto</span>{currentQuality === -1 && <span className="material-icons text-white">check</span>}</div>
                        {qualities.map(q => (<div key={q.level} onClick={() => handleQualityChange(q.level)} className={`px-6 py-4 text-lg cursor-pointer transition flex justify-between items-center border-b border-[#282828] hover:bg-[#202020] ${currentQuality === q.level ? 'bg-[#202020]' : ''}`}><span className={`${currentQuality === q.level ? 'font-bold text-white' : 'text-gray-300'}`}>{q.height}p</span>{currentQuality === q.level && <span className="material-icons text-white">check</span>}</div>))}
                    </div>
                </PopupPanel>
            )}

        </div>
    );
};

export default VideoPlayer;
