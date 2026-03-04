import React, { useState } from 'react';
import { ListIcon, XIcon, CaretDownIcon, BellIcon } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import SearchBar from './SearchBar';
import kinemoraLogo from '../src/assets/kinemora-logo.png';
import { useGlobalContext } from '../context/GlobalContext';

interface NavbarProps {
  isScrolled: boolean;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isScrolled, searchQuery, setSearchQuery, activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const { isKidsMode, setIsKidsMode } = useGlobalContext();

  const navItems = isKidsMode ? [
    { id: 'home', label: t('nav.home', { defaultValue: 'Home' }) },
    { id: 'characters', label: t('nav.characters', { defaultValue: 'Characters' }) },
    { id: 'tv', label: t('nav.shows', { defaultValue: 'Series' }) },
    { id: 'movies', label: t('nav.movies', { defaultValue: 'Films' }) },
    { id: 'new', label: t('nav.newPopular', { defaultValue: 'New & Popular' }) },
    { id: 'list', label: t('nav.myList', { defaultValue: 'My List' }) },
    { id: 'language', label: t('nav.browseByLanguage', { defaultValue: 'Browse by Language' }) },
  ] : [
    { id: 'home', label: t('nav.home', { defaultValue: 'Home' }) },
    { id: 'tv', label: t('nav.shows', { defaultValue: 'Series' }) },
    { id: 'movies', label: t('nav.movies', { defaultValue: 'Films' }) },
    { id: 'new', label: t('nav.newPopular', { defaultValue: 'New & Popular' }) },
    { id: 'list', label: t('nav.myList', { defaultValue: 'My List' }) },
    { id: 'language', label: t('nav.browseByLanguage', { defaultValue: 'Browse by Language' }) },
  ];

  const handleTabClick = (tabId: string) => {
    // "Browse by Language" and "Kids" don't have dedicated pages yet — just notify
    if (tabId === 'language') return;
    setActiveTab(tabId);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSearchQuery('');
  };

