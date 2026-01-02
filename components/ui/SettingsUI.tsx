import React from 'react';

// --- Generic Toggle Switch ---
interface ToggleProps {
  label: string;
  subLabel?: string;
  checked: boolean;
  onChange: () => void;
  icon?: string;
}

export const SettingsToggle: React.FC<ToggleProps> = ({ label, subLabel, checked, onChange, icon }) => (
  <div 
    onClick={onChange}
    className="group flex items-center justify-between bg-[#222] hover:bg-[#2a2a2a] p-4 rounded-lg cursor-pointer transition-all duration-200 border border-white/5 hover:border-white/10 select-none shadow-sm hover:shadow-md"
  >
      <div className="flex items-center gap-4">
          {icon && (
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${checked ? 'bg-white text-black shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'bg-black/40 text-gray-500'}`}>
                <span className="material-icons text-lg">{icon}</span>
            </div>
          )}
          <div>
            <span className={`block font-medium text-sm transition-colors ${checked ? 'text-white' : 'text-gray-400'}`}>{label}</span>
            {subLabel && <span className="block text-xs text-gray-500 mt-0.5">{subLabel}</span>}
          </div>
      </div>
      <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${checked ? 'bg-[#E50914]' : 'bg-gray-700'}`}>
          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </div>
  </div>
);

// --- Generic Range Slider ---
interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    unit?: string;
    onChange: (val: number) => void;
    disabled?: boolean;
}

export const SettingsSlider: React.FC<SliderProps> = ({ label, value, min, max, unit, onChange, disabled }) => (
    <div className={`space-y-3 transition-opacity duration-300 ${disabled ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
        <div className="flex justify-between text-xs font-medium text-gray-400 uppercase tracking-wide">
            <span>{label}</span>
            <span className="text-white">{value}{unit}</span>
        </div>
        <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
            <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#E50914] to-red-500 rounded-full" 
                style={{ width: `${((value - min) / (max - min)) * 100}%` }}
            />
            <input 
                type="range" 
                min={min} max={max} 
                value={value}
                onChange={(e) => onChange(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer touch-none"
                style={{ touchAction: 'none' }}
            />
        </div>
    </div>
);

// --- Selection Button Group ---
interface Option {
    id: string;
    label?: string;
    value?: string; // For colors
    icon?: string;
}

interface SelectGroupProps {
    label: string;
    options: Option[];
    selectedId: string;
    onChange: (id: any) => void;
    type?: 'text' | 'color' | 'icon';
}

export const SettingsSelectGroup: React.FC<SelectGroupProps> = ({ label, options, selectedId, onChange, type = 'text' }) => (
    <div className="space-y-3">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
        <div className="flex gap-3 flex-wrap">
            {options.map((opt) => {
                const isSelected = selectedId === opt.id;
                
                if (type === 'color') {
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onChange(opt.id)}
                            className={`w-10 h-10 rounded-full border-2 transition-transform duration-200 flex items-center justify-center ${isSelected ? 'scale-110 border-white ring-2 ring-white/20' : 'border-transparent hover:scale-105 opacity-80'}`}
                            style={{ backgroundColor: opt.value }}
                            title={opt.label || opt.id}
                        >
                            {isSelected && <span className="material-icons text-black text-sm font-bold">check</span>}
                        </button>
                    );
                }

                if (type === 'icon') {
                    return (
                        <button
                            key={opt.id}
                            onClick={() => onChange(opt.id)}
                            className={`flex-1 min-w-[80px] py-3 rounded-lg border transition-all duration-200 flex flex-col items-center gap-1 ${isSelected ? 'bg-white text-black border-white shadow-lg' : 'bg-[#222] text-gray-400 border-transparent hover:bg-[#2a2a2a]'}`}
                        >
                            <span className="material-icons text-xl">{opt.icon}</span>
                            <span className="text-[10px] font-bold uppercase">{opt.label}</span>
                        </button>
                    );
                }

                // Default Text
                return (
                    <button
                        key={opt.id}
                        onClick={() => onChange(opt.id)}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 border ${isSelected ? 'bg-white text-black border-white shadow-md' : 'bg-[#222] text-gray-400 border-transparent hover:border-gray-600 hover:text-white'}`}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    </div>
);