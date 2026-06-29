'use client';

import { useState } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import type { AssetType } from '../contracts/asset-registry';

const ASSET_TYPES: AssetType[] = ['Image', 'Video', 'Audio', 'Document', 'Model3D', 'Code', 'Other'];

interface RegisterAssetFormProps {
  onSubmit: (data: {
    name: string;
    contentHash: string;
    assetType: AssetType;
    royaltyBps: number;
  }) => Promise<void>;
}

export function RegisterAssetForm({ onSubmit }: RegisterAssetFormProps) {
  const [name, setName] = useState('');
  const [contentHash, setContentHash] = useState('');
  const [assetType, setAssetType] = useState<AssetType>('Image');
  const [royaltyPercent, setRoyaltyPercent] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) { setError('Asset name is required'); return; }
    if (!contentHash.trim()) { setError('Content hash is required'); return; }
    if (royaltyPercent < 0 || royaltyPercent > 100) { setError('Royalty must be 0-100%'); return; }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        contentHash: contentHash.trim(),
        assetType,
        royaltyBps: Math.round(royaltyPercent * 100),
      });
      setName('');
      setContentHash('');
      setRoyaltyPercent(5);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      id="register-asset-form"
      onSubmit={handleSubmit}
      className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 backdrop-blur-sm space-y-5"
    >
      <h3 className="text-xl font-semibold text-white">Register New Asset</h3>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Asset Name</label>
        <input
          id="asset-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Digital Sunset Photography"
          maxLength={100}
          className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 text-white placeholder-white/30 
            focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
        />
      </div>

      {/* Content Hash */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Content Hash (IPFS/SHA-256)</label>
        <div className="relative">
          <input
            id="content-hash-input"
            type="text"
            value={contentHash}
            onChange={(e) => setContentHash(e.target.value)}
            placeholder="QmT5NvUtoM5nWFfrQdVrFtvGfKFmG7AHE8P34isapyhCxM"
            className="w-full bg-white/[0.05] border border-white/[0.1] rounded-xl px-4 py-3 pr-12 text-white 
              font-mono text-sm placeholder-white/30 
              focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/25 transition-all"
          />
          <Upload className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        </div>
      </div>

      {/* Asset Type */}
      <div>
        <label className="block text-white/60 text-sm mb-2">Asset Type</label>
        <div className="grid grid-cols-4 gap-2">
          {ASSET_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAssetType(type)}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                assetType === type
                  ? 'bg-violet-500/20 border border-violet-500/40 text-violet-300'
                  : 'bg-white/[0.05] border border-white/[0.08] text-white/50 hover:text-white/80 hover:bg-white/[0.08]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Royalty */}
      <div>
        <label className="block text-white/60 text-sm mb-2">
          Royalty Rate: <span className="text-violet-300 font-medium">{royaltyPercent}%</span>
        </label>
        <input
          id="royalty-slider"
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={royaltyPercent}
          onChange={(e) => setRoyaltyPercent(Number(e.target.value))}
          className="w-full accent-violet-500"
        />
        <div className="flex justify-between text-white/30 text-xs mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Submit */}
      <button
        id="register-asset-submit"
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold py-3 px-6 
          rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all duration-300
          hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed
          flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Registering on Stellar...
          </>
        ) : (
          'Register Asset'
        )}
      </button>
    </form>
  );
}
