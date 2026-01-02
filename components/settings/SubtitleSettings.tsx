import React from 'react';
import { AppSettings } from '../../types';
import { SettingsToggle, SettingsSlider, SettingsSelectGroup } from '../ui/SettingsUI';

interface SubtitleSettingsProps {
    settings: AppSettings;
    updateSettings: (s: Partial<AppSettings>) => void;
}

const SubtitleSettings: React.FC<SubtitleSettingsProps> = ({ settings, updateSettings }) => {
    return (
        <div className="space-y-8 animate-fadeIn">
             <div className="border-b border-white/5 pb-2 mb-4">
                <h2 className="text-lg font-bold text-white">Subtitle Appearance</h2>
                <p className="text-xs text-gray-500">Customize text style for readability.</p>
            </div>

            {/* Master Toggle */}
            <SettingsToggle 
                label="Show Subtitles" 
                checked={settings.showSubtitles} 
                onChange={() => updateSettings({ showSubtitles: !settings.showSubtitles })}
                icon="subtitles"
            />

            <div className={`space-y-8 transition-all duration-300 ${settings.showSubtitles ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>
                
                {/* 1. Typography Section */}
                <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 space-y-6">
                    <SettingsSelectGroup 
                        label="Text Size"
                        selectedId={settings.subtitleSize}
                        onChange={(val) => updateSettings({ subtitleSize: val })}
                        options={[
                            { id: 'small', label: 'Small' },
                            { id: 'medium', label: 'Medium' },
                            { id: 'large', label: 'Large' },
                        ]}
                    />

                    <SettingsSelectGroup 
                        label="Text Color"
                        type="color"
                        selectedId={settings.subtitleColor}
                        onChange={(val) => updateSettings({ subtitleColor: val })}
                        options={[
                            { id: 'white', value: '#ffffff' },
                            { id: 'yellow', value: '#FFD700' },
                            { id: 'cyan', value: '#00FFFF' },
                        ]}
                    />
                </div>

                {/* 2. Background Section */}
                <div className="bg-[#1a1a1a] rounded-xl p-5 border border-white/5 space-y-6">
                     <SettingsSelectGroup 
                        label="Background Style"
                        type="icon"
                        selectedId={settings.subtitleBackground}
                        onChange={(val) => updateSettings({ subtitleBackground: val })}
                        options={[
                            { id: 'none', label: 'None', icon: 'block' },
                            { id: 'drop-shadow', label: 'Shadow', icon: 'text_format' },
                            { id: 'box', label: 'Box', icon: 'branding_watermark' },
                        ]}
                    />

                    {/* Advanced Box Settings */}
                    {settings.subtitleBackground === 'box' && (
                        <div className="pt-4 border-t border-white/5 space-y-6 animate-slideUp">
                            <SettingsSlider 
                                label="Background Opacity"
                                value={settings.subtitleOpacity}
                                min={0} max={100} unit="%"
                                onChange={(val) => updateSettings({ subtitleOpacity: val })}
                            />
                             <SettingsSlider 
                                label="Background Blur"
                                value={settings.subtitleBlur}
                                min={0} max={20} unit="px"
                                onChange={(val) => updateSettings({ subtitleBlur: val })}
                            />
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SubtitleSettings;
