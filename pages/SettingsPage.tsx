import React from 'react';
import { useGlobalContext, DEFAULT_SETTINGS } from '../context/GlobalContext';
import { IMG_PATH } from '../constants';
import SubtitlePreview from '../components/settings/SubtitlePreview';
import PlaybackSettings from '../components/settings/PlaybackSettings';
import SubtitleSettings from '../components/settings/SubtitleSettings';

const SettingsPage: React.FC = () => {
  const { settings, updateSettings, continueWatching } = useGlobalContext();

  // Fallback image for preview
  const previewBackdrop = continueWatching.length > 0 
    ? `${IMG_PATH}${continueWatching[0].backdrop_path}`
    : "https://image.tmdb.org/t/p/original/mDeUmPeRp1tN2bY8n4Jp1Mv6i8H.jpg";

  const handleReset = () => {
      if (window.confirm("Restore default playback and subtitle settings?")) {
          updateSettings(DEFAULT_SETTINGS);
      }
  };

  return (
    <div className="h-screen w-screen bg-[#0a0a0a] overflow-hidden flex flex-col pt-16 md:pt-20">
        <div className="flex flex-col-reverse md:flex-row flex-1 overflow-hidden relative">
            
            {/* LEFT PANEL: Controls (Scrollable) */}
            <div className="w-full md:w-[450px] lg:w-[500px] xl:w-[550px] bg-[#121212] flex flex-col border-r border-white/5 z-20 shadow-2xl relative">
                
                {/* Header */}
                <div className="px-8 py-6 border-b border-white/5 bg-[#121212]/95 backdrop-blur-sm sticky top-0 z-30 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                             <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Studio</h1>
                             <p className="text-xs text-gray-500 font-medium tracking-wide mt-1">PLAYBACK CONFIGURATION</p>
                        </div>
                        <button 
                            onClick={handleReset}
                            className="text-[10px] font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-all border border-white/10 hover:border-white px-3 py-1.5 rounded hover:bg-white/5"
                        >
                            Reset Defaults
                        </button>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8 space-y-10 pb-32">
                    
                    {/* Section 1: Playback */}
                    <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                        <PlaybackSettings settings={settings} updateSettings={updateSettings} />
                    </section>

                    {/* Section 2: Subtitles */}
                    <section className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                         <SubtitleSettings settings={settings} updateSettings={updateSettings} />
                    </section>

                    {/* Footer Info */}
                    <div className="pt-8 text-center opacity-40">
                         <div className="w-12 h-1 bg-white/10 mx-auto rounded-full mb-4" />
                         <p className="text-[10px] text-gray-500 font-mono">Kinemora Player Engine v2.4.0</p>
                    </div>
                </div>
                
                {/* Gradient fade at bottom of scroll area */}
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#121212] to-transparent pointer-events-none z-20" />
            </div>

            {/* RIGHT PANEL: Live Preview */}
            <div className="flex-1 relative bg-black overflow-hidden z-10 flex flex-col">
                 {/* Mobile Header (Only visible on small screens) */}
                 <div className="md:hidden p-4 bg-[#121212] border-b border-white/5 flex items-center justify-between">
                     <span className="text-xs font-bold text-gray-400 tracking-widest uppercase">Live Preview</span>
                 </div>

                <div className="relative flex-1 p-4 md:p-12 flex items-center justify-center bg-[#050505]">
                     <div className="relative w-full max-w-5xl aspect-video shadow-2xl rounded-lg overflow-hidden ring-1 ring-white/10">
                        <SubtitlePreview settings={settings} backdropUrl={previewBackdrop} />
                     </div>
                </div>
                
                {/* Decorative Grid Background */}
                <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
                    style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
                />
            </div>
        </div>
    </div>
  );
};

export default SettingsPage;