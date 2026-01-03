import React from 'react';
import { AppSettings } from '../../types';
import { SettingsToggle } from '../ui/SettingsUI';

interface PlaybackSectionProps {
    settings: AppSettings;
    updateSettings: (s: Partial<AppSettings>) => void;
}

const PlaybackSection: React.FC<PlaybackSectionProps> = ({ settings, updateSettings }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="bg-[#141414] border border-white/5 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                    <h3 className="font-bold text-white text-lg">Autoplay Controls</h3>
                </div>
                <div className="p-6 space-y-6">
                    <SettingsToggle
                        label="Autoplay Previews"
                        subLabel="Automatically play trailers while browsing on all devices."
                        checked={settings.autoplayPreviews}
                        onChange={() => updateSettings({ autoplayPreviews: !settings.autoplayPreviews })}
                        icon="play_circle_filled"
                    />

                    <SettingsToggle
                        label="Autoplay Next Episode"
                        subLabel="Automatically start the next episode."
                        checked={settings.autoplayNextEpisode}
                        onChange={() => updateSettings({ autoplayNextEpisode: !settings.autoplayNextEpisode })}
                        icon="queue_play_next"
                    />
                </div>
            </div>

            <div className="px-2">
                <p className="text-xs text-gray-500">Data usage settings per screen are managed in your account profile.</p>
            </div>
        </div>
    );
};

export default PlaybackSection;
