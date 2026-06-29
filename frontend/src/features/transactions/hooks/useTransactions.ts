'use client';

import { useTransactionStore, type TrackedTransaction, type TransactionStatus } from '../store/transaction.store';

export type { TrackedTransaction, TransactionStatus };

export function useTransactions() {
  const getTransactions = useTransactionStore((s) => s.getTransactions);
  const transactions = getTransactions();

  const pending = transactions.filter((t) =>
    ['building', 'simulating', 'signing', 'submitting', 'pending'].includes(t.status)
  );
  const confirmed = transactions.filter((t) => t.status === 'confirmed');
  const failed = transactions.filter((t) => t.status === 'failed');

  return {
    transactions,
    pending,
    confirmed,
    failed,
    counts: {
      total: transactions.length,
      pending: pending.length,
      confirmed: confirmed.length,
      failed: failed.length,
    },
  };
}
