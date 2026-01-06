import React from 'react';
import { Episode } from '../types';
import { ArrowLeftIcon, XIcon, CaretDownIcon, PlayCircleIcon, CheckIcon } from '@phosphor-icons/react';

interface PopupPanelProps {
    title: string;
    onBack?: () => void;
    onClose: () => void;
    children: React.ReactNode;
    headerContent?: React.ReactNode;
}

const MinimalPanel: React.FC<{
    onClose: () => void;
    onHover?: () => void;
    children: React.ReactNode;
}> = ({ onClose, onHover, children }) => (
    <div
        className="absolute bottom-24 right-4 w-auto min-w-[700px] max-w-[800px] max-h-[45vh] bg-[#262626] z-[110] flex flex-col font-['Consolas'] shadow-2xl rounded overflow-hidden animate-fadeIn"
        onMouseEnter={onHover}
        onMouseLeave={onClose}
    >
        <div className="flex-1 overflow-y-auto scrollbar-none">
            {children}
        </div>
    </div>
);

const SubtitleMenu: React.FC<{
    captions: Array<{ id: string; label: string; url: string; lang: string }>;
    currentCaption: string | null;
    onSubtitleChange: (url: string | null) => void;
}> = ({ captions, currentCaption, onSubtitleChange }) => {

    // Keep one subtitle per language (by lang code)
    const uniqueCaptions = React.useMemo(() => {
        const seenLangs = new Set<string>();
        const result: typeof captions = [];

        // Sort: English first, then alphabetically by label
        const sorted = [...captions].sort((a, b) => {
            const aIsEnglish = a.lang === 'en' || a.label.toLowerCase().includes('english');
            const bIsEnglish = b.lang === 'en' || b.label.toLowerCase().includes('english');
            if (aIsEnglish && !bIsEnglish) return -1;
            if (!aIsEnglish && bIsEnglish) return 1;
            return a.label.localeCompare(b.label);
        });

        for (const cap of sorted) {
            // Use lang code for deduplication (keep first of each language)
            const langKey = cap.lang || cap.label;
            if (!seenLangs.has(langKey)) {
                seenLangs.add(langKey);
                result.push(cap);
            }
        }
        return result;
    }, [captions]);

    return (
        <div className="grid grid-cols-2 gap-x-2 py-3 px-2">
            {/* Off Option */}
            <div
                onClick={() => onSubtitleChange(null)}
                className="flex items-center px-3 py-2 cursor-pointer hover:bg-white/5 transition rounded"
            >
                <div className="w-5 mr-2 flex justify-center">
                    {currentCaption === null && <CheckIcon size={16} weight="bold" className="text-white" />}
                </div>
                <span className={`text-lg ${currentCaption === null ? 'text-white' : 'text-white/60'}`}>
                    Off
                </span>
            </div>

            {/* Subtitle Options */}
            {uniqueCaptions.map(cap => (
                <div
                    key={cap.id}
                    onClick={() => onSubtitleChange(cap.url)}
                    className="flex items-center px-3 py-2 cursor-pointer hover:bg-white/5 transition rounded"
                >
                    <div className="w-5 mr-2 flex justify-center">
                        {currentCaption === cap.url && <CheckIcon size={16} weight="bold" className="text-white" />}
                    </div>
                    <span className={`text-lg ${currentCaption === cap.url ? 'text-white' : 'text-white/60'}`}>
                        {cap.label}
                    </span>
                </div>
            ))}
        </div>
    );
};



