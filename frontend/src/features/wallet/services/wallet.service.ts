'use client';

// ============================================
// Wallet Service — StellarWalletsKit Abstraction
// ============================================

import { NETWORK_PASSPHRASE } from '@/lib/constants';

type WalletKitType = {
  openModal: (options: { onWalletSelected: (option: { id: string }) => Promise<void> }) => Promise<void>;
  setWallet: (id: string) => void;
  getAddress: () => Promise<{ address: string }>;
  signTx: (options: { xdr: string; publicKeys: string[]; network: string }) => Promise<{ result: string }>;
};

let _kit: WalletKitType | null = null;
let _initPromise: Promise<WalletKitType | null> | null = null;

/**
 * Dynamically import and initialize StellarWalletsKit.
 * Returns null if the package is not available.
 */
async function initKit(): Promise<WalletKitType | null> {
  if (typeof window === 'undefined') return null;

  try {
    const walletKit = await import('@creit-tech/stellar-wallets-kit');

    const {
      StellarWalletsKit,
      WalletNetwork,
      allowAllModules,
      FREIGHTER_ID,
    } = walletKit;

    const kit = new StellarWalletsKit({
      network: WalletNetwork.TESTNET,
      selectedWalletId: FREIGHTER_ID,
      modules: allowAllModules(),
    });

    return kit as unknown as WalletKitType;
  } catch (error) {
    console.warn(
      '[Lumina] StellarWalletsKit not available. Wallet features will use mock mode.',
      error
    );
    return null;
  }
}

/**
 * WalletService — static methods wrapping StellarWalletsKit.
 */
export class WalletService {
  /**
   * Initialize the wallet kit (lazy, singleton).
   */
  static async init(): Promise<WalletKitType | null> {
    if (_kit) return _kit;
    if (!_initPromise) {
      _initPromise = initKit().then((kit) => {
        _kit = kit;
        return kit;
      });
    }
    return _initPromise;
  }

  /**
   * Open the wallet selection modal and connect.
   * Returns the connected address.
   */
  static async connect(): Promise<{ address: string; walletType: string }> {
    const kit = await WalletService.init();

    if (!kit) {
      // Demo/mock mode — generate a fake testnet address
      console.warn('[Lumina] Using mock wallet connection.');
      const mockAddress = 'GDEMO' + 'X'.repeat(51);
      return { address: mockAddress, walletType: 'mock' };
    }

    return new Promise((resolve, reject) => {
      kit.openModal({
        onWalletSelected: async (option: { id: string }) => {
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            resolve({ address, walletType: option.id });
          } catch (error) {
            reject(
              new Error(
                `Failed to connect wallet: ${error instanceof Error ? error.message : 'Unknown error'}`
              )
            );
          }
        },
      });
    });
  }

  /**
   * Disconnect the wallet (clear local state).
   */
  static disconnect(): void {
    // StellarWalletsKit doesn't have a disconnect method.
    // State cleanup happens in the Zustand store.
    _kit = null;
    _initPromise = null;
  }

  /**
   * Sign a transaction XDR.
   */
  static async signTransaction(
    xdr: string,
    publicKey: string
  ): Promise<string> {
    const kit = await WalletService.init();

    if (!kit) {
      throw new Error(
        'Wallet not connected. Please install a Stellar wallet extension.'
      );
    }

    const { result } = await kit.signTx({
      xdr,
      publicKeys: [publicKey],
      network: NETWORK_PASSPHRASE,
    });

    return result;
  }

  /**
   * Get the connected address.
   */
  static async getAddress(): Promise<string | null> {
    const kit = await WalletService.init();
    if (!kit) return null;

    try {
      const { address } = await kit.getAddress();
      return address;
    } catch {
      return null;
    }
  }

  /**
   * Check if a wallet extension is available.
   */
  static async isAvailable(): Promise<boolean> {
    const kit = await WalletService.init();
    return kit !== null;
  }
}
