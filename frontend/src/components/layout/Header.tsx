'use client';

// ============================================
// Header
// ============================================

import { useState, useEffect } from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import { WalletButton } from '@/components/shared/WalletButton';
import { cn } from '@/lib/utils';

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
      className="fixed top-0 right-0 z-30 h-16 flex items-center justify-between gap-4 px-6 bg-bg-primary/80 backdrop-blur-xl border-b border-border-default transition-all duration-300"
      style={{
        left: isDesktop ? (isSidebarCollapsed ? '72px' : '256px') : '0px'
      }}
    >
      {/* Left: Menu + Title */}
      <div className="flex items-center gap-4">
        <button
          id="header-menu-button"
          onClick={onMenuClick}
          className="lg:hidden rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-text-primary transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
      </div>

      {/* Right: Search + Actions */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="hidden md:flex items-center gap-2 rounded-xl border border-border-default bg-white/[0.02] px-3 py-2 w-64">
          <Search className="h-4 w-4 text-text-muted" />
          <input
            id="header-search"
            type="text"
            placeholder="Search assets, licenses..."
            className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
          />
          <kbd className="hidden lg:inline-flex items-center rounded border border-border-default px-1.5 text-[10px] text-text-muted font-mono">
            ⌘K
          </kbd>
        </div>

        {/* Notifications */}
        <button
          id="header-notifications"
          className="relative rounded-xl p-2.5 text-text-muted hover:bg-white/5 hover:text-text-primary transition-colors"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent-primary animate-pulse" />
        </button>

        {/* Divider */}
        <div className="hidden md:block h-6 w-px bg-border-default" />

        {/* Wallet */}
        <WalletButton />
      </div>
    </header>
  );
}
