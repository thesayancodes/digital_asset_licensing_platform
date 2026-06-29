'use client';

// ============================================
// Header (Matches screenshot style)
// ============================================

import { useState, useEffect } from 'react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useWallet } from '@/features/wallet/hooks/useWallet';

interface HeaderProps {
  title?: string;
  onMenuClick: () => void;
  isSidebarCollapsed: boolean;
}

export function Header({
  title = 'Dashboard',
  onMenuClick,
  isSidebarCollapsed,
}: HeaderProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const { isConnected } = useWallet();

  // Track viewport width at runtime to bypass CSS stylesheet caching
  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header
      id="app-header"
      className="fixed top-0 right-0 z-30 h-16 flex items-center justify-between gap-4 px-6 bg-[#060919]/90 backdrop-blur-xl border-b border-[#141b3a] transition-all duration-300"
      style={{
        left: isDesktop ? (isSidebarCollapsed ? '72px' : '256px') : '0px'
      }}
    >
      {/* Left: Menu + Title Group */}
      <div className="flex items-center gap-4">
        <button
          id="header-menu-button"
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-white/50 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="flex flex-col">
          <span className="text-[9px] font-black text-white/30 tracking-widest uppercase -mb-0.5">
            Overview
          </span>
          <h1 className="text-xl font-extrabold text-white tracking-wide">{title}</h1>
        </div>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2.5 rounded-lg border border-[#141b3a] bg-[#090d23] px-3.5 py-2 w-64 focus-within:border-blue-500/40 transition-all">
          <Search className="h-4 w-4 text-white/30" />
          <input
            id="header-search"
            type="text"
            placeholder="Search assets, licenses..."
            className="flex-1 bg-transparent text-xs text-white placeholder:text-white/30 outline-none"
          />
        </div>

        {/* Notifications Bell */}
        <button
          id="header-notifications"
          className="relative rounded-lg p-2 text-white/40 hover:bg-white/5 hover:text-white transition-colors"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-rose-500 text-[9px] font-black text-white flex items-center justify-center border border-[#060919]">
            2
          </span>
        </button>

        {/* Network Indicator Selector */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#090d23] border border-[#141b3a] text-xs font-semibold text-white/80 cursor-pointer hover:bg-[#0c1333] transition-all">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Testnet</span>
          <ChevronDown className="w-3.5 h-3.5 text-white/30 ml-1" />
        </div>

        {/* Divider */}
        <div className="h-5 w-px bg-[#141b3a]" />

        {/* User Avatar Initials */}
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 border border-blue-400/30 text-xs font-extrabold text-white">
          SS
        </div>
      </div>
    </header>
  );
}
