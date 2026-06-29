import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============================================
// Wallet Store — Zustand with persistence
// ============================================

export interface WalletState {
  /** Connected wallet address (Stellar public key) */
  address: string | null;
  /** Whether a wallet is connected */
  isConnected: boolean;
  /** Active network */
  network: 'testnet' | 'mainnet';
  /** Whether a connection is in progress */
  isConnecting: boolean;
  /** Last error message */
  error: string | null;
  /** Wallet type identifier */
  walletType: string | null;
}

export interface WalletActions {
  /** Set the connected address */
  setAddress: (address: string | null) => void;
  /** Set connection status */
  setConnecting: (isConnecting: boolean) => void;
  /** Set network */
  setNetwork: (network: 'testnet' | 'mainnet') => void;
  /** Set error */
  setError: (error: string | null) => void;
  /** Set wallet type */
  setWalletType: (walletType: string | null) => void;
  /** Connect with address */
  connect: (address: string, walletType: string) => void;
  /** Disconnect wallet */
  disconnect: () => void;
  /** Clear error */
  clearError: () => void;
}

export type WalletStore = WalletState & WalletActions;

export const useWalletStore = create<WalletStore>()(
  persist(
    (set) => ({
      // State
      address: null,
      isConnected: false,
      network: 'testnet',
      isConnecting: false,
      error: null,
      walletType: null,

      // Actions
      setAddress: (address) =>
        set({ address, isConnected: !!address }),

      setConnecting: (isConnecting) =>
        set({ isConnecting, error: null }),

      setNetwork: (network) =>
        set({ network }),

      setError: (error) =>
        set({ error, isConnecting: false }),

      setWalletType: (walletType) =>
        set({ walletType }),

      connect: (address, walletType) =>
        set({
          address,
          walletType,
          isConnected: true,
          isConnecting: false,
          error: null,
        }),

      disconnect: () =>
        set({
          address: null,
          walletType: null,
          isConnected: false,
          isConnecting: false,
          error: null,
        }),

      clearError: () =>
        set({ error: null }),
    }),
    {
      name: 'lumina-wallet',
      partialize: (state) => ({
        address: state.address,
        network: state.network,
        walletType: state.walletType,
        isConnected: state.isConnected,
      }),
    }
  )
);
