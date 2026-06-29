'use client';

import { useCallback } from 'react';
import { useTransactionStore } from '@/features/transactions/store/transaction.store';
import { useAssetStore } from '../store/asset.store';
import * as AssetRegistry from '../contracts/asset-registry';
import { submitTransaction, pollTransactionResult } from '@/lib/stellar/transaction';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import type { AssetType } from '../contracts/asset-registry';

export function useAssets() {
  const assets = useAssetStore((s) => s.assets);
  const isLoading = useAssetStore((s) => s.isLoading);
  const { address, signTransaction } = useWallet();
  const addTx = useTransactionStore((s) => s.addTransaction);
  const updateStatus = useTransactionStore((s) => s.updateStatus);
  const setHash = useTransactionStore((s) => s.setHash);
  const setError = useTransactionStore((s) => s.setError);

  const registerAsset = useCallback(
    async (data: {
      name: string;
      contentHash: string;
      assetType: AssetType;
      royaltyBps: number;
    }) => {
      if (!address) throw new Error('Wallet not connected');

      const txId = `tx_register_${Date.now()}`;
      addTx(txId, AssetRegistry.getContractId(), 'register_asset', `Register: ${data.name}`);

      try {
        updateStatus(txId, 'simulating');
        const tx = await AssetRegistry.registerAsset(
          address, address, data.name, data.contentHash, data.assetType, data.royaltyBps
        );

        updateStatus(txId, 'signing');
        const signedXdr = await signTransaction(tx.toXDR());

        updateStatus(txId, 'submitting');
        const result = await submitTransaction(signedXdr);
        setHash(txId, result.hash);

        updateStatus(txId, 'pending');
        const final = await pollTransactionResult(result.hash);

        updateStatus(txId, final.status === 'SUCCESS' ? 'confirmed' : 'failed');
        return final;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Transaction failed';
        setError(txId, msg);
        throw err;
      }
    },
    [address, signTransaction, addTx, updateStatus, setHash, setError]
  );

  return { assets: Object.values(assets), isLoading, registerAsset };
}
