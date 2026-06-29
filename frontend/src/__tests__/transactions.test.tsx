import { describe, it, expect, vi, beforeEach } from 'vitest';

// Transaction types matching the transaction store
type TxStatus = 'building' | 'simulating' | 'signing' | 'submitting' | 'pending' | 'confirmed' | 'failed';

interface TrackedTransaction {
  id: string;
  status: TxStatus;
  hash: string | null;
  error: string | null;
  contractMethod: string;
  contractId: string;
  createdAt: Date;
  updatedAt: Date;
  explorerUrl: string | null;
}

// Transaction store logic (mirrors transaction.store.ts)
function createTransactionStore() {
  const transactions = new Map<string, TrackedTransaction>();

  return {
    transactions,

    addTransaction(tx: Omit<TrackedTransaction, 'id' | 'createdAt' | 'updatedAt'>): string {
      const id = `tx_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const now = new Date();
      transactions.set(id, {
        ...tx,
        id,
        createdAt: now,
        updatedAt: now,
      });
      return id;
    },

    updateStatus(id: string, status: TxStatus, hash?: string, error?: string): boolean {
      const tx = transactions.get(id);
      if (!tx) return false;

      tx.status = status;
      tx.updatedAt = new Date();
      if (hash) {
        tx.hash = hash;
        tx.explorerUrl = `https://stellar.expert/explorer/testnet/tx/${hash}`;
      }
      if (error) tx.error = error;
      return true;
    },

    getTransaction(id: string): TrackedTransaction | undefined {
      return transactions.get(id);
    },

    getByStatus(status: TxStatus): TrackedTransaction[] {
      return Array.from(transactions.values()).filter(tx => tx.status === status);
    },

    getCounts() {
      const counts = { total: 0, building: 0, simulating: 0, signing: 0, submitting: 0, pending: 0, confirmed: 0, failed: 0 };
      for (const tx of transactions.values()) {
        counts.total++;
        counts[tx.status]++;
      }
      return counts;
    },
  };
}

// Helper to get status display info
function getStatusDisplay(status: TxStatus): { label: string; color: string; icon: string } {
  const statusMap: Record<TxStatus, { label: string; color: string; icon: string }> = {
    building: { label: 'Building', color: 'blue', icon: '🔨' },
    simulating: { label: 'Simulating', color: 'blue', icon: '⚡' },
    signing: { label: 'Awaiting Signature', color: 'yellow', icon: '✍️' },
    submitting: { label: 'Submitting', color: 'yellow', icon: '📤' },
    pending: { label: 'Pending', color: 'yellow', icon: '⏳' },
    confirmed: { label: 'Confirmed', color: 'green', icon: '✅' },
    failed: { label: 'Failed', color: 'red', icon: '❌' },
  };
  return statusMap[status];
}

