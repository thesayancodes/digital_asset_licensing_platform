'use client';

import { CheckCircle, XCircle, Loader2, Clock, ExternalLink, RotateCw } from 'lucide-react';
import type { TrackedTransaction } from '@/features/transactions/store/transaction.store';
import { formatAddress } from '@/lib/utils';
import { EXPLORER_URL } from '@/lib/constants';

interface TransactionRowProps {
  tx: TrackedTransaction;
  onClick?: () => void;
}

const statusConfig: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  building: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  simulating: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'text-blue-400', bg: 'bg-blue-400/10' },
  signing: { icon: <Clock className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  submitting: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  pending: { icon: <Loader2 className="w-4 h-4 animate-spin" />, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  confirmed: { icon: <CheckCircle className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  failed: { icon: <XCircle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-400/10' },
};

function getTimeAgo(ts: number): string {
  const seconds = Math.floor((Date.now() - ts) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function TransactionRow({ tx, onClick }: TransactionRowProps) {
  const config = statusConfig[tx.status] || statusConfig.pending;

  return (
    <div
      id={`tx-row-${tx.id}`}
      onClick={onClick}
      className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl
        hover:bg-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer group"
    >
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center ${config.color}`}>
        {config.icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm">{tx.contractMethod}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${config.bg} ${config.color}`}>
            {tx.status.toUpperCase()}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          {tx.hash && <span className="text-white/40 text-xs font-mono">{formatAddress(tx.hash)}</span>}
          <span className="text-white/30 text-xs">{getTimeAgo(tx.timestamp)}</span>
        </div>
        {tx.error && <p className="text-red-400/70 text-xs mt-1 truncate">{tx.error}</p>}
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {tx.hash && (
          <a href={`${EXPLORER_URL}/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="p-2 rounded-lg hover:bg-white/[0.08] text-white/40 hover:text-white transition-all">
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        {tx.status === 'failed' && (
          <button className="p-2 rounded-lg hover:bg-white/[0.08] text-white/40 hover:text-white transition-all"
            onClick={(e) => e.stopPropagation()}>
            <RotateCw className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
