'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { FileText, Plus } from 'lucide-react';
import { useLicenses } from '@/features/licenses/hooks/useLicenses';
import { LicenseGrid } from '@/features/licenses/ui/LicenseGrid';
import { useWalletStore } from '@/features/wallet/store/wallet.store';
import type { License, LicenseTemplate } from '@/features/licenses/contracts/license-manager';

const demoLicenses: License[] = [
  { id: 1, asset_id: 1, license_type: 'Commercial', buyer: 'GAQEBOZ...6ZJN', status: 'Active', purchase_price: 150000000n, purchased_at: Date.now() / 1000 - 86400, expires_at: Date.now() / 1000 + 31536000 },
  { id: 2, asset_id: 3, license_type: 'Personal', buyer: 'GAQEBOZ...6ZJN', status: 'Active', purchase_price: 50000000n, purchased_at: Date.now() / 1000 - 3600 * 3, expires_at: Date.now() / 1000 + 86400 * 90 },
];

const demoTemplates: LicenseTemplate[] = [
  { asset_id: 1, license_type: 'Commercial', price: 150000000n, max_uses: 100, duration_days: 365, active: true },
  { asset_id: 2, license_type: 'Exclusive', price: 1000000000n, max_uses: 1, duration_days: 0, active: true },
  { asset_id: 3, license_type: 'Personal', price: 50000000n, max_uses: 500, duration_days: 90, active: true },
];

export default function LicensesPage() {
  const { licenses: storeLicenses, templates: storeTemplates, isLoading } = useLicenses();
  const address = useWalletStore((s) => s.address);
  const [activeTab, setActiveTab] = useState<'purchased' | 'templates'>('purchased');

  // Combine store licenses with demo licenses so the grid is populated
  const allLicenses = [...storeLicenses, ...demoLicenses.filter(demo => !storeLicenses.some(store => store.id === demo.id))];
  const allTemplates = [...storeTemplates, ...demoTemplates.filter(demo => !storeTemplates.some(store => store.asset_id === demo.asset_id))];

  return (
    <AppShell title="Licenses">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-accent-primary" />
              Licensing Center
            </h1>
            <p className="text-white/40 text-sm mt-1">Acquire and manage usage rights, and define licensing parameters for your assets</p>
          </div>
        </div>

        {/* Tabs switcher */}
        <div className="flex border-b border-white/[0.06] gap-6 text-sm overflow-x-auto whitespace-nowrap scrollbar-none">
          <button
            onClick={() => setActiveTab('purchased')}
            className={`pb-4 font-medium transition-all shrink-0 ${
              activeTab === 'purchased'
                ? 'text-white border-b-2 border-accent-primary'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            My Purchased Licenses ({allLicenses.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`pb-4 font-medium transition-all shrink-0 ${
              activeTab === 'templates'
                ? 'text-white border-b-2 border-accent-primary'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            My License Templates ({allTemplates.length})
          </button>
        </div>

        {/* Content Display */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-white/40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary mr-3" />
              Loading licensing data from Stellar network...
            </div>
          ) : activeTab === 'purchased' ? (
            <LicenseGrid licenses={allLicenses} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allTemplates.map((template, idx) => (
                <div
                  key={idx}
                  className="group bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="badge badge-purple">{template.license_type}</span>
                    <span className="text-xs text-text-muted">Asset #{template.asset_id}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Price</span>
                      <span className="text-white font-medium">{(Number(template.price) / 10000000).toLocaleString()} XLM</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Max Uses</span>
                      <span className="text-white font-medium">{template.max_uses === 0 ? 'Unlimited' : template.max_uses}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/40">Duration</span>
                      <span className="text-white font-medium">{template.duration_days === 0 ? 'Perpetual' : `${template.duration_days} days`}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
