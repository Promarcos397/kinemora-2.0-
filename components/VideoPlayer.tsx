import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import NextEpisodeButton from './NextEpisodeButton';
import Hls from 'hls.js';
import { useTranslation } from 'react-i18next';
import { Movie, Episode } from '../types';
import { getSeasonDetails, getMovieDetails, getExternalIds } from '../services/api';

// --- STREAMING SERVICE ---
import { consumetService } from '../services/stream/consumet';
import { useGlobalContext } from '../context/GlobalContext';
import { parseSubtitles, captionIsVisible, sanitize, CaptionCueType, makeQueId } from '../utils/captions';

import VideoPlayerControls from './VideoPlayerControls';
import VideoPlayerSettings from './VideoPlayerSettings';
import { ArrowLeftIcon } from '@phosphor-icons/react';

// 1. STATIC MAPPING: Explicitly map Providers to their required Referers
// This prevents the "Goku stream on FlixHQ CDN" mismatch issue.
const PROVIDER_REFERERS: Record<string, string> = {
    'Goku': 'https://goku.sx/',
    'HiMovies': 'https://himovies.sx/',
    'FlixHQ': 'https://flixhq.to/',
    'SFlix': 'https://sflix.to/',
    // Add fallbacks or new providers here as needed
};

interface VideoPlayerProps {
    movie: Movie;
    season?: number;
    episode?: number;
    onClose: () => void;
}

// ... (CaptionCue components and other helpers remain unchanged) ...

