'use client';

// ============================================
// Sidebar Navigation (Matches screenshot style)
// ============================================

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image as ImageIcon,
  FileText,
  Activity,
  ArrowLeftRight,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Star,
} from 'lucide-react';
import { cn, formatAddress } from '@/lib/utils';
import { useWallet } from '@/features/wallet/hooks/useWallet';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeType?: 'blue' | 'green' | 'pulse';
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Assets', href: '/assets', icon: ImageIcon, badge: '12', badgeType: 'blue' },
  { label: 'Licenses', href: '/licenses', icon: FileText, badge: '3', badgeType: 'green' },
  { label: 'Activity Feed', href: '/activity', icon: Activity, badge: 'live', badgeType: 'pulse' },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  const { address, isConnected, connectWallet } = useWallet();

  return (
    <aside
      id="app-sidebar"
      className={cn(
        'fixed left-0 top-0 z-40 h-screen',
        'flex flex-col',
        'bg-[#060919] border-r border-[#141b3a]',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[4.5rem]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-16 px-5 border-b border-[#141b3a]',
          isCollapsed ? 'justify-center' : 'gap-3.5'
        )}
      >
        <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 border border-blue-400/40">
          <Star className="h-4.5 w-4.5 fill-white text-white" />
        </div>
        {!isCollapsed && (
          <span className="text-sm font-black text-white tracking-widest uppercase">
            Lumina
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                'group flex items-center gap-3 rounded-lg px-3 py-2.5',
                'text-[13px] font-bold transition-all duration-200',
                'relative overflow-hidden',
                isActive
                  ? 'text-white bg-blue-600/10 border border-blue-500/25'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.03] border border-transparent',
                isCollapsed && 'justify-center px-2'
              )}
            >
              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-blue-400" />
              )}

              <item.icon
                className={cn(
                  'relative h-[18px] w-[18px] shrink-0 transition-colors',
                  isActive
                    ? 'text-blue-400'
                    : 'text-white/30 group-hover:text-white/60'
                )}
              />

              {!isCollapsed && (
                <>
                  <span className="relative">{item.label}</span>
                  {item.badge && (
                    <div className="relative ml-auto flex items-center justify-center">
                      {item.badgeType === 'blue' && (
                        <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                      {item.badgeType === 'green' && (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-bold">
                          {item.badge}
                        </span>
                      )}
                      {item.badgeType === 'pulse' && (
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse mr-1" />
                      )}
                    </div>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="px-4 py-3 border-t border-[#141b3a]">
        <button
          id="sidebar-toggle"
          onClick={onToggle}
          className={cn(
            'flex items-center gap-2 w-full rounded-lg px-3 py-2',
            'text-white/30 hover:text-white/60 hover:bg-white/[0.03]',
            'transition-colors text-xs font-semibold',
            isCollapsed && 'justify-center'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse Sidebar</span>
            </>
          )}
        </button>
      </div>

      {/* Wallet Info Card (Premium Web3 Look) */}
      {!isCollapsed && (
        <div className="p-4 pt-0">
          <div className="rounded-xl bg-[#090e2b] border border-[#17225c] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-extrabold text-white/40 tracking-widest uppercase">
                Wallet
              </span>
              <span className={cn(
                "w-2 h-2 rounded-full",
                isConnected ? "bg-emerald-400 animate-pulse" : "bg-red-400"
              )} />
            </div>

            {isConnected && address ? (
              <div className="space-y-1.5">
                <p className="text-[12px] font-bold text-white/95 font-mono truncate">
                  {formatAddress(address)}
                </p>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-white">
                    1,204.50 <span className="text-blue-400 text-xs font-bold">XLM</span>
                  </span>
                  <span className="text-[10px] text-white/40 font-semibold mt-0.5">
                    ≈ $142.18 USD
                  </span>
                </div>
              </div>
            ) : (
              <button
                id="sidebar-connect-wallet-btn"
                onClick={() => connectWallet()}
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-[11px] font-bold rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </aside>
  );
}
