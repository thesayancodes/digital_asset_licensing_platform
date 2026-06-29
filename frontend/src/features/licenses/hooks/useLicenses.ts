'use client';

import { useCallback } from 'react';
import { useTransactionStore } from '@/features/transactions/store/transaction.store';
import { useLicenseStore } from '../store/license.store';
import * as LicenseManager from '../contracts/license-manager';
import { submitTransaction, pollTransactionResult } from '@/lib/stellar/transaction';
import { useWallet } from '@/features/wallet/hooks/useWallet';
import { LICENSE_MANAGER_CONTRACT_ID } from '@/lib/constants';
import type { LicenseType } from '../contracts/license-manager';

export function useLicenses() {
  const licenses = useLicenseStore((s) => s.licenses);
  const templates = useLicenseStore((s) => s.templates);
  const isLoading = useLicenseStore((s) => s.isLoading);
  const { address, signTransaction } = useWallet();
  const addTx = useTransactionStore((s) => s.addTransaction);
  const updateStatus = useTransactionStore((s) => s.updateStatus);
  const setHash = useTransactionStore((s) => s.setHash);
  const setError = useTransactionStore((s) => s.setError);

  const purchaseLicense = useCallback(
    async (assetId: number, licenseType: LicenseType) => {
      if (!address) throw new Error('Wallet not connected');

      const txId = `tx_purchase_${Date.now()}`;
      addTx(txId, LICENSE_MANAGER_CONTRACT_ID, 'purchase_license', `Purchase ${licenseType} license`);

      try {
        updateStatus(txId, 'simulating');
        const tx = await LicenseManager.purchaseLicense(address, address, assetId, licenseType);

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

  const createTemplate = useCallback(
    async (data: {
      assetId: number;
      licenseType: LicenseType;
      price: bigint;
      maxUses: number;
      durationDays: number;
    }) => {
      if (!address) throw new Error('Wallet not connected');

      const txId = `tx_template_${Date.now()}`;
      addTx(txId, LICENSE_MANAGER_CONTRACT_ID, 'create_license_template', `Create ${data.licenseType} template`);

      try {
        updateStatus(txId, 'simulating');
        const tx = await LicenseManager.createLicenseTemplate(
          address, address, data.assetId, data.licenseType, data.price, data.maxUses, data.durationDays
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

  return {
    licenses: Object.values(licenses),
    templates: Object.values(templates),
    isLoading,
    purchaseLicense,
    createTemplate,
  };
}
