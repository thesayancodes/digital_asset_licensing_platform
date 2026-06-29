'use client';

import { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Plus, Image as ImageIcon } from 'lucide-react';
import { useAssets } from '@/features/assets/hooks/useAssets';
import { AssetGrid } from '@/features/assets/ui/AssetGrid';
import { RegisterAssetForm } from '@/features/assets/ui/RegisterAssetForm';
import { useWalletStore } from '@/features/wallet/store/wallet.store';
import type { Asset, AssetType } from '@/features/assets/contracts/asset-registry';

const demoAssets: Asset[] = [
  { id: 1, owner: 'GAQEBOZ...6ZJN', name: 'Neon Cityscape Collection', content_hash: 'QmT5NvU...yhCxM', asset_type: 'Image', status: 'Active', royalty_bps: 500, created_at: Date.now() / 1000 },
  { id: 2, owner: 'GAQEBOZ...6ZJN', name: 'Abstract Wave Series', content_hash: 'QmR7BkD...j4H2m', asset_type: 'Image', status: 'Active', royalty_bps: 750, created_at: Date.now() / 1000 },
  { id: 3, owner: 'GAQEBOZ...6ZJN', name: 'Ambient Soundscapes Vol.1', content_hash: 'QmX9CpE...w8K5n', asset_type: 'Audio', status: 'Active', royalty_bps: 1000, created_at: Date.now() / 1000 },
];

export default function AssetsPage() {
  const { assets: storeAssets, registerAsset, isLoading } = useAssets();
  const address = useWalletStore((s) => s.address);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  // Combine store assets with demo assets so the grid is populated
  const allAssets = [...storeAssets, ...demoAssets.filter(demo => !storeAssets.some(store => store.id === demo.id))];

  const handleRegister = async (data: {
    name: string;
    contentHash: string;
    assetType: AssetType;
    royaltyBps: number;
  }) => {
    try {
      await registerAsset(data);
      setShowRegisterForm(false);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <AppShell title="Assets">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-6 h-6 text-accent-primary" />
              Registered Assets
            </h1>
            <p className="text-white/40 text-sm mt-1">Register, view, and manage your digital creative works on-chain</p>
          </div>
          
          <button
            id="register-asset-btn"
            onClick={() => setShowRegisterForm(!showRegisterForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-medium
              px-5 py-2.5 rounded-xl hover:from-violet-500 hover:to-cyan-500 hover:shadow-lg 
              hover:shadow-violet-500/25 transition-all text-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            {showRegisterForm ? 'Close Form' : 'Register New Asset'}
          </button>
        </div>

        {/* Register Form Section */}
        {showRegisterForm && (
          <div className="max-w-2xl">
            <RegisterAssetForm onSubmit={handleRegister} />
          </div>
        )}

        {/* Assets Display Grid */}
        <div className="space-y-4">
          <h2 className="text-white font-semibold text-lg">Your Portfolio</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-20 text-white/40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-primary mr-3" />
              Loading portfolio from Stellar network...
            </div>
          ) : (
            <AssetGrid assets={allAssets} />
          )}
        </div>
      </div>
    </AppShell>
  );
}
