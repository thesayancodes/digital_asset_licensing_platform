'use client';

import type { Asset } from '../contracts/asset-registry';
import { AssetCard } from './AssetCard';

interface AssetGridProps {
  assets: Asset[];
  onAssetClick?: (asset: Asset) => void;
  emptyMessage?: string;
}

export function AssetGrid({ assets, onAssetClick, emptyMessage = 'No assets found' }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-white/30">
        <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center mb-4">
          <span className="text-2xl">📦</span>
        </div>
        <p className="text-sm">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onClick={() => onAssetClick?.(asset)}
        />
      ))}
    </div>
  );
}