  return (
    <nav
      className={`fixed top-8 w-full z-[80] transition-all duration-500 
        px-6 py-3 md:px-14 md:py-3 lg:px-16 lg:py-3
        ${isScrolled || mobileMenuOpen ? 'bg-[#141414] shadow-lg' : 'bg-transparent'}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 md:space-x-8">
          <img
            src={kinemoraLogo}
            alt="Kinemora"
            className="h-5 sm:h-6 md:h-7 lg:h-8 cursor-pointer drop-shadow-lg transition-transform hover:scale-105 relative z-10"
            onClick={() => handleTabClick('home')}
          />

          <ul className="hidden md:flex items-center space-x-4 lg:space-x-5 text-[11px] lg:text-[13px] font-normal text-[#e5e5e5]">
            {navItems.map((item) => (
              <li
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`cursor-pointer transition-colors whitespace-nowrap ${activeTab === item.id ? 'text-white font-semibold' : 'hover:text-[#b3b3b3]'
                  } ${item.id === 'language' ? 'text-[#b3b3b3] hover:text-[#e5e5e5]' : ''}`}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center space-x-3 md:space-x-5">
          {/* Search Bar */}
          {activeTab !== 'settings' && (
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          )}

          {isKidsMode ? (
            <>
              {/* Kids Mode Special Icons */}
              <div className="hidden md:flex flex-col items-center justify-center w-[34px] h-[34px] rounded shrink-0 bg-gradient-to-br from-cyan-400 via-pink-400 to-yellow-400 text-white font-black text-[11px] leading-none shadow-sm cursor-pointer select-none">
                kids
              </div>
              <button
                onClick={() => {
                  setIsKidsMode(false);
                  handleTabClick('home');
                }}
                className="hidden md:block h-8 px-5 bg-[#e50914] text-white text-[13px] font-bold rounded shadow-sm hover:bg-[#f40612] transition-colors"
              >
                Exit Kids
              </button>
            </>
          ) : (
            <>
              {/* Kids Link */}
              <span
                className="hidden md:inline text-[13px] text-[#e5e5e5] hover:text-[#b3b3b3] cursor-pointer transition-colors font-normal"
                onClick={() => {
                  setIsKidsMode(true);
                  handleTabClick('home');
                }}
              >
                Kids
              </span>

              {/* Notification Bell */}
              <BellIcon
                size={20}
                className="hidden md:block text-white cursor-pointer hover:text-[#b3b3b3] transition-colors"
              />

              {/* Profile Avatar + Dropdown */}
              <div
                className="hidden md:flex items-center gap-1.5 cursor-pointer relative"
                onMouseEnter={() => setProfileMenuOpen(true)}
                onMouseLeave={() => setProfileMenuOpen(false)}
              >
                <div className="w-8 h-8 rounded-[4px] overflow-hidden ring-1 ring-transparent hover:ring-white/30 transition-all">
                  {/* Placeholder avatar — user will customize later */}
                  <svg viewBox="0 0 36 36" className="w-full h-full">
                    <rect width="36" height="36" fill="#e50914" />
                    <circle cx="18" cy="13" r="7" fill="#fff" />
                    <ellipse cx="18" cy="32" rx="12" ry="10" fill="#fff" />
                  </svg>
                </div>
                <CaretDownIcon
                  size={10}
                  weight="bold"
                  className={`text-white/70 transition-transform duration-300 ${profileMenuOpen ? 'rotate-180' : ''}`}
                />

                {/* Dropdown Panel */}
                <div className={`absolute top-full right-0 pt-3 z-50 transition-all duration-200 ${profileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-1 pointer-events-none'}`}>
                  {/* Triangle pointer */}
                  <div className="absolute top-[7px] right-[18px] w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[7px] border-b-[#e5e5e5]" />

                  <div className="w-56 bg-[#141414]/[0.97] border border-[#454545] rounded-[2px] shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Profile Slots */}
                    <div className="py-3 px-4 space-y-3">
                      {/* Profile 1 - Active */}
                      <div className="flex items-center gap-3 group/profile cursor-pointer">
                        <div className="w-8 h-8 rounded-[4px] overflow-hidden flex-shrink-0">
                          <svg viewBox="0 0 36 36" className="w-full h-full">
                            <rect width="36" height="36" fill="#e50914" />
                            <circle cx="18" cy="13" r="7" fill="#fff" />
                            <ellipse cx="18" cy="32" rx="12" ry="10" fill="#fff" />
                          </svg>
                        </div>
                        <span className="text-[13px] text-white group-hover/profile:underline">User</span>
                      </div>
                      {/* Profile 2 - Placeholder */}
                      <div className="flex items-center gap-3 group/profile cursor-pointer" onClick={() => setIsKidsMode(true)}>
                        <div className="w-8 h-8 rounded-[4px] overflow-hidden flex-shrink-0 bg-[#0080ff] flex items-center justify-center text-white font-bold text-[10px] leading-none">
                          Kids
                        </div>
                        <span className="text-[13px] text-[#b3b3b3] group-hover/profile:underline group-hover/profile:text-white">Kids</span>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#454545]" />

                    {/* Menu Items */}
                    <div className="py-2">
                      <div className="px-4 py-[6px] text-[13px] text-[#b3b3b3] hover:text-white hover:underline cursor-pointer transition-colors flex items-center gap-3">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" /></svg>
                        Manage Profiles
                      </div>
                      <div className="px-4 py-[6px] text-[13px] text-[#b3b3b3] hover:text-white hover:underline cursor-pointer transition-colors flex items-center gap-3">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1s3.1 1.39 3.1 3.1v2z" /></svg>
                        Transfer Profile
                      </div>
                      <div
                        onClick={() => handleTabClick('settings')}
                        className="px-4 py-[6px] text-[13px] text-[#b3b3b3] hover:text-white hover:underline cursor-pointer transition-colors flex items-center gap-3"
                      >
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
                        Account
                      </div>
                      <div className="px-4 py-[6px] text-[13px] text-[#b3b3b3] hover:text-white hover:underline cursor-pointer transition-colors flex items-center gap-3">
                        <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" /></svg>
                        Help Centre
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-[#454545]" />

                    {/* Sign Out */}
                    <div className="py-2">
                      <div className="px-4 py-[6px] text-[13px] text-[#b3b3b3] hover:text-white hover:underline cursor-pointer transition-colors text-center">
                        Sign out of Kinemora
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center ml-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <XIcon size={24} className="text-white cursor-pointer" /> : <ListIcon size={24} className="text-white cursor-pointer" />}
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#141414] border-t border-gray-800 flex flex-col items-center py-6 space-y-6 animate-fadeIn shadow-2xl h-screen">
          {navItems.filter(i => i.id !== 'language').map((item) => (
            <div
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`text-lg font-medium ${activeTab === item.id ? 'text-white font-bold' : 'text-gray-400'}`}
            >
              {item.label}
            </div>
          ))}
          <div
            onClick={() => handleTabClick('settings')}
            className={`text-lg font-medium ${activeTab === 'settings' ? 'text-white font-bold' : 'text-gray-400'}`}
          >
            Account & Settings
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;