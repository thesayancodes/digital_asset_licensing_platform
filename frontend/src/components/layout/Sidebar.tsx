'use client';

// ============================================
// Sidebar Navigation
// ============================================

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image,
  FileText,
  Activity,
  ArrowLeftRight,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Hexagon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Assets', href: '/assets', icon: Image },
  { label: 'Licenses', href: '/licenses', icon: FileText },
  { label: 'Activity', href: '/activity', icon: Activity },
  { label: 'Transactions', href: '/transactions', icon: ArrowLeftRight },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, badge: 'Soon' },
  { label: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
  onMobileClose?: () => void;
}

export function Sidebar({ isCollapsed, onToggle, onMobileClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      id="app-sidebar"
      className={cn(
        'fixed left-0 top-0 z-40 h-screen',
        'flex flex-col',
        'bg-bg-secondary/80 backdrop-blur-xl',
        'border-r border-border-default',
        'transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[4.5rem]' : 'w-64'
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          'flex items-center h-16 px-4 border-b border-border-default',
          isCollapsed ? 'justify-center' : 'gap-3'
        )}
      >
        <div className="relative flex h-9 w-9 shrink-0 items-center justify-center">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary opacity-20 blur-lg" />
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary">
            <Hexagon className="h-5 w-5 text-white" />
          </div>
        </div>
        {!isCollapsed && (
          <div className="flex flex-col">
            <span className="text-lg font-bold gradient-text">Lumina</span>
            <span className="text-[10px] text-text-muted -mt-1 tracking-wider uppercase">
              Digital Licensing
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href || pathname?.startsWith(item.href + '/');

          return (
            <Link
              id={`nav-${item.label.toLowerCase()}`}
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={cn(
                'group flex items-center gap-3 rounded-xl px-3 py-2.5',
                'text-sm font-medium transition-all duration-200',
                'relative overflow-hidden',
                isActive
                  ? 'text-white'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]',
                isCollapsed && 'justify-center px-2'
              )}
            >
              {/* Active background */}
              {isActive && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent-primary/20 to-accent-secondary/10 border border-accent-primary/20" />
              )}

              {/* Active indicator bar */}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full bg-gradient-to-b from-accent-primary to-accent-secondary" />
              )}

              <item.icon
                className={cn(
                  'relative h-[18px] w-[18px] shrink-0 transition-colors',
                  isActive
                    ? 'text-accent-primary'
                    : 'text-text-muted group-hover:text-text-secondary'
                )}
              />

              {!isCollapsed && (
                <>
                  <span className="relative">{item.label}</span>
                  {item.badge && (
                    <span className="relative ml-auto badge badge-purple text-[10px] py-0">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="p-3 border-t border-border-default">
        <button
          id="sidebar-toggle"
          onClick={onToggle}
          className={cn(
            'flex items-center gap-2 w-full rounded-lg px-3 py-2',
            'text-text-muted hover:text-text-secondary hover:bg-white/[0.04]',
            'transition-colors text-xs',
            isCollapsed && 'justify-center'
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* Pro Badge */}
      {!isCollapsed && (
        <div className="p-3 pt-0">
          <div className="rounded-xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="h-4 w-4 text-accent-primary" />
              <span className="text-xs font-semibold text-text-primary">
                Lumina Pro
              </span>
            </div>
            <p className="text-[11px] text-text-muted leading-relaxed">
              Unlock AI detection & advanced analytics
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
