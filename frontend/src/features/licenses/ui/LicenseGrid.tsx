'use client';

import type { License } from '../contracts/license-manager';
import { LicenseCard } from './LicenseCard';

interface LicenseGridProps {
  licenses: License[];
  onLicenseClick?: (license: License) => void;
  emptyMessage?: string;
}

export function LicenseGrid({ licenses, onLicenseClick, emptyMessage = 'No licenses found' }: LicenseGridProps) {
  if (licenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/30">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4">
          <span className="text-2xl">📜</span>
        </div>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {licenses.map((license) => (
        <LicenseCard key={license.id} license={license} onClick={() => onLicenseClick?.(license)} />
      ))}
    </div>
  );
}
