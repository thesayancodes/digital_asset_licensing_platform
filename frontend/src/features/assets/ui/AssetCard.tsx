'use client';

import { Image, Film, Music, FileText, Box, Code, File, MoreVertical } from 'lucide-react';
import type { Asset, AssetType } from '../contracts/asset-registry';
import { formatAddress } from '@/lib/utils';

const typeIcons: Record<AssetType, React.ReactNode> = {
  Image: <Image className="w-5 h-5" />,
  Video: <Film className="w-5 h-5" />,
  Audio: <Music className="w-5 h-5" />,
  Document: <FileText className="w-5 h-5" />,
  Model3D: <Box className="w-5 h-5" />,
  Code: <Code className="w-5 h-5" />,
  Other: <File className="w-5 h-5" />,
};

const typeColors: Record<AssetType, string> = {
  Image: 'from-pink-500 to-rose-500',
  Video: 'from-violet-500 to-purple-500',
  Audio: 'from-cyan-500 to-blue-500',
  Document: 'from-amber-500 to-orange-500',
  Model3D: 'from-emerald-500 to-green-500',
  Code: 'from-slate-400 to-zinc-500',
  Other: 'from-gray-400 to-gray-500',
};

interface AssetCardProps {
  asset: Asset;
  onClick?: () => void;
}

export function AssetCard({ asset, onClick }: AssetCardProps) {
  return (
    <div
      id={`asset-card-${asset.id}`}
      onClick={onClick}
      className="group relative bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 
        hover:bg-white/[0.06] hover:border-white/[0.15] hover:scale-[1.02]
        transition-all duration-300 cursor-pointer backdrop-blur-sm
        hover:shadow-lg hover:shadow-violet-500/10"
    >
      {/* Type Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${typeColors[asset.asset_type]} text-white text-xs font-medium mb-4`}>
        {typeIcons[asset.asset_type]}
        <span>{asset.asset_type}</span>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-violet-300 transition-colors">
        {asset.name}
      </h3>

      {/* Content Hash */}
      <p className="text-white/40 text-xs font-mono mb-4 truncate">
        {asset.content_hash}
      </p>

      {/* Meta Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${asset.status === 'Active' ? 'bg-emerald-400 shadow-sm shadow-emerald-400/50' : asset.status === 'Suspended' ? 'bg-red-400' : 'bg-gray-400'}`} />
          <span className="text-white/50 text-xs">{asset.status}</span>
        </div>

        <span className="text-white/50 text-xs">
          Owner: {formatAddress(asset.owner)}
        </span>
      </div>

      {/* Royalty Badge */}
      <div className="absolute top-4 right-4 bg-white/[0.08] rounded-lg px-2 py-1">
        <span className="text-violet-300 text-xs font-medium">
          {(asset.royalty_bps / 100).toFixed(1)}% royalty
        </span>
      </div>
    </div>
  );
}
