import React, { useState } from 'react';
import { useGlobalContext } from '../context/GlobalContext';
import kinemoraLogo from '../src/assets/kinemora-logo.png';

interface ProfileSelectionProps {
    onSelected: () => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ onSelected }) => {
    const { setIsKidsMode } = useGlobalContext();
    const [selectedProfile, setSelectedProfile] = useState<'user' | 'kids' | null>(null);

    const handleProfileClick = (profile: 'user' | 'kids') => {
        if (selectedProfile) return; // Prevent double clicks

        setSelectedProfile(profile);

        // Animate for 1.2 seconds before transitioning
        setTimeout(() => {
            setIsKidsMode(profile === 'kids');
            onSelected();
        }, 1200);
    };

    return (
        <div className="fixed inset-0 z-50 bg-[#141414] flex flex-col items-center justify-center min-h-screen font-sans">
            {/* Kinemora Logo Top Left (Static) */}
            <div className="absolute top-6 left-12">
                <img
                    src={kinemoraLogo}
                    alt="Kinemora"
                    className="h-6 sm:h-8"
                    draggable={false}
                />
            </div>

            <div className={`transition-opacity duration-300 ${selectedProfile ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-medium mb-12 text-center tracking-wide">
                    Who's watching?
                </h1>

                <div className="flex flex-row justify-center gap-4 sm:gap-6 md:gap-8">
                    {/* Default User Profile */}
                    <div
                        onClick={() => handleProfileClick('user')}
                        className="group flex flex-col items-center cursor-pointer hover:text-white text-gray-400"
                    >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded bg-blue-600 relative overflow-hidden ring-2 ring-transparent group-hover:ring-white transition-all duration-300 mb-4 items-center justify-center flex">
                            <svg viewBox="0 0 36 36" className="w-full h-full">
                                <rect width="36" height="36" fill="#e50914" />
                                <circle cx="18" cy="13" r="7" fill="#fff" />
                                <ellipse cx="18" cy="32" rx="12" ry="10" fill="#fff" />
                            </svg>
                        </div>
                        <span className="text-xl md:text-2xl transition-colors duration-300">User</span>
                    </div>

                    {/* Kids Profile */}
                    <div
                        onClick={() => handleProfileClick('kids')}
                        className="group flex flex-col items-center cursor-pointer hover:text-white text-gray-400"
                    >
                        <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded bg-gradient-to-br from-cyan-400 via-pink-400 to-yellow-400 relative overflow-hidden ring-2 ring-transparent group-hover:ring-white transition-all duration-300 mb-4 items-center justify-center flex">
                            <span className="text-white font-black text-3xl sm:text-4xl md:text-5xl drop-shadow-md">kids</span>
                        </div>
                        <span className="text-xl md:text-2xl transition-colors duration-300">Kids</span>
                    </div>
                </div>

                <div className="mt-16 flex justify-center">
                    <button className="border border-gray-500 text-gray-400 px-6 sm:px-8 py-2 md:py-3 text-[13px] md:text-sm font-semibold tracking-widest hover:text-white hover:border-white transition-colors uppercase">
                        Manage Profiles
                    </button>
                </div>
            </div>

            {/* Loading Spinner Animation (Red Ring) */}
            {selectedProfile && (
                <div className="absolute inset-0 flex items-center justify-center z-10 animate-fadeIn">
                    <div className="relative w-28 h-28 sm:w-36 sm:h-36">
                        {/* Inner shrinking avatar */}
                        <div className="absolute inset-0 m-auto w-12 h-12 sm:w-16 sm:h-16 rounded overflow-hidden opacity-80 animate-pulse">
                            {selectedProfile === 'user' ? (
                                <svg viewBox="0 0 36 36" className="w-full h-full">
                                    <rect width="36" height="36" fill="#e50914" />
                                    <circle cx="18" cy="13" r="7" fill="#fff" />
                                    <ellipse cx="18" cy="32" rx="12" ry="10" fill="#fff" />
                                </svg>
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-cyan-400 via-pink-400 to-yellow-400 flex items-center justify-center">
                                    <span className="text-white font-black text-lg drop-shadow-sm">kids</span>
                                </div>
                            )}
                        </div>

                        {/* Red Spinner Ring */}
                        <svg viewBox="0 0 100 100" className="w-full h-full">
                            <circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="#e50914"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className="origin-center animate-spin"
                                style={{
                                    strokeDasharray: '283',
                                    strokeDashoffset: '210',
                                    animationDuration: '1s'
                                }}
                            />
                        </svg>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSelection;
