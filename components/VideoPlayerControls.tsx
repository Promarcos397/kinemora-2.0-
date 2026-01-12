import React, { useRef } from 'react';
import {
    PlayIcon,
    PauseIcon,
    ArrowCounterClockwiseIcon,
    ArrowClockwiseIcon,
    SpeakerHighIcon,
    SpeakerLowIcon,
    SpeakerXIcon,
    SkipForwardIcon,
    GearSixIcon,
    CornersOutIcon,
    SubtitlesIcon,
    SubtitlesSlashIcon,
    CardsThreeIcon
} from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';

interface VideoPlayerControlsProps {
    isPlaying: boolean;
    isMuted: boolean;
    progress: number;
    duration: number;
    isBuffering: boolean;
    showNextEp: boolean;
    title: React.ReactNode;
    areSubtitlesOff?: boolean;
    onPlayPause: () => void;
    onSeek: (amount: number) => void;
    volume: number;
    onVolumeChange: (volume: number) => void;
    onToggleMute: () => void;
    onTimelineSeek: (percentage: number) => void;
    onNextEpisode?: () => void;
    onClose: () => void;
    onToggleFullscreen: () => void;
    onSettingsClick: () => void;
    onSubtitlesClick?: () => void;
    onSubtitlesHover?: () => void;
    onSettingsHover?: () => void;
    onEpisodesClick?: () => void;
    onEpisodesHover?: () => void;
    onMenuClose?: () => void;
    isMenuOpen?: boolean;
    showUI: boolean;
}

