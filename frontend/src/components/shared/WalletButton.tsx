'use client';

// ============================================
// Wallet Button — Connect / Account display
// ============================================

import { useState } from 'react';
import { Wallet, ChevronDown, LogOut, Copy, ExternalLink, Check } from 'lucide-react';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { ConnectWalletModal } from '@/features/wallet/ui/ConnectWalletModal';
import { formatAddress } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { getAccountExplorerUrl } from '@/lib/stellar/networks';

export function WalletButton() {
  const { address, isConnected, isConnecting, disconnectWallet, network } =
    useWallet();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isConnected || !address) {
    return (
      <>
        <button
          id="wallet-connect-button"
          onClick={() => setIsModalOpen(true)}
          disabled={isConnecting}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2.5',
            'bg-gradient-to-r from-accent-primary to-purple-600',
            'text-sm font-medium text-white',
            'hover:shadow-lg hover:shadow-accent-primary/25',
            'active:scale-[0.97]',
            'transition-all duration-200',
            isConnecting && 'opacity-70'
          )}
        >
          <Wallet className="h-4 w-4" />
          <span>{isConnecting ? 'Connecting...' : 'Connect Wallet'}</span>
        </button>
        <ConnectWalletModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </>
    );
  }

  return (
    <div className="relative">
      <button
        id="wallet-account-button"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={cn(
          'flex items-center gap-2 rounded-xl px-3 py-2',
          'border border-border-default bg-white/[0.03]',
          'hover:bg-white/[0.06] hover:border-border-hover',
          'transition-all duration-200'
        )}
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary">
          <Wallet className="h-3 w-3 text-white" />
        </div>
        <span className="text-sm font-medium text-text-primary">
          {formatAddress(address, 4)}
        </span>
        <ChevronDown
          className={cn(
            'h-3.5 w-3.5 text-text-muted transition-transform duration-200',
            isDropdownOpen && 'rotate-180'
          )}
        />
      </button>

      {/* Dropdown */}
      {isDropdownOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsDropdownOpen(false)}
          />
          <div
            id="wallet-dropdown"
            className={cn(
              'absolute right-0 top-full mt-2 z-50 w-56',
              'bg-bg-secondary/95 backdrop-blur-xl',
              'border border-border-default rounded-xl',
              'shadow-xl shadow-black/40',
              'animate-scale-in origin-top-right',
              'py-1'
            )}
          >
            {/* Address Display */}
            <div className="px-3 py-2 border-b border-border-default">
              <p className="text-xs text-text-muted mb-1">Connected Address</p>
              <p className="text-xs font-mono text-text-secondary truncate">
                {address}
              </p>
            </div>

            {/* Actions */}
            <button
              id="wallet-copy-address"
              onClick={handleCopy}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:bg-white/[0.04] hover:text-text-primary transition-colors"
            >
              {copied ? (
                <Check className="h-4 w-4 text-accent-success" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              {copied ? 'Copied!' : 'Copy Address'}
            </button>

            <a
              id="wallet-view-explorer"
              href={getAccountExplorerUrl(address, network)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:bg-white/[0.04] hover:text-text-primary transition-colors"
            >
              <ExternalLink className="h-4 w-4" />
              View on Explorer
            </a>

            <div className="border-t border-border-default mt-1 pt-1">
              <button
                id="wallet-disconnect"
                onClick={() => {
                  disconnectWallet();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-accent-error/80 hover:bg-accent-error/5 hover:text-accent-error transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Disconnect
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
