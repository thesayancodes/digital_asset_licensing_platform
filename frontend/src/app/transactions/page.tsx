'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { TransactionRow } from '@/features/transactions/ui/TransactionRow';
import { TransactionDetail } from '@/features/transactions/ui/TransactionDetail';
import { useTransactionStore, type TrackedTransaction } from '@/features/transactions/store/transaction.store';

const TABS = ['All', 'Pending', 'Confirmed', 'Failed'] as const;
type Tab = (typeof TABS)[number];

// Demo transactions
const demoTxs: TrackedTransaction[] = [
  { id: 'tx_1', status: 'confirmed', hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2', error: null, contractMethod: 'register_asset', contractId: 'CABC...XYZ', timestamp: Date.now() - 300000, description: 'Register Neon Cityscape' },
  { id: 'tx_2', status: 'confirmed', hash: 'f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5d4c3b2a1f6e5', error: null, contractMethod: 'purchase_license', contractId: 'CDEF...UVW', timestamp: Date.now() - 600000, description: 'Purchase Commercial license' },
  { id: 'tx_3', status: 'pending', hash: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', error: null, contractMethod: 'create_license_template', contractId: 'CDEF...UVW', timestamp: Date.now() - 60000, description: 'Create Enterprise template' },
  { id: 'tx_4', status: 'failed', hash: null, error: 'Simulation failed: insufficient funds for transaction fee', contractMethod: 'transfer_asset', contractId: 'CABC...XYZ', timestamp: Date.now() - 1200000, description: 'Transfer asset ownership' },
];

export default function TransactionsPage() {
  const [tab, setTab] = useState<Tab>('All');
  const [selectedTx, setSelectedTx] = useState<TrackedTransaction | null>(null);
  const getTransactions = useTransactionStore((s) => s.getTransactions);
  const storeTxs = getTransactions();

  const allTxs = [...storeTxs, ...demoTxs];
  const filtered = tab === 'All'
    ? allTxs
    : allTxs.filter((t) => {
        if (tab === 'Pending') return ['building', 'simulating', 'signing', 'submitting', 'pending'].includes(t.status);
        return t.status === tab.toLowerCase();
      });

  const counts = {
    total: allTxs.length,
    pending: allTxs.filter((t) => ['building', 'simulating', 'signing', 'submitting', 'pending'].includes(t.status)).length,
    confirmed: allTxs.filter((t) => t.status === 'confirmed').length,
    failed: allTxs.filter((t) => t.status === 'failed').length,
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Transaction Center</h1>
          <p className="text-white/40 text-sm mt-1">Track all your blockchain transactions</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: counts.total, color: 'text-white' },
            { label: 'Pending', value: counts.pending, color: 'text-amber-400' },
            { label: 'Confirmed', value: counts.confirmed, color: 'text-emerald-400' },
            { label: 'Failed', value: counts.failed, color: 'text-red-400' },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-white/40 text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none pb-1">
          {TABS.map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all shrink-0 ${
                tab === t
                  ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                  : 'bg-white/[0.03] border border-white/[0.08] text-white/50 hover:text-white hover:bg-white/[0.06]'
              }`}>{t}</button>
          ))}
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className={`space-y-2 ${selectedTx ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-white/30">
                <span className="text-2xl mb-2">📋</span>
                <p className="text-sm">No transactions found</p>
              </div>
            ) : (
              filtered.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} onClick={() => setSelectedTx(tx)} />
              ))
            )}
          </div>
          {selectedTx && (
            <div className="lg:col-span-1">
              <TransactionDetail tx={selectedTx} onClose={() => setSelectedTx(null)} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
