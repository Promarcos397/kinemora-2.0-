import React from 'react';
import { useGlobalContext, DEFAULT_SETTINGS } from '../context/GlobalContext';
import SettingsLayout from '../components/settings/SettingsLayout';

const SettingsPage: React.FC = () => {
    const { settings, updateSettings, continueWatching } = useGlobalContext();

    const handleReset = () => {
        if (window.confirm("Restore default playback and subtitle settings?")) {
            updateSettings(DEFAULT_SETTINGS);
        }
    };

    return (
        <SettingsLayout
            settings={settings}
            updateSettings={updateSettings}
            continueWatching={continueWatching}
            onReset={handleReset}
        />
    );
};

export default SettingsPage;