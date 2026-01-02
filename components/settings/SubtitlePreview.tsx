import React from 'react';
import { AppSettings } from '../../types';

interface SubtitlePreviewProps {
    settings: AppSettings;
    backdropUrl: string;
}

const SubtitlePreview: React.FC<SubtitlePreviewProps> = ({ settings, backdropUrl }) => {

    // Style Calculation Logic
    const getSubtitleStyle = () => {
        const baseStyle: React.CSSProperties = {
            color: settings.subtitleColor === 'yellow' ? '#FFD700' : settings.subtitleColor === 'cyan' ? '#00FFFF' : '#FFFFFF',
            fontSize: settings.subtitleSize === 'small' ? '1.25rem' : settings.subtitleSize === 'large' ? '2.5rem' : '1.75rem',
            // Alfa Slab One is a display font, usually 400 weight corresponds to its thick look
            fontWeight: '400', 
            fontFamily: '"Alfa Slab One", cursive',
            letterSpacing: '1px',
            textAlign: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            lineHeight: '1.4',
        };

        if (settings.subtitleBackground === 'drop-shadow') {
            // Hard shadow looks better with Slab font
            baseStyle.textShadow = '2px 2px 0px rgba(0,0,0,1)'; 
            baseStyle.backgroundColor = 'transparent';
        } else if (settings.subtitleBackground === 'box') {
            baseStyle.backgroundColor = `rgba(0,0,0, ${settings.subtitleOpacity / 100})`;
            // Add webkit prefix for broader support
            baseStyle.backdropFilter = `blur(${settings.subtitleBlur}px)`;
            (baseStyle as any).WebkitBackdropFilter = `blur(${settings.subtitleBlur}px)`;
            
            baseStyle.padding = '0.25em 0.75em';
            baseStyle.borderRadius = '8px';
            baseStyle.boxDecorationBreak = 'clone';
            baseStyle.textShadow = 'none'; 
        } else {
            // None
            baseStyle.textShadow = '2px 2px 0px rgba(0,0,0,1)';
            baseStyle.backgroundColor = 'transparent';
        }

        return baseStyle;
    };

    return (
        <div className="relative w-full h-full bg-black md:rounded-xl overflow-hidden shadow-2xl group select-none">
            {/* Background Image */}
            <div className="absolute inset-0">
                 <img 
                    src={backdropUrl} 
                    className="w-full h-full object-cover opacity-80 transition-transform duration-[60s] ease-linear group-hover:scale-110" 
                    alt="Preview" 
                />
                 {/* Cinematic Gradient Overlays */}
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                 <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
            </div>

            {/* Live Indicator */}
            <div className="absolute top-4 left-4 md:top-6 md:left-6 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                <span className="text-[10px] font-bold text-white/90 tracking-widest uppercase">Live Preview</span>
            </div>

            {/* Subtitles Overlay */}
            <div className="absolute inset-x-0 bottom-10 md:bottom-16 px-6 md:px-20 flex flex-col items-center justify-end min-h-[120px] transition-opacity duration-300" style={{ opacity: settings.showSubtitles ? 1 : 0 }}>
                <span style={getSubtitleStyle()}>
                    Wait, did you hear that?
                </span>
                <span style={getSubtitleStyle()} className="mt-2">
                    I think we are being watched.
                </span>
            </div>
        </div>
    );
};

export default SubtitlePreview;
