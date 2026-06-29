'use client';

import { useEffect, useCallback } from 'react';
import {
  useEventStore,
  startEventPolling,
  stopEventPolling,
  type ContractEvent,
} from '../store/event.store';
import { EVENT_POLL_INTERVAL_MS } from '@/lib/constants';

export function useContractEvents() {
  const events = useEventStore((s) => s.events);
  const isPolling = useEventStore((s) => s.isPolling);
  const lastUpdated = useEventStore((s) => s.lastUpdated);

  useEffect(() => {
    startEventPolling(EVENT_POLL_INTERVAL_MS);
    return () => stopEventPolling();
  }, []);

  return { events, isPolling, lastUpdated };
}

export function useFilteredEvents(filter?: {
  contractId?: string;
  eventType?: string;
}) {
  const events = useEventStore((s) => s.events);

  const filtered = events.filter((e) => {
    if (filter?.contractId && e.contractId !== filter.contractId) return false;
    if (filter?.eventType && e.type !== filter.eventType) return false;
    return true;
  });

  return filtered;
}