describe('Transaction Store', () => {
  let store: ReturnType<typeof createTransactionStore>;

  beforeEach(() => {
    store = createTransactionStore();
  });

  it('should add a transaction and return its ID', () => {
    const txId = store.addTransaction({
      status: 'building',
      hash: null,
      error: null,
      contractMethod: 'register_asset',
      contractId: 'CABCDEF123456',
      explorerUrl: null,
    });

    expect(txId).toBeTruthy();
    expect(txId.startsWith('tx_')).toBe(true);

    const tx = store.getTransaction(txId);
    expect(tx).toBeDefined();
    expect(tx!.status).toBe('building');
    expect(tx!.contractMethod).toBe('register_asset');
  });

  it('should track full transaction lifecycle', () => {
    const txId = store.addTransaction({
      status: 'building',
      hash: null,
      error: null,
      contractMethod: 'purchase_license',
      contractId: 'CXYZ789',
      explorerUrl: null,
    });

    // Building → Simulating
    store.updateStatus(txId, 'simulating');
    expect(store.getTransaction(txId)!.status).toBe('simulating');

    // Simulating → Signing
    store.updateStatus(txId, 'signing');
    expect(store.getTransaction(txId)!.status).toBe('signing');

    // Signing → Submitting
    store.updateStatus(txId, 'submitting');
    expect(store.getTransaction(txId)!.status).toBe('submitting');

    // Submitting → Pending
    store.updateStatus(txId, 'pending', 'abc123def456hash');
    const pending = store.getTransaction(txId)!;
    expect(pending.status).toBe('pending');
    expect(pending.hash).toBe('abc123def456hash');
    expect(pending.explorerUrl).toContain('abc123def456hash');

    // Pending → Confirmed
    store.updateStatus(txId, 'confirmed');
    expect(store.getTransaction(txId)!.status).toBe('confirmed');
  });

  it('should handle failed transactions', () => {
    const txId = store.addTransaction({
      status: 'building',
      hash: null,
      error: null,
      contractMethod: 'register_asset',
      contractId: 'CABCDEF',
      explorerUrl: null,
    });

    store.updateStatus(txId, 'simulating');
    store.updateStatus(txId, 'failed', undefined, 'Simulation failed: insufficient funds');

    const tx = store.getTransaction(txId)!;
    expect(tx.status).toBe('failed');
    expect(tx.error).toBe('Simulation failed: insufficient funds');
    expect(tx.hash).toBeNull();
  });

  it('should filter transactions by status', () => {
    // Add mix of transactions
    store.addTransaction({
      status: 'confirmed', hash: 'hash1', error: null,
      contractMethod: 'register_asset', contractId: 'C1', explorerUrl: null,
    });
    store.addTransaction({
      status: 'confirmed', hash: 'hash2', error: null,
      contractMethod: 'purchase_license', contractId: 'C2', explorerUrl: null,
    });
    store.addTransaction({
      status: 'pending', hash: 'hash3', error: null,
      contractMethod: 'transfer_asset', contractId: 'C1', explorerUrl: null,
    });
    store.addTransaction({
      status: 'failed', hash: null, error: 'timeout',
      contractMethod: 'revoke_license', contractId: 'C2', explorerUrl: null,
    });

    expect(store.getByStatus('confirmed')).toHaveLength(2);
    expect(store.getByStatus('pending')).toHaveLength(1);
    expect(store.getByStatus('failed')).toHaveLength(1);
    expect(store.getByStatus('building')).toHaveLength(0);
  });

  it('should count transactions correctly', () => {
    store.addTransaction({ status: 'confirmed', hash: 'h1', error: null, contractMethod: 'm1', contractId: 'c1', explorerUrl: null });
    store.addTransaction({ status: 'confirmed', hash: 'h2', error: null, contractMethod: 'm2', contractId: 'c1', explorerUrl: null });
    store.addTransaction({ status: 'pending', hash: 'h3', error: null, contractMethod: 'm3', contractId: 'c1', explorerUrl: null });
    store.addTransaction({ status: 'failed', hash: null, error: 'err', contractMethod: 'm4', contractId: 'c1', explorerUrl: null });

    const counts = store.getCounts();
    expect(counts.total).toBe(4);
    expect(counts.confirmed).toBe(2);
    expect(counts.pending).toBe(1);
    expect(counts.failed).toBe(1);
  });

  it('should return false when updating non-existent transaction', () => {
    const result = store.updateStatus('non_existent_id', 'confirmed');
    expect(result).toBe(false);
  });
});

describe('Transaction Status Display', () => {
  it('should map all statuses to display info', () => {
    const statuses: TxStatus[] = ['building', 'simulating', 'signing', 'submitting', 'pending', 'confirmed', 'failed'];

    for (const status of statuses) {
      const display = getStatusDisplay(status);
      expect(display.label).toBeTruthy();
      expect(display.color).toBeTruthy();
      expect(display.icon).toBeTruthy();
    }
  });

  it('should show green for confirmed', () => {
    expect(getStatusDisplay('confirmed').color).toBe('green');
  });

  it('should show red for failed', () => {
    expect(getStatusDisplay('failed').color).toBe('red');
  });

  it('should show yellow for pending states', () => {
    expect(getStatusDisplay('pending').color).toBe('yellow');
    expect(getStatusDisplay('signing').color).toBe('yellow');
    expect(getStatusDisplay('submitting').color).toBe('yellow');
  });
});
