import { create } from 'zustand';
import { SOROBAN_RPC_URL, ASSET_REGISTRY_CONTRACT_ID, LICENSE_MANAGER_CONTRACT_ID } from '@/lib/constants';

export interface ContractEvent {
  id: string;
  type: string;
  contractId: string;
  topics: string[];
  data: unknown;
  ledger: number;
  timestamp: Date;
  pagingToken: string;
}

interface EventStore {
  events: ContractEvent[];
  isPolling: boolean;
  lastUpdated: Date | null;
  filter: {
    contractId: string | null;
    eventType: string | null;
  };

  addEvents: (events: ContractEvent[]) => void;
  setPolling: (polling: boolean) => void;
  setFilter: (filter: Partial<EventStore['filter']>) => void;
  clearEvents: () => void;
}

const MAX_EVENTS = 500;

export const useEventStore = create<EventStore>((set, get) => ({
  events: [],
  isPolling: false,
  lastUpdated: null,
  filter: { contractId: null, eventType: null },

  addEvents: (newEvents) =>
    set((state) => {
      const existingIds = new Set(state.events.map((e) => e.id));
      const unique = newEvents.filter((e) => !existingIds.has(e.id));
      const combined = [...unique, ...state.events].slice(0, MAX_EVENTS);
      return { events: combined, lastUpdated: new Date() };
    }),

  setPolling: (isPolling) => set({ isPolling }),

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  clearEvents: () => set({ events: [], lastUpdated: null }),
}));

// ── Event Service ──
let pollingInterval: ReturnType<typeof setInterval> | null = null;
let currentCursor: string | null = null;

export async function fetchEvents(): Promise<ContractEvent[]> {
  try {
    const contractIds = [
      ASSET_REGISTRY_CONTRACT_ID,
      LICENSE_MANAGER_CONTRACT_ID,
    ].filter(Boolean);

    if (contractIds.length === 0) return [];

    const body: Record<string, unknown> = {
      jsonrpc: '2.0',
      id: 1,
      method: 'getEvents',
      params: {
        filters: [
          {
            type: 'contract',
            contractIds,
          },
        ],
        pagination: { limit: 50 },
      },
    };

    if (currentCursor) {
      (body.params as Record<string, unknown>).pagination = {
        cursor: currentCursor,
        limit: 50,
      };
    } else {
      (body.params as Record<string, unknown>).startLedger = 0;
    }

    const response = await fetch(SOROBAN_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const json = await response.json();
    const rawEvents = json?.result?.events || [];

    const events: ContractEvent[] = rawEvents.map((e: Record<string, unknown>) => ({
      id: String(e.id || `${e.ledger}-${Math.random()}`),
      type: Array.isArray(e.topic) ? String(e.topic[0] || 'unknown') : 'unknown',
      contractId: String(e.contractId || ''),
      topics: Array.isArray(e.topic) ? e.topic.map(String) : [],
      data: e.value,
      ledger: Number(e.ledger || 0),
      timestamp: new Date(),
      pagingToken: String(e.pagingToken || ''),
    }));

    if (events.length > 0) {
      currentCursor = events[events.length - 1].pagingToken;
    }

    return events;
  } catch (err) {
    console.error('[EventService] Failed to fetch events:', err);
    return [];
  }
}

export function startEventPolling(intervalMs = 5000) {
  if (pollingInterval) return;

  const store = useEventStore.getState();
  store.setPolling(true);

  pollingInterval = setInterval(async () => {
    const events = await fetchEvents();
    if (events.length > 0) {
      useEventStore.getState().addEvents(events);
    }
  }, intervalMs);
}

export function stopEventPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  useEventStore.getState().setPolling(false);
}
