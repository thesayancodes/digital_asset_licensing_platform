'use client';

// ============================================
// Soroban RPC Client — Lazy Singleton
// ============================================

import { rpc } from '@stellar/stellar-sdk';
import { SOROBAN_RPC_URL } from '@/lib/constants';

let _server: rpc.Server | null = null;

/**
 * Get or create the Soroban RPC Server instance.
 * Uses lazy initialization to avoid SSR issues.
 */
export function getSorobanServer(): rpc.Server {
  if (!_server) {
    _server = new rpc.Server(SOROBAN_RPC_URL, {
      allowHttp: SOROBAN_RPC_URL.startsWith('http://'),
    });
  }
  return _server;
}

/**
 * Reset the server instance (useful for network switching).
 */
export function resetSorobanServer(): void {
  _server = null;
}

/**
 * Create a new server instance for a custom RPC URL.
 */
export function createSorobanServer(rpcUrl: string): rpc.Server {
  return new rpc.Server(rpcUrl, {
    allowHttp: rpcUrl.startsWith('http://'),
  });
}
