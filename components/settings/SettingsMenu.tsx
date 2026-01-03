import React from 'react';

export type SettingsView = 'menu' | 'appearance' | 'playback' | 'subtitle' | 'account' | 'language' | 'notification' | 'activity' | 'privacy';

interface SettingsMenuProps {
    onNavigate: (view: SettingsView) => void;
}

interface MenuItemProps {
    icon: string;
    label: string;
    subLabel: string;
    onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, subLabel, onClick }) => (
    <div
        onClick={onClick}
        className="group flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 cursor-pointer transition-all active:scale-[0.99]"
    >
        <div className="flex items-center space-x-4">
            <span className="material-icons text-gray-400 group-hover:text-white transition-colors">{icon}</span>
            <div>
                <h3 className="text-base font-bold text-gray-200 group-hover:text-white">{label}</h3>
                <p className="text-xs text-gray-500">{subLabel}</p>
            </div>
        </div>
        <span className="material-icons text-gray-600 group-hover:text-gray-400">chevron_right</span>
    </div>
);

const SettingsMenu: React.FC<SettingsMenuProps> = ({ onNavigate }) => {
    return (
        <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn">

            {/* Header */}
            <div className="flex items-center space-x-4 mb-2">
                <button onClick={() => window.history.back()} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                    <span className="material-icons text-white">arrow_back</span>
                </button>
                <div className="flex-1 text-center pr-12"> {/* pr-12 balances the back button width */}
                    <h1 className="text-2xl font-bold text-white">Manage profile and preferences</h1>
                </div>
            </div>

            <div className="h-px w-full bg-white/10 mb-8" />

            {/* List */}
            <div className="space-y-4">

                <h2 className="text-lg font-bold text-white mb-4 px-1">Preferences</h2>

                <MenuItem
                    icon="translate"
                    label="Languages"
                    subLabel="Set languages for display and audio"
                    onClick={() => onNavigate('language')}
                />

                <MenuItem
                    icon="subtitles"
                    label="Subtitle appearance"
                    subLabel="Customize the way subtitles appear"
                    onClick={() => onNavigate('subtitle')}
                />

                <MenuItem
                    icon="play_circle_outline"
                    label="Playback settings"
                    subLabel="Set autoplay and audio, video quality"
                    onClick={() => onNavigate('playback')}
                />

                <MenuItem
                    icon="notifications"
                    label="Notification settings"
                    subLabel="Manage notifications for email, text, push"
                    onClick={() => onNavigate('notification')}
                />

                <MenuItem
                    icon="history"
                    label="Viewing activity"
                    subLabel="Manage viewing history and ratings"
                    onClick={() => onNavigate('activity')}
                />

                <MenuItem
                    icon="security"
                    label="Privacy and data settings"
                    subLabel="Manage usage of personal info"
                    onClick={() => onNavigate('privacy')}
                />

            </div>
        </div>
    );
};

export default SettingsMenu;
