'use client';

import { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import type { LicenseType } from '../contracts/license-manager';

const LICENSE_TYPES: { type: LicenseType; label: string; desc: string; color: string }[] = [
  { type: 'Personal', label: 'Personal', desc: 'Personal, non-commercial use', color: 'from-sky-500 to-blue-500' },
  { type: 'Commercial', label: 'Commercial', desc: 'Use in commercial projects', color: 'from-emerald-500 to-green-500' },
  { type: 'Editorial', label: 'Editorial', desc: 'News and editorial use', color: 'from-amber-500 to-orange-500' },
  { type: 'Enterprise', label: 'Enterprise', desc: 'Unlimited organizational use', color: 'from-violet-500 to-purple-500' },
  { type: 'Exclusive', label: 'Exclusive', desc: 'Sole usage rights', color: 'from-rose-500 to-pink-500' },
];

interface PurchaseLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetName: string;
  assetId: number;
  onPurchase: (licenseType: LicenseType) => Promise<void>;
}

export function PurchaseLicenseModal({
  isOpen, onClose, assetName, assetId, onPurchase,
}: PurchaseLicenseModalProps) {
  const [selected, setSelected] = useState<LicenseType>('Personal');
  const [isPurchasing, setIsPurchasing] = useState(false);

  if (!isOpen) return null;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    try {
      await onPurchase(selected);
      onClose();
    } catch {
      // Error handled by transaction store
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-[#12121f] border border-white/[0.1] rounded-2xl p-6 w-full max-w-lg shadow-2xl shadow-violet-500/10">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors">
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl font-semibold text-white mb-1">Purchase License</h2>
        <p className="text-white/50 text-sm mb-6">for &ldquo;{assetName}&rdquo; (Asset #{assetId})</p>

        <div className="space-y-2 mb-6">
          {LICENSE_TYPES.map(({ type, label, desc, color }) => (
            <button
              key={type}
              onClick={() => setSelected(type)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                selected === type
                  ? 'bg-white/[0.06] border-violet-500/40'
                  : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${color}`} />
              <div className="text-left">
                <div className="text-white font-medium text-sm">{label}</div>
                <div className="text-white/40 text-xs">{desc}</div>
              </div>
            </button>
          ))}
        </div>

        <button
          id="purchase-license-confirm"
          onClick={handlePurchase}
          disabled={isPurchasing}
          className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 text-white font-semibold py-3 
            rounded-xl hover:from-violet-500 hover:to-cyan-500 transition-all
            hover:shadow-lg hover:shadow-violet-500/25 disabled:opacity-50
            flex items-center justify-center gap-2"
        >
          {isPurchasing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Purchase ${selected} License`
          )}
        </button>
      </div>
    </div>
  );
}
