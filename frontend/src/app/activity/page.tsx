'use client';

import { useState, useRef, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { ActivityItem } from '@/components/shared/ActivityItem';
import { useContractEvents } from '@/features/events/hooks/useEvents';
import type { ContractEvent } from '@/features/events/store/event.store';

const FILTERS = ['All', 'Assets', 'Licenses', 'Royalties'] as const;
type Filter = (typeof FILTERS)[number];

// Demo events for display
const demoEvents: ContractEvent[] = [
  { id: '1', type: 'asset_registered', contractId: 'CABC...XYZ', topics: ['asset_registered'], data: {}, ledger: 123456, timestamp: new Date(Date.now() - 120000), pagingToken: '1' },
  { id: '2', type: 'license_purchased', contractId: 'CDEF...UVW', topics: ['license_purchased'], data: {}, ledger: 123457, timestamp: new Date(Date.now() - 300000), pagingToken: '2' },
  { id: '3', type: 'royalty_distributed', contractId: 'CDEF...UVW', topics: ['royalty_distributed'], data: {}, ledger: 123457, timestamp: new Date(Date.now() - 300000), pagingToken: '3' },
  { id: '4', type: 'asset_transferred', contractId: 'CABC...XYZ', topics: ['asset_transferred'], data: {}, ledger: 123458, timestamp: new Date(Date.now() - 600000), pagingToken: '4' },
  { id: '5', type: 'template_created', contractId: 'CDEF...UVW', topics: ['template_created'], data: {}, ledger: 123459, timestamp: new Date(Date.now() - 900000), pagingToken: '5' },
  { id: '6', type: 'license_purchased', contractId: 'CDEF...UVW', topics: ['license_purchased'], data: {}, ledger: 123460, timestamp: new Date(Date.now() - 1800000), pagingToken: '6' },
  { id: '7', type: 'asset_registered', contractId: 'CABC...XYZ', topics: ['asset_registered'], data: {}, ledger: 123461, timestamp: new Date(Date.now() - 3600000), pagingToken: '7' },
  { id: '8', type: 'royalty_distributed', contractId: 'CDEF...UVW', topics: ['royalty_distributed'], data: {}, ledger: 123462, timestamp: new Date(Date.now() - 7200000), pagingToken: '8' },
];

const filterMap: Record<Filter, string[]> = {
  All: [],
  Assets: ['asset_registered', 'asset_transferred', 'asset_status_changed'],
  Licenses: ['license_purchased', 'template_created', 'license_revoked'],
  Royalties: ['royalty_distributed'],
};

export default function ActivityPage() {
  const [filter, setFilter] = useState<Filter>('All');
  const { events: liveEvents, isPolling } = useContractEvents();
  const scrollRef = useRef<HTMLDivElement>(null);

  // Combine live + demo events
  const allEvents = [...liveEvents, ...demoEvents];
  const filteredEvents = filter === 'All'
    ? allEvents
    : allEvents.filter((e) => filterMap[filter].includes(e.type?.replace(/['"]/g, '') || ''));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Activity Feed</h1>
            <p className="text-white/40 text-sm mt-1">Real-time contract events</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPolling ? 'bg-emerald-400 animate-pulse' : 'bg-white/20'}`} />
            <span className="text-white/40 text-xs">{isPolling ? 'Live' : 'Paused'}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
                filter === f
                  ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                  : 'bg-white/[0.03] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Event List */}
        <div ref={scrollRef} className="space-y-2">
          {filteredEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-white/30">
              <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4">
                <span className="text-2xl">📡</span>
              </div>
              <p className="text-sm">No activity yet</p>
              <p className="text-xs text-white/20 mt-1">Events will appear here in real-time</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <ActivityItem key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
