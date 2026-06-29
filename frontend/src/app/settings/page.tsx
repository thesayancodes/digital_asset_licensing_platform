'use client';

import { AppShell } from '@/components/layout/AppShell';
import { useWalletStore } from '@/features/wallet/store/wallet.store';
import { Wallet, Globe, FileCode, Palette, ExternalLink, Info } from 'lucide-react';
import {
  STELLAR_NETWORK,
  SOROBAN_RPC_URL,
  ASSET_REGISTRY_CONTRACT_ID,
  LICENSE_MANAGER_CONTRACT_ID,
  EXPLORER_URL,
} from '@/lib/constants';
import { formatAddress } from '@/lib/utils';

export default function SettingsPage() {
  const address = useWalletStore((s) => s.address);
  const network = useWalletStore((s) => s.network);
  const disconnect = useWalletStore((s) => s.disconnect);

  return (
    <AppShell>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-white/40 text-sm mt-1">Manage your wallet, network, and preferences</p>
        </div>

        {/* Wallet */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400">
              <Wallet className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-lg">Wallet</h2>
          </div>

          {address ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
                <div>
                  <p className="text-white/40 text-xs">Connected Address</p>
                  <p className="text-white font-mono text-sm mt-0.5">{formatAddress(address)}</p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 text-emerald-400 text-xs font-medium">Connected</span>
              </div>
              <button
                id="disconnect-wallet-btn"
                onClick={() => disconnect()}
                className="text-red-400 text-sm hover:text-red-300 transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <p className="text-white/30 text-sm">No wallet connected. Click &ldquo;Connect Wallet&rdquo; in the header to get started.</p>
          )}
        </div>

        {/* Network */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Globe className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-lg">Network</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
              <span className="text-white/40 text-sm">Active Network</span>
              <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-300 text-xs font-medium uppercase">
                {STELLAR_NETWORK}
              </span>
            </div>
            <div className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
              <span className="text-white/40 text-sm">RPC Endpoint</span>
              <span className="text-white/60 text-xs font-mono">{SOROBAN_RPC_URL}</span>
            </div>
          </div>
        </div>

        {/* Contract Addresses */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <FileCode className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-lg">Contract Addresses</h2>
          </div>

          {[
            { label: 'AssetRegistry', id: ASSET_REGISTRY_CONTRACT_ID },
            { label: 'LicenseManager', id: LICENSE_MANAGER_CONTRACT_ID },
          ].map((contract) => (
            <div key={contract.label} className="flex items-center justify-between bg-white/[0.03] rounded-xl px-4 py-3">
              <div>
                <p className="text-white/40 text-xs">{contract.label}</p>
                <p className="text-white/70 font-mono text-xs mt-0.5">
                  {contract.id ? formatAddress(contract.id) : 'Not deployed'}
                </p>
              </div>
              {contract.id && (
                <a
                  href={`${EXPLORER_URL}/contract/${contract.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          ))}
        </div>

        {/* About */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Info className="w-5 h-5" />
            </div>
            <h2 className="text-white font-semibold text-lg">About Lumina</h2>
          </div>
          <div className="space-y-2 text-sm text-white/50">
            <p>Version 1.0.0</p>
            <p>AI-powered digital asset licensing on the Stellar blockchain.</p>
            <p>Built with Soroban smart contracts, Next.js, and StellarWalletsKit.</p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
