import React, { ReactNode } from 'react';
import Navbar from './Navbar';

import useScroll from '../hooks/useScroll';

interface LayoutProps {
  children: ReactNode;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  showFooter = true
}) => {
  const isScrolled = useScroll(0);

  return (
    <div className="bg-[#141414] min-h-screen font-sans text-white selection:bg-red-600 selection:text-white">
      {/* Add top padding equal to TitleBar height (32px/h-8) + Navbar usage. Navbar is fixed too. */}
      {/* Actually Layout wraps content. Navbar is inside layout. */}
      {/* TitleBar is fixed (h-8). Navbar is fixed (top-0). */}
      {/* If TitleBar is at top, Navbar should be top-8. */}
      <div className="pt-8">
        <Navbar
          isScrolled={isScrolled}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Main Content Area */}
      <div className="min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default Layout;