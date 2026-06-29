// ============================================
// Stellar Network Configuration
// ============================================

export interface NetworkConfig {
  networkPassphrase: string;
  sorobanRpcUrl: string;
  horizonUrl: string;
  explorerUrl: string;
  friendbotUrl?: string;
}

export const NETWORKS: Record<'testnet' | 'mainnet', NetworkConfig> = {
  testnet: {
    networkPassphrase: 'Test SDF Network ; September 2015',
    sorobanRpcUrl: 'https://soroban-testnet.stellar.org',
    horizonUrl: 'https://horizon-testnet.stellar.org',
    explorerUrl: 'https://stellar.expert/explorer/testnet',
    friendbotUrl: 'https://friendbot.stellar.org',
  },
  mainnet: {
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    sorobanRpcUrl: 'https://soroban.stellar.org',
    horizonUrl: 'https://horizon.stellar.org',
    explorerUrl: 'https://stellar.expert/explorer/public',
  },
};

/**
 * Get the network config for the current environment.
 */
export function getNetworkConfig(
  network: 'testnet' | 'mainnet' = 'testnet'
): NetworkConfig {
  return NETWORKS[network];
}

/**
 * Get the explorer URL for a transaction hash.
 */
export function getTransactionExplorerUrl(
  hash: string,
  network: 'testnet' | 'mainnet' = 'testnet'
): string {
  const config = getNetworkConfig(network);
  return `${config.explorerUrl}/tx/${hash}`;
}

/**
 * Get the explorer URL for an account address.
 */
export function getAccountExplorerUrl(
  address: string,
  network: 'testnet' | 'mainnet' = 'testnet'
): string {
  const config = getNetworkConfig(network);
  return `${config.explorerUrl}/account/${address}`;
}

/**
 * Get the explorer URL for a contract.
 */
export function getContractExplorerUrl(
  contractId: string,
  network: 'testnet' | 'mainnet' = 'testnet'
): string {
  const config = getNetworkConfig(network);
  return `${config.explorerUrl}/contract/${contractId}`;
}
