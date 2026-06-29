'use client';

// ============================================
// useWallet Hook — Wallet Store + Service
// ============================================

import { useCallback } from 'react';
import { useWalletStore } from '../store/wallet.store';
import { WalletService } from '../services/wallet.service';

export function useWallet() {
  const {
    address,
    isConnected,
    isConnecting,
    error,
    network,
    walletType,
    setConnecting,
    setError,
    connect: storeConnect,
    disconnect: storeDisconnect,
    setNetwork,
    clearError,
  } = useWalletStore();

  /**
   * Connect wallet — opens wallet modal, stores address on success.
   */
  const connectWallet = useCallback(async () => {
    try {
      setConnecting(true);
      const { address, walletType } = await WalletService.connect();
      storeConnect(address, walletType);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect wallet';
      setError(message);
      throw err;
    }
  }, [setConnecting, storeConnect, setError]);

  /**
   * Disconnect wallet — clears local state.
   */
  const disconnectWallet = useCallback(() => {
    WalletService.disconnect();
    storeDisconnect();
  }, [storeDisconnect]);

  /**
   * Sign a transaction XDR with the connected wallet.
   */
  const signTransaction = useCallback(
    async (xdr: string): Promise<string> => {
      if (!address) {
        throw new Error('No wallet connected');
      }
      return WalletService.signTransaction(xdr, address);
    },
    [address]
  );

  /**
   * Switch network.
   */
  const switchNetwork = useCallback(
    (newNetwork: 'testnet' | 'mainnet') => {
      setNetwork(newNetwork);
      // Re-connect would be needed for real network switch
    },
    [setNetwork]
  );

  return {
    // State
    address,
    isConnected,
    isConnecting,
    error,
    network,
    walletType,

    // Actions
    connectWallet,
    disconnectWallet,
    signTransaction,
    switchNetwork,
    clearError,
  };
}
