import { create } from 'zustand';

// ============================================
// Transaction Store — Track active transactions
// ============================================

export type TransactionStatus =
  | 'building'
  | 'simulating'
  | 'signing'
  | 'submitting'
  | 'pending'
  | 'confirmed'
  | 'failed';

export interface TrackedTransaction {
  id: string;
  status: TransactionStatus;
  hash: string | null;
  error: string | null;
  timestamp: number;
  contractMethod: string;
  contractId: string;
  description?: string;
}

interface TransactionState {
  transactions: Map<string, TrackedTransaction>;
  /** Get all transactions as array, newest first */
  getTransactions: () => TrackedTransaction[];
  /** Get a specific transaction */
  getTransaction: (id: string) => TrackedTransaction | undefined;
}

interface TransactionActions {
  /** Add a new transaction */
  addTransaction: (
    id: string,
    contractId: string,
    contractMethod: string,
    description?: string
  ) => void;
  /** Update transaction status */
  updateStatus: (id: string, status: TransactionStatus) => void;
  /** Set transaction hash */
  setHash: (id: string, hash: string) => void;
  /** Set transaction error */
  setError: (id: string, error: string) => void;
  /** Remove a transaction */
  removeTransaction: (id: string) => void;
  /** Clear all completed/failed transactions */
  clearCompleted: () => void;
}

export const useTransactionStore = create<
  TransactionState & TransactionActions
>((set, get) => ({
  transactions: new Map(),

  getTransactions: () => {
    const txs = Array.from(get().transactions.values());
    return txs.sort((a, b) => b.timestamp - a.timestamp);
  },

  getTransaction: (id) => {
    return get().transactions.get(id);
  },

  addTransaction: (id, contractId, contractMethod, description) =>
    set((state) => {
      const newMap = new Map(state.transactions);
      newMap.set(id, {
        id,
        status: 'building',
        hash: null,
        error: null,
        timestamp: Date.now(),
        contractId,
        contractMethod,
        description,
      });
      return { transactions: newMap };
    }),

  updateStatus: (id, status) =>
    set((state) => {
      const newMap = new Map(state.transactions);
      const tx = newMap.get(id);
      if (tx) {
        newMap.set(id, { ...tx, status });
      }
      return { transactions: newMap };
    }),

  setHash: (id, hash) =>
    set((state) => {
      const newMap = new Map(state.transactions);
      const tx = newMap.get(id);
      if (tx) {
        newMap.set(id, { ...tx, hash });
      }
      return { transactions: newMap };
    }),

  setError: (id, error) =>
    set((state) => {
      const newMap = new Map(state.transactions);
      const tx = newMap.get(id);
      if (tx) {
        newMap.set(id, { ...tx, error, status: 'failed' });
      }
      return { transactions: newMap };
    }),

  removeTransaction: (id) =>
    set((state) => {
      const newMap = new Map(state.transactions);
      newMap.delete(id);
      return { transactions: newMap };
    }),

  clearCompleted: () =>
    set((state) => {
      const newMap = new Map(state.transactions);
      for (const [id, tx] of newMap) {
        if (tx.status === 'confirmed' || tx.status === 'failed') {
          newMap.delete(id);
        }
      }
      return { transactions: newMap };
    }),
}));
