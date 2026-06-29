'use client';

// ============================================
// Connect Wallet Modal
// ============================================

import { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import {
  X,
  Wallet,
  Loader2,
  Shield,
  Globe,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConnectWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WALLET_OPTIONS = [
  {
    id: 'freighter',
    name: 'Freighter',
    description: 'Popular Stellar wallet extension',
    icon: '🌐',
    recommended: true,
  },
];

export function ConnectWalletModal({
  isOpen,
  onClose,
}: ConnectWalletModalProps) {
  const { connectWallet, isConnecting, error, network, clearError } =
    useWallet();
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConnect = async () => {
    try {
      await connectWallet();
      onClose();
    } catch {
      // Error handled by the store
    }
  };

  const handleClose = () => {
    clearError();
    setSelectedWallet(null);
    onClose();
  };

  return (
    <div
      id="connect-wallet-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        id="connect-wallet-modal"
        className={cn(
          'relative w-full max-w-md',
          'bg-bg-secondary/95 backdrop-blur-xl',
          'border border-border-default rounded-2xl',
          'shadow-2xl shadow-black/50',
          'animate-scale-in'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-primary/10">
              <Wallet className="h-5 w-5 text-accent-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">
                Connect Wallet
              </h2>
              <p className="text-xs text-text-muted">
                Choose your Stellar wallet
              </p>
            </div>
          </div>
          <button
            id="connect-wallet-modal-close"
            onClick={handleClose}
            className="rounded-lg p-2 text-text-muted hover:bg-white/5 hover:text-text-primary transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Network Indicator */}
        <div className="mx-6 mb-4 flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
          <Globe className="h-3.5 w-3.5 text-accent-secondary" />
          <span className="text-xs text-text-secondary">
            Network:{' '}
            <span className="font-medium text-accent-secondary capitalize">
              {network}
            </span>
          </span>
          <div
            className={cn(
              'ml-auto h-2 w-2 rounded-full',
              network === 'testnet' ? 'bg-amber-400' : 'bg-accent-success'
            )}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-4 flex items-start gap-2 rounded-lg border border-accent-error/20 bg-accent-error/5 p-3">
            <AlertCircle className="h-4 w-4 shrink-0 text-accent-error mt-0.5" />
            <p className="text-xs text-accent-error/90">{error}</p>
          </div>
        )}

        {/* Wallet Options */}
        <div className="px-6 pb-2 space-y-2">
          {WALLET_OPTIONS.map((wallet) => (
            <button
              id={`wallet-option-${wallet.id}`}
              key={wallet.id}
              onClick={() => {
                setSelectedWallet(wallet.id);
                handleConnect();
              }}
              disabled={isConnecting}
              className={cn(
                'w-full flex items-center gap-4 rounded-xl px-4 py-3.5',
                'border transition-all duration-200',
                'hover:bg-white/[0.04] hover:border-accent-primary/30',
                'active:scale-[0.98]',
                selectedWallet === wallet.id && isConnecting
                  ? 'border-accent-primary/40 bg-accent-primary/5'
                  : 'border-white/[0.06] bg-white/[0.02]',
                isConnecting && selectedWallet !== wallet.id && 'opacity-40'
              )}
            >
              <span className="text-2xl">{wallet.icon}</span>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary text-sm">
                    {wallet.name}
                  </span>
                  {wallet.recommended && (
                    <span className="badge badge-purple text-[10px] py-0">
                      Recommended
                    </span>
                  )}
                </div>
                <span className="text-xs text-text-muted">
                  {wallet.description}
                </span>
              </div>
              {selectedWallet === wallet.id && isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin text-accent-primary" />
              ) : (
                <div className="h-4 w-4" />
              )}
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 pt-4">
          <div className="flex items-center justify-center gap-2 text-xs text-text-muted">
            <Shield className="h-3 w-3" />
            <span>Secured by Stellar blockchain</span>
          </div>
        </div>
      </div>
    </div>
  );
}
