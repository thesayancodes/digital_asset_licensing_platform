// ============================================
// Lumina — Environment & App Constants
// ============================================

/** Stellar network identifier */
export const STELLAR_NETWORK =
  (process.env.NEXT_PUBLIC_STELLAR_NETWORK as 'testnet' | 'mainnet') || 'testnet';

/** Soroban RPC endpoint */
export const SOROBAN_RPC_URL =
  process.env.NEXT_PUBLIC_SOROBAN_RPC_URL || 'https://soroban-testnet.stellar.org';

/** Horizon API endpoint */
export const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL || 'https://horizon-testnet.stellar.org';

/** Stellar network passphrase */
export const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015';

/** Deployed contract IDs */
export const CONTRACT_IDS = {
  ASSET_REGISTRY: process.env.NEXT_PUBLIC_ASSET_REGISTRY_CONTRACT_ID || '',
  LICENSE_MANAGER: process.env.NEXT_PUBLIC_LICENSE_MANAGER_CONTRACT_ID || '',
  ROYALTY_DISTRIBUTOR: process.env.NEXT_PUBLIC_ROYALTY_DISTRIBUTOR_CONTRACT_ID || '',
  IDENTITY_VERIFIER: process.env.NEXT_PUBLIC_IDENTITY_VERIFIER_CONTRACT_ID || '',
} as const;

/** Individual contract ID exports for convenience */
export const ASSET_REGISTRY_CONTRACT_ID = CONTRACT_IDS.ASSET_REGISTRY;
export const LICENSE_MANAGER_CONTRACT_ID = CONTRACT_IDS.LICENSE_MANAGER;

/** Stellar Explorer base URL */
export const EXPLORER_URL =
  process.env.NEXT_PUBLIC_EXPLORER_URL || 'https://stellar.expert/explorer/testnet';

/** App metadata */
export const APP_NAME = 'Lumina';
export const APP_DESCRIPTION = 'AI-Powered Digital Asset Licensing on Stellar';
export const APP_VERSION = '1.0.0';

/** Pagination defaults */
export const DEFAULT_PAGE_SIZE = 12;
export const MAX_PAGE_SIZE = 50;

/** Transaction defaults */
export const DEFAULT_TX_TIMEOUT = 30; // seconds
export const TX_POLL_INTERVAL = 2000; // ms
export const TX_MAX_RETRIES = 15;

/** Event polling */
export const EVENT_POLL_INTERVAL_MS = Number(process.env.NEXT_PUBLIC_EVENT_POLL_INTERVAL_MS) || 5000;

/** Asset constraints */
export const MAX_ASSET_NAME_LENGTH = 64;
export const MAX_METADATA_URI_LENGTH = 256;
export const MAX_ROYALTY_BPS = 5000; // 50%
export const MIN_ROYALTY_BPS = 0;
