'use client';

import { Shield, Clock, DollarSign } from 'lucide-react';
import type { License, LicenseType } from '../contracts/license-manager';
import { formatAddress } from '@/lib/utils';

const typeColors: Record<LicenseType, string> = {
  Personal: 'from-sky-500 to-blue-500',
  Commercial: 'from-emerald-500 to-green-500',
  Editorial: 'from-amber-500 to-orange-500',
  Enterprise: 'from-violet-500 to-purple-500',
  Exclusive: 'from-rose-500 to-pink-500',
};

interface LicenseCardProps {
  license: License;
  onClick?: () => void;
}

export function LicenseCard({ license, onClick }: LicenseCardProps) {
  const isExpired = license.expires_at < Date.now() / 1000;
  const statusColor = license.status === 'Active' && !isExpired
    ? 'bg-emerald-400'
    : license.status === 'Revoked'
    ? 'bg-red-400'
    : 'bg-amber-400';

  return (
    <div
      id={`license-card-${license.id}`}
      onClick={onClick}
      className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5
        hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-[1.02]
        transition-all duration-300 cursor-pointer backdrop-blur-sm"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${typeColors[license.license_type]} text-white text-xs font-medium`}>
          {license.license_type}
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="text-white/50 text-xs">{license.status}</span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Shield className="w-4 h-4 text-violet-400" />
          <span>Asset #{license.asset_id}</span>
        </div>

        <div className="flex items-center gap-2 text-white/60 text-sm">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>{Number(license.purchase_price) / 10000000} XLM</span>
        </div>

        <div className="flex items-center gap-2 text-white/60 text-sm">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>
            {isExpired ? 'Expired' : `Expires ${new Date(license.expires_at * 1000).toLocaleDateString()}`}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] text-white/40 text-xs">
        Buyer: {formatAddress(license.buyer)}
      </div>
    </div>
  );
}
