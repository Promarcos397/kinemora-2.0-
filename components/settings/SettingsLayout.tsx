
import React, { useState } from 'react';
import SettingsMenu, { SettingsView } from './SettingsMenu';
import SubtitleSection from './SubtitleSection';
import PlaybackSection from './PlaybackSection';
import PlaceholderSection from './PlaceholderSection';
import { AppSettings } from '../../types';

interface SettingsLayoutProps {
    settings: AppSettings;
    updateSettings: (s: Partial<AppSettings>) => void;
    continueWatching: any[];
    onReset: () => void;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ settings, updateSettings, continueWatching, onReset }) => {
    // Initialize view from URL
    const [currentView, setCurrentView] = useState<SettingsView>(() => {
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section');
        const validViews: SettingsView[] = ['appearance', 'playback', 'subtitle', 'account', 'language', 'notification', 'activity', 'privacy'];

        if (section && validViews.includes(section as SettingsView)) {
            return section as SettingsView;
        }
        return 'menu';
    });

    // Navigation Handler
    const handleNavigate = (view: SettingsView) => {
        setCurrentView(view);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Update URL
        const url = new URL(window.location.href);
        if (view === 'menu') {
            url.searchParams.delete('section');
        } else {
            url.searchParams.set('section', view);
        }
        window.history.pushState({}, '', url.toString());
    };

    const handleBack = () => {
        handleNavigate('menu');
    };

    // Detail Component Renderer
    const renderDetail = () => {
        switch (currentView) {
            case 'subtitle':
                return (
                    <DetailWrapper title="Subtitle appearance" onBack={handleBack}>
                        <SubtitleSection
                            settings={settings}
                            updateSettings={updateSettings}
                            continueWatching={continueWatching}
                        />
                    </DetailWrapper>
                );
            case 'playback':
                return (
                    <DetailWrapper title="Playback settings" onBack={handleBack}>
                        <PlaybackSection
                            settings={settings}
                            updateSettings={updateSettings}
                        />
                    </DetailWrapper>
                );
            case 'language':
                return <DetailWrapper title="Languages" onBack={handleBack}><PlaceholderSection title="Language Preferences" message="Multi-language display settings are coming soon." icon="translate" /></DetailWrapper>;

            case 'notification':
                return <DetailWrapper title="Notification settings" onBack={handleBack}><PlaceholderSection title="Adjust Notifications" message="Email and push notification preferences." icon="notifications_active" /></DetailWrapper>;
            case 'activity':
                return <DetailWrapper title="Viewing activity" onBack={handleBack}><PlaceholderSection title="Watch History" message="View and download your viewing history." icon="history" /></DetailWrapper>;
            case 'privacy':
                return <DetailWrapper title="Privacy and data" onBack={handleBack}><PlaceholderSection title="Data Privacy" message="GDPR and data usage controls." icon="security" /></DetailWrapper>;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#141414] text-white pt-20 pb-20 font-sans">
            {currentView === 'menu' ? (
                <SettingsMenu onNavigate={handleNavigate} />
            ) : (
                renderDetail()
            )}
        </div>
    );
};

// Helper Wrapper for Detail Views
const DetailWrapper: React.FC<{ title: string; onBack: () => void; children: React.ReactNode }> = ({ title, onBack, children }) => (
    <div className="max-w-4xl mx-auto px-4 animate-slideUp">
        <div className="flex items-center space-x-4 mb-8 pt-4">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <span className="material-icons text-white">arrow_back</span>
            </button>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
        </div>
        <div className="bg-black/20 rounded-xl p-0 md:p-6">
            {children}
        </div>
    </div>
);

export default SettingsLayout;