// Netflix-Style Episode Explorer with Preview Mode
const EpisodeExplorer: React.FC<{
    seasonList: number[];
    currentSeasonEpisodes: Episode[];
    selectedSeason: number;
    currentEpisode: number;
    playingSeason?: number;
    onSeasonSelect: (season: number) => void;
    onEpisodeSelect: (ep: Episode) => void;
    activePanel: 'seasons' | 'episodes' | string;
    setActivePanel: (panel: any) => void;
    showTitle?: string;
    onPanelHover?: () => void;
    onClose?: () => void;
}> = ({ seasonList, currentSeasonEpisodes, selectedSeason, currentEpisode, playingSeason, onSeasonSelect, onEpisodeSelect, activePanel, setActivePanel, showTitle, onPanelHover, onClose }) => {

    const [previewSeason, setPreviewSeason] = React.useState(selectedSeason);
    const [expandedEpisodeId, setExpandedEpisodeId] = React.useState<number | null>(null);

    // Sync preview
    React.useEffect(() => {
        setPreviewSeason(selectedSeason);
    }, [selectedSeason, activePanel]);

    // Auto-expand playing episode when viewing that season
    React.useEffect(() => {
        if (playingSeason === selectedSeason) {
            const playingEp = currentSeasonEpisodes.find(ep => ep.episode_number === currentEpisode);
            if (playingEp) {
                setExpandedEpisodeId(playingEp.id);
            }
        }
    }, [selectedSeason, playingSeason, currentEpisode, currentSeasonEpisodes]);

    const handleSeasonClick = (s: number) => {
        setPreviewSeason(s);
        onSeasonSelect(s);
        setActivePanel('episodes');
    };

    return (
        <div
            className="absolute bottom-24 right-4 w-auto min-w-[550px] max-w-[650px] min-h-[50vh] max-h-[85vh] bg-[#262626] z-[110] flex flex-col font-['Consolas'] shadow-2xl rounded overflow-hidden animate-fadeIn text-white"
            onMouseEnter={onPanelHover}
            onMouseLeave={onClose || (() => setActivePanel('none'))}
        >
            {activePanel === 'seasons' && (
                <div className="flex flex-col py-2 overflow-y-auto max-h-[60vh]">
                    {showTitle && (
                        <div className="px-4 py-4 border-b border-white/20">
                            <span className="text-white text-xl">{showTitle}</span>
                        </div>
                    )}
                    {seasonList.map(s => (
                        <div
                            key={s}
                            onClick={() => handleSeasonClick(s)}
                            className={`flex items-center px-4 py-5 cursor-pointer hover:bg-white/5 transition ${selectedSeason === s ? 'border-[3px] border-white/60' : ''}`}
                        >
                            <div className="w-6 mr-3 flex justify-center">
                                {selectedSeason === s && <CheckIcon size={16} weight="bold" className="text-white" />}
                            </div>
                            <span className={`text-lg font-['Consolas'] ${selectedSeason === s ? 'text-white' : 'text-white/60'}`}>
                                Season {s}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            {activePanel === 'episodes' && (
                <div className="flex flex-col">
                    <div
                        className="flex items-center px-4 py-3 border-[3px] border-white/60 cursor-pointer hover:bg-white/5"
                        onClick={() => setActivePanel('seasons')}
                    >
                        <ArrowLeftIcon size={18} className="text-white mr-3" />
                        <span className="text-white text-lg font-['Consolas']">Season {previewSeason}</span>
                    </div>

                    <div className="flex flex-col py-2 max-h-[75vh] overflow-y-auto scrollbar-none">
                        {currentSeasonEpisodes.map(ep => {
                            const isPlaying = currentEpisode === ep.episode_number && playingSeason === selectedSeason;
                            const isExpanded = expandedEpisodeId === ep.id;

                            return (
                                <div
                                    key={ep.id}
                                    className={`px-4 transition ${isExpanded ? 'bg-[#0f1112] pb-6 pt-4' : 'py-4 hover:bg-white/5'}`}
                                >
                                    {/* Header / Click Area */}
                                    <div
                                        className="flex items-center cursor-pointer"
                                        onClick={() => setExpandedEpisodeId(isExpanded ? null : ep.id)}
                                    >
                                        <span className={`w-8 text-lg font-['Consolas'] font-normal ${isPlaying ? 'text-white font-bold' : 'text-white/70'}`}>
                                            {ep.episode_number}
                                        </span>
                                        <span className={`flex-1 text-lg font-['Consolas'] font-bold text-white`}>
                                            {ep.name}
                                        </span>
                                    </div>

                                    {/* Expanded Detail */}
                                    {isExpanded && (
                                        <div className="flex mt-4 gap-5 ml-2 animate-fadeIn">
                                            {ep.still_path && (
                                                <div
                                                    className="relative group cursor-pointer flex-shrink-0"
                                                    onClick={() => onEpisodeSelect(ep)}
                                                >
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w300${ep.still_path}`}
                                                        alt={ep.name}
                                                        className="w-60 h-36 object-cover shadow-lg"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-all">
                                                        <PlayCircleIcon size={48} weight="fill" className="text-white drop-shadow-lg transform group-hover:scale-110 transition-transform" />
                                                    </div>
                                                </div>
                                            )}

                                            {ep.overview && (
                                                <p className="flex-1 text-base text-white line-clamp-4 leading-relaxed overflow-hidden text-ellipsis">
                                                    {ep.overview}
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

interface VideoPlayerSettingsProps {
    activePanel: 'none' | 'episodes' | 'seasons' | 'audioSubtitles' | 'quality';
    setActivePanel: (panel: 'none' | 'episodes' | 'seasons' | 'audioSubtitles' | 'quality') => void;
    seasonList: number[];
    currentSeasonEpisodes: Episode[];
    selectedSeason: number;
    currentEpisode: number;
    playingSeason?: number;
    onSeasonSelect: (season: number) => void;
    onEpisodeSelect: (ep: Episode) => void;
    qualities: Array<{ height: number; level: number }>;
    currentQuality: number;
    onQualityChange: (level: number) => void;
    captions: Array<{ id: string; label: string; url: string; lang: string }>;
    currentCaption: string | null;
    onSubtitleChange: (url: string | null) => void;
    showTitle?: string;
    onPanelHover?: () => void;
    onStartHide?: () => void;
}

const VideoPlayerSettings: React.FC<VideoPlayerSettingsProps> = ({
    activePanel,
    setActivePanel,
    seasonList,
    currentSeasonEpisodes,
    selectedSeason,
    currentEpisode,
    playingSeason,
    onSeasonSelect,
    onEpisodeSelect,
    qualities,
    currentQuality,
    onQualityChange,
    captions,
    currentCaption,
    onSubtitleChange,
    showTitle,
    onPanelHover,
    onStartHide
}) => {

    if (activePanel === 'none') return null;

    // Use onStartHide for mouse leave if provided, otherwise fallback to immediate close (safety)
    const handleMouseLeave = onStartHide || (() => setActivePanel('none'));

    return (
        <>
            {/* Minimal Subtitles Panel */}
            {activePanel === 'audioSubtitles' && (
                <MinimalPanel onClose={handleMouseLeave} onHover={onPanelHover}>
                    <SubtitleMenu captions={captions} currentCaption={currentCaption} onSubtitleChange={onSubtitleChange} />
                </MinimalPanel>
            )}

            {/* Minimal Quality Panel */}
            {activePanel === 'quality' && (
                <MinimalPanel onClose={handleMouseLeave} onHover={onPanelHover}>
                    <div className="grid grid-cols-2 gap-3 p-2">
                        <button
                            onClick={() => onQualityChange(-1)}
                            className={`p-4 text-center rounded bg-[#222] hover:bg-[#333] transition ${currentQuality === -1 ? 'border-2 border-[#E50914] text-white' : 'text-white/60'}`}
                        >
                            Auto
                        </button>
                        {qualities.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => onQualityChange(q.level)}
                                className={`p-4 text-center rounded bg-[#222] hover:bg-[#333] transition ${currentQuality === q.level ? 'border-2 border-[#E50914] text-white' : 'text-white/60'}`}
                            >
                                {q.height}p {q.height >= 1080 && 'HD'}
                            </button>
                        ))}
                    </div>
                </MinimalPanel>
            )}

            {/* Netflix-Style Episode Explorer */}
            {(activePanel === 'seasons' || activePanel === 'episodes') && (
                <EpisodeExplorer
                    seasonList={seasonList}
                    currentSeasonEpisodes={currentSeasonEpisodes}
                    selectedSeason={selectedSeason}
                    currentEpisode={currentEpisode}
                    playingSeason={playingSeason}
                    onSeasonSelect={onSeasonSelect}
                    onEpisodeSelect={(ep) => { onEpisodeSelect(ep); setActivePanel('none'); }}
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    showTitle={showTitle}
                    onPanelHover={onPanelHover}
                    onClose={handleMouseLeave}
                />
            )}
        </>
    );
};

export default VideoPlayerSettings;
