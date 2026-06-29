'use client';

import { Shield, FileCheck, DollarSign, AlertCircle, ArrowRightLeft, UserPlus } from 'lucide-react';
import type { ContractEvent } from '@/features/events/store/event.store';
import { formatAddress } from '@/lib/utils';

const eventConfig: Record<string, { icon: React.ReactNode; color: string; borderColor: string }> = {
  asset_registered: { icon: <Shield className="w-4 h-4" />, color: 'text-emerald-400', borderColor: 'border-l-emerald-400' },
  asset_transferred: { icon: <ArrowRightLeft className="w-4 h-4" />, color: 'text-blue-400', borderColor: 'border-l-blue-400' },
  asset_status_changed: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-amber-400', borderColor: 'border-l-amber-400' },
  license_purchased: { icon: <FileCheck className="w-4 h-4" />, color: 'text-violet-400', borderColor: 'border-l-violet-400' },
  template_created: { icon: <UserPlus className="w-4 h-4" />, color: 'text-cyan-400', borderColor: 'border-l-cyan-400' },
  royalty_distributed: { icon: <DollarSign className="w-4 h-4" />, color: 'text-green-400', borderColor: 'border-l-green-400' },
  license_revoked: { icon: <AlertCircle className="w-4 h-4" />, color: 'text-red-400', borderColor: 'border-l-red-400' },
};

const defaultConfig = { icon: <Shield className="w-4 h-4" />, color: 'text-white/50', borderColor: 'border-l-white/20' };

interface ActivityItemProps {
  event: ContractEvent;
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

function getDescription(event: ContractEvent): string {
  const type = event.type?.replace(/['"]/g, '') || 'unknown';
  switch (type) {
    case 'asset_registered': return 'New digital asset registered on-chain';
    case 'asset_transferred': return 'Asset ownership transferred';
    case 'asset_status_changed': return 'Asset status updated';
    case 'license_purchased': return 'License purchased';
    case 'template_created': return 'New license template created';
    case 'royalty_distributed': return 'Royalty payment distributed';
    case 'license_revoked': return 'License revoked';
    default: return `Contract event: ${type}`;
  }
}

export function ActivityItem({ event }: ActivityItemProps) {
  const type = event.type?.replace(/['"]/g, '') || 'unknown';
  const config = eventConfig[type] || defaultConfig;

  return (
    <div
      id={`activity-${event.id}`}
      className={`flex items-start gap-4 p-4 border-l-2 ${config.borderColor} bg-white/[0.02] rounded-r-xl
        hover:bg-white/[0.05] transition-all duration-200`}
    >
      <div className={`flex-shrink-0 w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center ${config.color}`}>
        {config.icon}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-white/80 text-sm">{getDescription(event)}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="text-white/30 text-xs">Ledger #{event.ledger}</span>
          <span className="text-white/20">·</span>
          <span className="text-white/30 text-xs">{getTimeAgo(event.timestamp)}</span>
          <span className="text-white/20">·</span>
          <span className="text-white/30 text-xs font-mono">{formatAddress(event.contractId)}</span>
        </div>
      </div>
    </div>
  );
}
