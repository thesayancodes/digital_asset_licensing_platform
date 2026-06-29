'use client';

// ============================================
// Soroban Transaction Utilities
// ============================================

import {
  TransactionBuilder,
  Networks,
  Operation,
  xdr,
  Address,
  rpc as stellarRpc,
  Contract,
  nativeToScVal,
  scValToNative,
  type Transaction,
} from '@stellar/stellar-sdk';
import { getSorobanServer } from './client';
import {
  NETWORK_PASSPHRASE,
  DEFAULT_TX_TIMEOUT,
  TX_POLL_INTERVAL,
  TX_MAX_RETRIES,
} from '@/lib/constants';
import { sleep } from '@/lib/utils';

export interface TransactionResult {
  hash: string;
  status: 'SUCCESS' | 'FAILED' | 'NOT_FOUND';
  resultXdr?: string;
  returnValue?: unknown;
}

/**
 * Build a Soroban contract invocation transaction.
 */
export async function buildContractTransaction(
  sourcePublicKey: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[] = []
): Promise<Transaction> {
  const server = getSorobanServer();
  const account = await server.getAccount(sourcePublicKey);

  const contract = new Contract(contractId);

  const tx = new TransactionBuilder(account, {
    fee: '100000', // 0.01 XLM — will be adjusted by simulation
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(contract.call(method, ...args))
    .setTimeout(DEFAULT_TX_TIMEOUT)
    .build();

  return tx;
}

/**
 * Simulate a transaction to get the proper footprint and fees.
 */
export async function simulateTransaction(
  tx: Transaction
): Promise<{
  prepared: Transaction;
  minResourceFee: string;
  result?: stellarRpc.Api.SimulateTransactionSuccessResponse;
}> {
  const server = getSorobanServer();
  const simResponse = await server.simulateTransaction(tx);

  if (stellarRpc.Api.isSimulationError(simResponse)) {
    throw new Error(
      `Simulation failed: ${(simResponse as stellarRpc.Api.SimulateTransactionErrorResponse).error}`
    );
  }

  if (stellarRpc.Api.isSimulationRestore(simResponse)) {
    throw new Error(
      'Transaction requires state restoration. Please try again.'
    );
  }

  const successResponse = simResponse as stellarRpc.Api.SimulateTransactionSuccessResponse;
  const prepared = stellarRpc.assembleTransaction(
    tx,
    successResponse
  ).build();

  return {
    prepared,
    minResourceFee: successResponse.minResourceFee,
    result: successResponse,
  };
}

/**
 * Submit a signed transaction XDR to the network.
 */
export async function submitTransaction(
  signedXdr: string
): Promise<stellarRpc.Api.SendTransactionResponse> {
  const server = getSorobanServer();
  const tx = TransactionBuilder.fromXDR(
    signedXdr,
    NETWORK_PASSPHRASE
  );
  const response = await server.sendTransaction(tx);
  return response;
}

/**
 * Poll for transaction result until it's confirmed or fails.
 */
export async function pollTransactionResult(
  hash: string
): Promise<TransactionResult> {
  const server = getSorobanServer();

  for (let i = 0; i < TX_MAX_RETRIES; i++) {
    try {
      const response = await server.getTransaction(hash);

      if (response.status === 'SUCCESS') {
        return {
          hash,
          status: 'SUCCESS',
          resultXdr: response.resultXdr?.toXDR('base64'),
          returnValue: response.returnValue
            ? scValToNative(response.returnValue)
            : undefined,
        };
      }

      if (response.status === 'FAILED') {
        return {
          hash,
          status: 'FAILED',
          resultXdr: response.resultXdr?.toXDR('base64'),
        };
      }

      // NOT_FOUND means still pending
    } catch {
      // Transaction not yet available
    }

    await sleep(TX_POLL_INTERVAL);
  }

  return { hash, status: 'NOT_FOUND' };
}

/**
 * Full transaction lifecycle: build → simulate → return prepared TX for signing.
 */
export async function prepareContractCall(
  sourcePublicKey: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[] = []
): Promise<{ prepared: Transaction; fee: string }> {
  const tx = await buildContractTransaction(
    sourcePublicKey,
    contractId,
    method,
    args
  );
  const { prepared, minResourceFee } = await simulateTransaction(tx);
  return { prepared, fee: minResourceFee };
}

// ============================================
// ScVal Conversion Helpers
// ============================================

export function addressToScVal(address: string): xdr.ScVal {
  return new Address(address).toScVal();
}

export function u32ToScVal(value: number): xdr.ScVal {
  return nativeToScVal(value, { type: 'u32' });
}

export function u64ToScVal(value: number | bigint): xdr.ScVal {
  return nativeToScVal(value, { type: 'u64' });
}

export function u128ToScVal(value: number | bigint): xdr.ScVal {
  return nativeToScVal(value, { type: 'u128' });
}

export function i128ToScVal(value: number | bigint): xdr.ScVal {
  return nativeToScVal(value, { type: 'i128' });
}

export function stringToScVal(value: string): xdr.ScVal {
  return nativeToScVal(value, { type: 'string' });
}

export function symbolToScVal(value: string): xdr.ScVal {
  return nativeToScVal(value, { type: 'symbol' });
}

export function bytesToScVal(value: Buffer): xdr.ScVal {
  return xdr.ScVal.scvBytes(value);
}

/**
 * Convenience alias: build + simulate, return prepared tx ready for signing.
 * Used by contract client modules.
 */
export async function buildContractCall(
  sourcePublicKey: string,
  contractId: string,
  method: string,
  args: xdr.ScVal[] = []
): Promise<Transaction> {
  const tx = await buildContractTransaction(sourcePublicKey, contractId, method, args);
  const { prepared } = await simulateTransaction(tx);
  return prepared;
}
