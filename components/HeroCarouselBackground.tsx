import React, { useRef, useEffect, useState } from 'react';
import Hls from 'hls.js';
import { Movie } from '../types';
import { IMG_PATH } from '../constants';
import { applyYouTubeQuality } from '../hooks/useNetworkQuality';

const getStreamAPI = () => (window as any).electron?.pstream;

interface HeroCarouselBackgroundProps {
    movie: Movie;
    showVideo: boolean;
    trailerQueue: string[];
    isVideoReady: boolean;
    setIsVideoReady: (ready: boolean) => void;
    setTrailerQueue: React.Dispatch<React.SetStateAction<string[]>>;
    setShowVideo: (show: boolean) => void;
    isMuted: boolean;
    videoDimensions: { width: string | number, height: string | number };
    playerRef: any;
    isHovered: boolean;
    onSyncCheck?: (videoId: string) => number | undefined;
    onVideoEnd?: () => void;
    youtubeQuality?: 'hd720' | 'hd1080' | 'default';
    replayCount?: number;
}

const HeroCarouselBackground: React.FC<HeroCarouselBackgroundProps> = ({
    movie,
    showVideo,
    trailerQueue,
    isVideoReady,
    setIsVideoReady,
    setTrailerQueue,
    setShowVideo,
    isMuted,
    videoDimensions,
    playerRef,
    isHovered,
    onSyncCheck,
    onVideoEnd,
    youtubeQuality = 'hd1080',
    replayCount = 0
}) => {
    const progressIntervalRef = useRef<any>(null);

    // State for hidden video approach
    const [isVideoHidden, setIsVideoHidden] = useState(false);
    const hasTriggeredHideRef = useRef(false);
    const hasStartedAudioFadeRef = useRef(false);
    const waitingForLoopRef = useRef(false);
    const lastTimeRef = useRef(0);

    const [streamUrl, setStreamUrl] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<Hls | null>(null);
    const teaserStartRef = useRef(120); // start at minute 2:00 to avoid logos
    const teaserEndRef = useRef(150);   // tease for exactly 30 seconds

    // 1. Fetch genuine stream URL when showVideo is true
    useEffect(() => {
        if (!showVideo || streamUrl) return; // avoid re-fetching

        let isMounted = true;
        const fetchStream = async () => {
            const api = getStreamAPI();
            if (!api) return;

            const mediaType = movie.media_type || (movie.first_air_date ? 'tv' : 'movie');
            const title = movie.name || movie.title || '';
            const year = (movie.release_date || movie.first_air_date || '').split('-')[0];

            try {
                console.log(`[HeroTeaser] Fetching actual stream for ${title}...`);
                const result = await api.getStream(
                    title,
                    mediaType,
                    year ? parseInt(year) : undefined,
                    1, // season 1
                    1, // episode 1
                    String(movie.id)
                );

                if (isMounted && result.success && result.sources && result.sources.length > 0) {
                    const hlsSource = result.sources.find((s: any) => s.isM3U8) || result.sources[0];
                    console.log(`[HeroTeaser] Stream fetch complete:`, hlsSource.url);
                    setStreamUrl(hlsSource.url);
                }
            } catch (err) {
                console.error('[HeroTeaser] Failed to fetch stream teaser:', err);
            }
        };

        fetchStream();

        return () => { isMounted = false; };
    }, [showVideo, movie, streamUrl]);

    // 2. Initialize HLS native player when streamUrl arrives
    useEffect(() => {
        if (!streamUrl || !videoRef.current) return;

        const video = videoRef.current;
        playerRef.current = video; // Map playerRef to HTML5 Video for external volume control

        if (Hls.isSupported()) {
            const hls = new Hls({ startPosition: teaserStartRef.current });
            hlsRef.current = hls;
            hls.loadSource(streamUrl);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                video.muted = isMuted;
                video.play().catch(e => console.warn('[HeroTeaser] Autoplay prevented:', e));
            });

            // Fallback for fatal HLS errors to fail gracefully
            hls.on(Hls.Events.ERROR, (event, data) => {
                if (data.fatal) {
                    console.error('[HeroTeaser] Fatal HLS error, destroying teaser.');
                    hls.destroy();
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari fallback
            video.src = streamUrl;
            video.currentTime = teaserStartRef.current;
            video.muted = isMuted;
            video.play().catch(e => console.warn('[HeroTeaser] Autoplay prevented:', e));
        }

        const handleCanPlay = () => {
            console.log('[HeroTeaser] Stream loaded, turning on visual layer.');
            setIsVideoReady(true);
        };

        video.addEventListener('canplay', handleCanPlay);

        return () => {
            video.removeEventListener('canplay', handleCanPlay);
            if (hlsRef.current) {
                hlsRef.current.destroy();
            }
        };
    }, [streamUrl]);

    // 3. Smart Teaser Looper
    useEffect(() => {
        if (!showVideo || !isVideoReady || !videoRef.current) return;

        const video = videoRef.current;
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);

        progressIntervalRef.current = setInterval(() => {
            try {
                if (video.currentTime >= teaserEndRef.current) {
                    console.log(`[HeroTeaser] 30s tease completed, looping seamlessly to ${teaserStartRef.current}s.`);
                    video.currentTime = teaserStartRef.current;
                }

                // If volume matches global state
                video.muted = isMuted;
            } catch (e) {
                console.error('[HeroTeaser] Tease loop error:', e);
            }
        }, 100);

        return () => {
            if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        };
    }, [showVideo, isVideoReady, isMuted]);

    return (
        <>
            {/* Background Image */}
            <div className={`absolute inset-0 transition-opacity duration-700 ease-in-out z-0 ${showVideo && isVideoReady && !isVideoHidden ? "opacity-0" : "opacity-100"}`}>
                <img
                    src={`${IMG_PATH}${movie.backdrop_path}`}
                    className={`w-full h-full object-cover ${['series', 'comic', 'manga', 'local'].includes(movie.media_type || '') ? 'object-[50%_30%]' : 'object-center'}`}
                    alt="backdrop"
                />
            </div>

            {/* Background Video Layer - INSTANTLY hidden when isVideoHidden to prevent YouTube overlay */}
            <div
                id="hero-video-layer"
                className={`absolute inset-0 z-0 ${isVideoHidden ? 'invisible' : (showVideo && isVideoReady ? 'opacity-100' : 'opacity-0 transition-opacity duration-500')}`}
                style={isVideoHidden ? { visibility: 'hidden', display: 'none' } : {}}
            >
                {showVideo && streamUrl && (
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[42%] pointer-events-none z-0"
                        style={{ width: videoDimensions.width, height: videoDimensions.height }}
                    >
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            playsInline
                            webkit-playsinline="true"
                            muted={isMuted} // fallback
                        />
                    </div>
                )}
            </div>

            {/* Netflix-style deep vignette gradients */}
            {/* Left side vignette - subtle */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent z-10 pointer-events-none" />
            {/* Bottom vignette - deep, smooth fade into #141414 */}
            <div className="absolute inset-0 z-10 pointer-events-none" style={{
                background: 'linear-gradient(to top, #141414 0%, #14141499 15%, #14141433 30%, transparent 50%)'
            }} />
        </>
    );
};

export default HeroCarouselBackground;
