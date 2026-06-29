'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Package, FileCheck, DollarSign, Clock, Plus } from 'lucide-react';
import { RegisterAssetForm } from '@/features/assets/ui/RegisterAssetForm';
import { StatsCard } from '@/features/analytics/ui/StatsCard';
import type { Asset, AssetType } from '@/features/assets/contracts/asset-registry';

// Demo data for the dashboard
const demoAssets: Asset[] = [
  { id: 1, owner: 'GABCDEF...QRST', name: 'Neon Cityscape Collection', content_hash: 'QmT5NvU...yhCxM', asset_type: 'Image', status: 'Active', royalty_bps: 500, created_at: Date.now() / 1000 },
  { id: 2, owner: 'GABCDEF...QRST', name: 'Abstract Wave Series', content_hash: 'QmR7BkD...j4H2m', asset_type: 'Image', status: 'Active', royalty_bps: 750, created_at: Date.now() / 1000 },
  { id: 3, owner: 'GABCDEF...QRST', name: 'Ambient Soundscapes Vol.1', content_hash: 'QmX9CpE...w8K5n', asset_type: 'Audio', status: 'Active', royalty_bps: 1000, created_at: Date.now() / 1000 },
];

const recentActivity = [
  { id: 1, type: 'license_purchased', desc: 'Commercial license purchased for "Neon Cityscape"', time: '2 min ago' },
  { id: 2, type: 'asset_registered', desc: 'New asset "Abstract Wave Series" registered', time: '15 min ago' },
  { id: 3, type: 'royalty_distributed', desc: 'Royalty payment of 50 XLM distributed', time: '1 hour ago' },
  { id: 4, type: 'license_purchased', desc: 'Personal license purchased for "Ambient Soundscapes"', time: '3 hours ago' },
];

const typeColors: Record<string, string> = {
  Image: 'from-pink-500 to-rose-500',
  Audio: 'from-cyan-500 to-blue-500',
  Video: 'from-violet-500 to-purple-500',
};

export default function DashboardPage() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleRegister = async (data: { name: string; contentHash: string; assetType: AssetType; royaltyBps: number }) => {
    // In production, this calls the contract
    console.log('Registering asset:', data);
    await new Promise((r) => setTimeout(r, 2000));
    setShowRegisterForm(false);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-white/40 text-sm mt-1">Welcome back to Lumina</p>
          </div>
          <button
            id="register-asset-btn"
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium
              px-5 py-2.5 rounded-xl hover:from-violet-500 hover:to-cyan-500 hover:shadow-lg 
              hover:shadow-violet-500/25 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            Register Asset
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard label="My Assets" value={12} trend={12.5} icon={<Package className="w-5 h-5" />} />
          <StatsCard label="Active Licenses" value={34} trend={8.3} icon={<FileCheck className="w-5 h-5" />} />
          <StatsCard label="Total Revenue" value="$4,250" trend={23.1} icon={<DollarSign className="w-5 h-5" />} />
          <StatsCard label="Pending Txs" value={2} trend={-5.0} icon={<Clock className="w-5 h-5" />} />
        </div>

        {/* Register Form (collapsible) */}
        {showRegisterForm && (
          <RegisterAssetForm onSubmit={handleRegister} />
        )}

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Assets */}
          <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Recent Assets</h2>
            <div className="space-y-3">
              {demoAssets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer group">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${typeColors[asset.asset_type] || 'from-gray-500 to-gray-600'} flex items-center justify-center text-white text-xs font-bold`}>
                    {asset.asset_type.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/90 text-sm font-medium truncate group-hover:text-violet-300 transition-colors">{asset.name}</p>
                    <p className="text-white/30 text-xs font-mono truncate">{asset.content_hash}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-white/40 text-xs">{(asset.royalty_bps / 100)}% royalty</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-2">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    item.type === 'license_purchased' ? 'bg-violet-400' :
                    item.type === 'asset_registered' ? 'bg-emerald-400' :
                    'bg-cyan-400'
                  }`} />
                  <div>
                    <p className="text-white/70 text-sm">{item.desc}</p>
                    <p className="text-white/30 text-xs mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
