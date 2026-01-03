import React from 'react';
import { AppSettings } from '../../types';
import { SettingsToggle, SettingsSlider, SettingsSelectGroup } from '../ui/SettingsUI';

interface SubtitleSettingsProps {
    settings: AppSettings;
    updateSettings: (s: Partial<AppSettings>) => void;
}

const SubtitleSettings: React.FC<SubtitleSettingsProps> = ({ settings, updateSettings }) => {
    return (
        <div className="space-y-12 animate-fadeIn">

            {/* Master Toggle */}
            <SettingsToggle
                label="Show Subtitles"
                checked={settings.showSubtitles}
                onChange={() => updateSettings({ showSubtitles: !settings.showSubtitles })}
                icon="subtitles"
            />

            <div className={`space-y-12 transition-all duration-300 ${settings.showSubtitles ? 'opacity-100' : 'opacity-40 pointer-events-none grayscale'}`}>

                {/* 1. Typography Section */}
                <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                        <SettingsSelectGroup
                            label="Font Family"
                            selectedId={settings.subtitleFontFamily}
                            onChange={(val) => updateSettings({ subtitleFontFamily: val })}
                            options={[
                                { id: 'monospace', label: 'Console' },
                                { id: 'typewriter', label: 'Typewriter' },
                                { id: 'print', label: 'Print' },
                                { id: 'block', label: 'Block' },
                                { id: 'casual', label: 'Casual' },
                                { id: 'cursive', label: 'Cursive' },
                                { id: 'small-caps', label: 'Small Caps' },
                            ]}
                        />

                        <SettingsSelectGroup
                            label="Edge Effect"
                            selectedId={settings.subtitleEdgeStyle}
                            onChange={(val) => updateSettings({ subtitleEdgeStyle: val })}
                            options={[
                                { id: 'none', label: 'None' },
                                { id: 'raised', label: 'Raised' },
                                { id: 'depressed', label: 'Depressed' },
                                { id: 'uniform', label: 'Uniform' },
                                { id: 'drop-shadow', label: 'Drop Shadow' },
                            ]}
                        />

                        <SettingsSelectGroup
                            label="Text Size"
                            selectedId={settings.subtitleSize}
                            onChange={(val) => updateSettings({ subtitleSize: val })}
                            options={[
                                { id: 'tiny', label: 'Tiny' },
                                { id: 'small', label: 'Small' },
                                { id: 'medium', label: 'Medium' },
                                { id: 'large', label: 'Large' },
                                { id: 'huge', label: 'Huge' },
                            ]}
                        />

                        <SettingsSelectGroup
                            label="Text Color"
                            type="color"
                            selectedId={settings.subtitleColor}
                            onChange={(val) => updateSettings({ subtitleColor: val })}
                            options={[
                                { id: 'white', value: '#FFFFFF' },   // Pure White
                                { id: 'yellow', value: '#FFF000' },  // Vibrant Yellow
                                { id: 'cyan', value: '#00FFFF' },    // Vibrant Cyan
                                { id: 'green', value: '#00FF00' },   // Vibrant Green
                                { id: 'red', value: '#FF0000' },     // Vibrant Red
                                { id: 'blue', value: '#0000FF' },    // Vibrant Blue
                                { id: 'black', value: '#000000' },   // Pure Black
                            ]}
                        />
                    </div>
                </div>

                {/* 2. Window / Background Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="font-bold text-gray-400 text-xs uppercase tracking-wider">Window Background</h3>
                        <SettingsToggle
                            label=""
                            checked={settings.subtitleBackground === 'box'}
                            onChange={() => updateSettings({ subtitleBackground: settings.subtitleBackground === 'box' ? 'none' : 'box' })}
                            icon=""
                        />
                    </div>

                    {settings.subtitleBackground === 'box' && (
                        <div className="animate-fadeIn space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                                <SettingsSlider
                                    label="Opacity"
                                    value={settings.subtitleOpacity}
                                    min={0} max={100} unit="%"
                                    onChange={(val) => updateSettings({ subtitleOpacity: val })}
                                />
                                <SettingsSlider
                                    label="Blur"
                                    value={settings.subtitleBlur}
                                    min={0} max={20} unit="px"
                                    onChange={(val) => updateSettings({ subtitleBlur: val })}
                                />
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default SubtitleSettings;
