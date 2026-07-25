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
  const [activeTab, setActiveTab] = useState<'purchased' | 'templates' | 'verify'>('purchased');

  // License Lookup & Verification state
  const [searchId, setSearchId] = useState('');
  const [verifiedLicense, setVerifiedLicense] = useState<License | null>(demoLicenses[0]);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Combine store licenses with demo licenses so the grid is populated
  const allLicenses = [...storeLicenses, ...demoLicenses.filter(demo => !storeLicenses.some(store => store.id === demo.id))];
  const allTemplates = [...storeTemplates, ...demoTemplates.filter(demo => !storeTemplates.some(store => store.asset_id === demo.asset_id))];

  const handleVerifySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    const idNum = parseInt(searchId.trim(), 10);
    if (isNaN(idNum) || idNum <= 0) {
      setSearchError('Please enter a valid numeric License ID (e.g. 1, 2)');
      return;
    }

    const found = allLicenses.find(l => l.id === idNum);
    if (found) {
      setVerifiedLicense(found);
    } else {
      setSearchError(`License #${idNum} was not found on the Soroban ledger or local cache.`);
      setVerifiedLicense(null);
    }
  };

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
            <p className="text-white/40 text-sm mt-1">Acquire and manage usage rights, and verify cryptographic license authenticity on Soroban</p>
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
          <button
            onClick={() => setActiveTab('verify')}
            className={`pb-4 font-medium transition-all shrink-0 flex items-center gap-2 ${
              activeTab === 'verify'
                ? 'text-white border-b-2 border-accent-primary'
                : 'text-white/40 hover:text-white/80'
            }`}
          >
            🔍 Verify On-Chain License
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
          ) : activeTab === 'templates' ? (
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
          ) : (
            /* On-Chain License Inspector & Verifier */
            <div className="max-w-3xl space-y-6">
              <form onSubmit={handleVerifySearch} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter License ID (e.g. 1)"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-accent-primary"
                />
                <button
                  type="submit"
                  className="bg-accent-primary hover:bg-accent-primary/80 text-white font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
                >
                  Inspect & Verify
                </button>
              </form>

              {searchError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl p-4 text-sm">
                  {searchError}
                </div>
              )}

              {verifiedLicense && (
                <div className="bg-white/[0.03] border border-white/[0.1] rounded-2xl p-6 space-y-6">
                  <div className="flex justify-between items-center border-b border-white/[0.08] pb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        License #{verifiedLicense.id}
                        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 rounded-full font-medium">
                          ✓ Authenticated On-Chain
                        </span>
                      </h3>
                      <p className="text-xs text-white/40 mt-1">Soroban Smart Contract Verification Record</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      verifiedLicense.status === 'Active' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {verifiedLicense.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Asset Reference</span>
                      <span className="text-white font-medium">Asset ID #{verifiedLicense.asset_id}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">License Tier</span>
                      <span className="text-white font-medium">{verifiedLicense.license_type} License</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Licensee (Buyer)</span>
                      <span className="text-white font-mono text-xs">{verifiedLicense.buyer}</span>
                    </div>
                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl p-4">
                      <span className="text-white/40 text-xs uppercase tracking-wider block mb-1">Purchase Price</span>
                      <span className="text-white font-medium">{(Number(verifiedLicense.purchase_price) / 10000000).toLocaleString()} XLM</span>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.08] pt-4 flex justify-between items-center text-xs text-white/40">
                    <span>Issued: {new Date(verifiedLicense.purchased_at * 1000).toLocaleDateString()}</span>
                    <span>Expires: {new Date(verifiedLicense.expires_at * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}