const VideoPlayerControls: React.FC<VideoPlayerControlsProps> = ({
    isPlaying,
    isMuted,
    progress,
    isBuffering,
    showNextEp,
    title,
    areSubtitlesOff,
    onPlayPause,
    onSeek,
    volume,
    onVolumeChange,
    onToggleMute,
    onTimelineSeek,
    onNextEpisode,
    onToggleFullscreen,
    onSettingsClick,
    onSubtitlesClick,
    onSubtitlesHover,
    onSettingsHover,
    onEpisodesClick,
    onEpisodesHover,
    onMenuClose,
    isMenuOpen,
    showUI
}) => {
    const { t } = useTranslation();
    const timelineRef = useRef<HTMLDivElement>(null);

    const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        if (timelineRef.current) {
            const rect = timelineRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const perc = Math.max(0, Math.min(100, (x / rect.width) * 100));
            onTimelineSeek(perc);
        }
    };

    return (
        <div className={`absolute inset-x-0 bottom-0 z-50 bg-gradient-to-t from-black via-black/80 to-transparent px-8 pb-8 pt-20 transition-opacity duration-300 ${showUI ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
            {/* Timeline - P-Stream Style */}
            <div
                ref={timelineRef}
                className={`relative w-full h-1 hover:h-1.5 transition-[height] duration-200 cursor-pointer flex items-center group/timeline mb-6 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
                onClick={handleTimelineClick}
            >
                {/* Background Track */}
                <div className="absolute top-0 left-0 w-full h-full bg-white/20 rounded-full" />

                {/* Buffered */}
                <div
                    className="absolute top-0 left-0 h-full bg-white/40 rounded-full transition-all duration-300"
                    style={{ width: isBuffering ? '100%' : '0%' }} // Note: We need real buffer progress later, using isBuffering for now as visual placeholder or 0
                />

                {/* Filled Progress */}
                <div
                    className="absolute top-0 left-0 h-full bg-[#E50914] rounded-full flex items-center justify-end"
                    style={{ width: `${progress}%` }}
                >
                    {/* Handle */}
                    <div className="w-4 h-4 bg-[#E50914] rounded-full shadow-md transform scale-0 group-hover/timeline:scale-100 transition-transform duration-200 translate-x-1/2" />
                </div>
            </div>

            <div className="relative flex items-center justify-between">
                <div className="flex items-center space-x-6 z-10">
                    <button onClick={(e) => { e.stopPropagation(); onPlayPause(); }} className="text-gray-300 hover:text-white transition transform hover:scale-110">
                        {isPlaying ? <PauseIcon size={48} weight="fill" /> : <PlayIcon size={48} weight="fill" />}
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onSeek(-10); }} className="text-gray-300 hover:text-white transition transform hover:scale-110 relative flex items-center justify-center">
                        <ArrowCounterClockwiseIcon size={48} weight="bold" />
                        <span className="absolute text-[0.6rem] text-white mt-1 select-none pointer-events-none">10</span>
                    </button>
                    <button onClick={(e) => { e.stopPropagation(); onSeek(10); }} className="text-gray-300 hover:text-white transition transform hover:scale-110 relative flex items-center justify-center">
                        <ArrowClockwiseIcon size={48} weight="bold" />
                        <span className="absolute text-[0.6rem] text-white mt-1 select-none pointer-events-none">10</span>
                    </button>

                    {/* Volume Control */}
                    <div className="flex items-center group/vol relative">
                        <button onClick={(e) => { e.stopPropagation(); onToggleMute(); }} className="text-gray-300 hover:text-white transition transform hover:scale-110 z-20">
                            {isMuted || volume === 0
                                ? <SpeakerXIcon size={48} weight="bold" />
                                : volume < 0.5
                                    ? <SpeakerLowIcon size={48} weight="bold" />
                                    : <SpeakerHighIcon size={48} weight="bold" />
                            }
                        </button>
                        <div className="w-0 overflow-hidden group-hover/vol:w-24 transition-all duration-300 ease-in-out flex items-center ml-2">
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={(e) => { e.stopPropagation(); onVolumeChange(parseFloat(e.target.value)); }}
                                className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-white hover:accent-red-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Centered Title */}
                <div className="absolute left-1/2 transform -translate-x-1/2 z-0 pointer-events-none text-center">
                    <span className="text-2xl text-white select-none whitespace-nowrap overflow-hidden text-ellipsis max-w-[600px] block">
                        {title}
                    </span>
                </div>

                <div className="flex items-center space-x-6 z-10">
                    {onNextEpisode && showNextEp && (
                        <button onClick={(e) => { e.stopPropagation(); onNextEpisode(); }} className="text-white text-lg uppercase tracking-wide flex items-center transition hover:opacity-80">
                            <span className="mr-1"><SkipForwardIcon size={32} weight="bold" /></span> {t('player.nextEp')}
                        </button>
                    )}

                    {onSubtitlesClick && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onSubtitlesClick(); }}
                            onMouseEnter={onSubtitlesHover}
                            className={`text-gray-300 hover:text-white transition transform hover:scale-110 ${isMenuOpen ? 'text-white' : ''}`}
                        >
                            {areSubtitlesOff ? <SubtitlesSlashIcon size={48} weight="bold" /> : <SubtitlesIcon size={48} weight="bold" />}
                        </button>
                    )}

                    {onSettingsClick && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onSettingsClick(); }}
                            onMouseEnter={onSettingsHover}
                            className={`text-gray-300 hover:text-white transition transform hover:scale-110 ${isMenuOpen ? 'text-white' : ''}`}
                        >
                            <GearSixIcon size={48} />
                        </button>
                    )}

                    {onEpisodesClick && (
                        <button
                            onClick={(e) => { e.stopPropagation(); onEpisodesClick(); }}
                            onMouseEnter={onEpisodesHover}
                            className={`text-gray-300 hover:text-white transition transform hover:scale-110 ${isMenuOpen ? 'text-white' : ''}`}
                        >
                            <CardsThreeIcon size={48} weight="bold" />
                        </button>
                    )}

                    <button onClick={(e) => { e.stopPropagation(); onToggleFullscreen(); }} className="text-gray-300 hover:text-white transition transform hover:scale-110">
                        <CornersOutIcon size={48} weight="bold" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoPlayerControls;