const VideoPlayer: React.FC<VideoPlayerProps> = ({ movie, season = 1, episode = 1, onClose }) => {
    const { addToHistory, settings } = useGlobalContext();
    const { t } = useTranslation();

    const [showUI, setShowUI] = useState(true);
    // ... (Keep existing state definitions) ...
    const [isBuffering, setIsBuffering] = useState(true);
    const [qualities, setQualities] = useState<any[]>([]);
    const [captions, setCaptions] = useState<any[]>([]);
    const [currentCaption, setCurrentCaption] = useState<any>(null);
    const [hasAutoSelected, setHasAutoSelected] = useState(false);
    const [parsedCaptions, setParsedCaptions] = useState<CaptionCueType[]>([]);
    const [activeCues, setActiveCues] = useState<CaptionCueType[]>([]);
    const [useIframeMode, setUseIframeMode] = useState(false);
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);
    const [playingSeasonNumber, setPlayingSeasonNumber] = useState(season);
    const [currentEpisode, setCurrentEpisode] = useState(episode);


    const videoRef = useRef<HTMLVideoElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);

    const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');

    // ... (Keep existing generic hooks and effects) ...

    useEffect(() => {
        const fetchStream = async () => {
            setIsBuffering(true);
            setQualities([]);
            setCaptions([]);
            setCurrentCaption(null);
            setHasAutoSelected(false);
            setParsedCaptions([]);
            setActiveCues([]);
            setUseIframeMode(false);
            setIframeUrl(null);

            const tmdbId = movie.id.toString();
            const type = mediaType === 'tv' ? 'tv' : 'movie';
            const movieTitle = movie.title || movie.name || '';
            const movieYear = movie.release_date?.split('-')[0] || movie.first_air_date?.split('-')[0];

            try {
                console.log(`[VideoPlayer] Trying Consumet: "${movieTitle}" (${movieYear}) Type=${type} S=${playingSeasonNumber} E=${currentEpisode}`);

                let streamData;
                if (type === 'movie') {
                    streamData = await consumetService.getMovieStream(movieTitle, Number(movieYear), tmdbId);
                } else {
                    streamData = await consumetService.getTvStream(movieTitle, playingSeasonNumber, currentEpisode, Number(movieYear), tmdbId);
                }

                if (streamData && streamData.sources && streamData.sources.length > 0) {
                    const source = streamData.sources.find(s => s.isM3U8) || streamData.sources[0];
                    console.log(`[VideoPlayer] Got M3U8 from ${source.provider}:`, source.url);

                    if (Hls.isSupported() && videoRef.current) {
                        if (hlsRef.current) hlsRef.current.destroy();

                        // 2. DETERMINE REFERER:
                        // Use the explicit provider map first. Fallback to origin if provider is unknown.
                        const providerName = source.provider || 'Goku';
                        const correctReferer = PROVIDER_REFERERS[providerName] || new URL(source.url).origin + '/';
                        
                        console.log(`[VideoPlayer] Using Referer strategy: ${correctReferer} (Provider: ${providerName})`);

                        // 3. CUSTOM LOADER
                        class ElectronLoader extends Hls.DefaultConfig.loader {
                            load(context: any, config: any, callbacks: any) {
                                const { url, responseType } = context;

                                // console.log(`[HLS] Requesting: ${url} | Type: ${responseType}`);

                                window.electron.request({
                                    url,
                                    method: 'GET',
                                    headers: {
                                        'Referer': correctReferer, // The specific provider URL
                                        'Origin': new URL(correctReferer).origin
                                    },
                                    // Critical: Tell Main process we expect binary if it's a segment
                                    responseType: responseType === 'arraybuffer' ? 'arraybuffer' : 'text'
                                }).then((response: any) => {
                                    if (response.ok) {
                                        const responseBody = response.body;
                                        
                                        // 4. DATA CONVERSION
                                        // Handle buffer response (from axios 'arraybuffer')
                                        let data = responseBody;

                                        if (responseType === 'arraybuffer') {
                                            // If IPC sent a Uint8Array (Node Buffer), pass its underlying ArrayBuffer
                                            if (responseBody instanceof Uint8Array) {
                                                data = responseBody.buffer;
                                            }
                                            // Fallback: If for some reason we got a string, encode it (legacy handling)
                                            else if (typeof responseBody === 'string') {
                                                const encoder = new TextEncoder();
                                                data = encoder.encode(responseBody).buffer;
                                            }
                                        }

                                        callbacks.onSuccess(
                                            { url, data: data },
                                            { loaded: (data.byteLength || data.length || 0), total: (data.byteLength || data.length || 0) },
                                            context,
                                            null
                                        );
                                    } else {
                                        console.error(`[HLS Loader] 403/Error on ${url}`);
                                        callbacks.onError({ code: response.status || 404, text: response.statusText }, context, null, null);
                                    }
                                }).catch((err: any) => {
                                    console.error(`[HLS Loader] Exception: ${err.message}`);
                                    callbacks.onError({ code: 500, text: err.message }, context, null, null);
                                });
                            }

                            abort() { /* No-op */ }
                            destroy() { /* No-op */ }
                        }

                        const hls = new Hls({
                            maxBufferLength: 30,
                            maxMaxBufferLength: 600,
                            enableWorker: false, // Must disable worker to use main-process IPC loader
                            loader: ElectronLoader,
                        });

                        hls.loadSource(source.url);
                        hls.attachMedia(videoRef.current);
                        hlsRef.current = hls;

                        hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                            const levels = data.levels.map((lvl, index) => ({ height: lvl.height, level: index }));
                            levels.sort((a, b) => b.height - a.height);
                            setQualities(levels);
                            videoRef.current?.play().catch(e => console.error("Autoplay failed", e));
                            setIsBuffering(false);
                        });

                        hls.on(Hls.Events.ERROR, (event, data) => {
                            // Filter out harmless buffer stalling errors
                            if (data.details !== Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
                                console.warn("HLS Error:", data.type, data.details);
                            }
                            if (data.fatal) {
                                console.log('[VideoPlayer] HLS Fatal Error');
                                switch (data.type) {
                                    case Hls.ErrorTypes.NETWORK_ERROR:
                                        hls.startLoad();
                                        break;
                                    case Hls.ErrorTypes.MEDIA_ERROR:
                                        hls.recoverMediaError();
                                        break;
                                    default:
                                        hls.destroy();
                                        break;
                                }
                            }
                        });

                        // Handle subtitles if present
                        if (streamData.subtitles && streamData.subtitles.length > 0) {
                            const englishSub = streamData.subtitles.find(s => s.lang?.toLowerCase().includes('english'));
                            if (englishSub) {
                                fetch(englishSub.url)
                                    .then(r => r.text())
                                    .then(text => {
                                        const parsed = parseSubtitles(text, englishSub.url.endsWith('.vtt') ? 'vtt' : 'srt');
                                        setParsedCaptions(parsed);
                                        setCaptions(streamData.subtitles);
                                        // Default to English if available
                                        setCurrentCaption(englishSub);
                                    })
                                    .catch(e => console.error("Subtitle load failed", e));
                            }
                        }

                        return; 
                    }
                }

                // ... (Fallback Logic) ...
                console.log('[VideoPlayer] No M3U8 found, falling back...');
                setIsBuffering(false);

            } catch (err) {
                console.error("[VideoPlayer] Stream error:", err);
                setIsBuffering(false);
            }
        };

        fetchStream();

        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
        };
    }, [movie, currentEpisode, playingSeasonNumber, mediaType]);

    // ... (Keep the rest of your UI rendering code exactly as is) ...
    
    // Placeholder return to match your structure
    return (
        <div className={`fixed inset-0 z-[100] bg-black font-['Consolas'] text-white overflow-hidden select-none group/player ${showUI ? '' : 'cursor-none'}`}>
             {/* ... Your existing UI code ... */}
             <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <video ref={videoRef} className="w-full h-full" controls={false} />
             </div>
             {/* ... */}
        </div>
    );
};

export default VideoPlayer;