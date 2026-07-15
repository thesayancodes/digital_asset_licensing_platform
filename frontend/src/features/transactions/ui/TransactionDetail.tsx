'use client';

import { CheckCircle, XCircle, Loader2, ExternalLink, Copy } from 'lucide-react';
import type { TrackedTransaction } from '@/features/transactions/store/transaction.store';
import { EXPLORER_URL } from '@/lib/constants';

const STAGES = ['building', 'simulating', 'signing', 'submitting', 'pending', 'confirmed'] as const;

interface TransactionDetailProps {
  tx: TrackedTransaction;
  onClose?: () => void;
}

export function TransactionDetail({ tx, onClose }: TransactionDetailProps) {
  const currentIndex = STAGES.indexOf(tx.status as (typeof STAGES)[number]);

  const copyHash = () => {
    if (tx.hash) navigator.clipboard.writeText(tx.hash);
  };

  return (
    <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">{tx.contractMethod}</h3>
          <p className="text-white/40 text-sm mt-1">{tx.description || 'Transaction Details'}</p>
        </div>
        {tx.status === 'confirmed' && <CheckCircle className="w-6 h-6 text-emerald-400" />}
        {tx.status === 'failed' && <XCircle className="w-6 h-6 text-red-400" />}
        {!['confirmed', 'failed'].includes(tx.status) && <Loader2 className="w-6 h-6 text-violet-400 animate-spin" />}
      </div>

      {/* Status Timeline */}
      <div className="space-y-1">
        <div className="flex items-center justify-between mb-3">
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider">Progress</p>
          <span className="text-[9px] px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 font-bold uppercase tracking-wider">
            Current: {tx.status}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {STAGES.map((stage, i) => (
            <div key={stage} className="flex-1 flex flex-col items-center gap-1.5">
              <div className={`w-full h-1.5 rounded-full transition-all ${
                tx.status === 'failed' && i === currentIndex
                  ? 'bg-red-500'
                  : i <= currentIndex
                  ? 'bg-gradient-to-r from-violet-500 to-cyan-500'
                  : 'bg-white/[0.08]'
              }`} />
              <span className={`text-[9px] hidden sm:inline ${i <= currentIndex ? 'text-white/60' : 'text-white/20'}`}>
                {stage}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Hash */}
      {tx.hash && (
        <div>
          <p className="text-white/50 text-xs font-medium uppercase tracking-wider mb-2">Transaction Hash</p>
          <div className="flex items-center gap-2 bg-white/[0.04] rounded-xl px-4 py-3">
            <span className="text-white/70 font-mono text-xs flex-1 truncate">{tx.hash}</span>
            <button onClick={copyHash} className="text-white/30 hover:text-white transition-colors">
              <Copy className="w-4 h-4" />
            </button>
            <a href={`${EXPLORER_URL}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      {/* Error */}
      {tx.error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          <p className="text-red-300 text-sm">{tx.error}</p>
        </div>
      )}

      {/* Metadata */}
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-white/40 text-xs">Contract</span>
          <p className="text-white/70 font-mono text-xs truncate mt-1">{tx.contractId}</p>
        </div>
        <div>
          <span className="text-white/40 text-xs">Created</span>
          <p className="text-white/70 text-xs mt-1">{new Date(tx.timestamp).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
