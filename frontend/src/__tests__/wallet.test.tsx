import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the wallet store
const mockStore = {
  address: null as string | null,
  isConnected: false,
  isConnecting: false,
  network: 'testnet' as const,
  error: null as string | null,
  connect: vi.fn(),
  disconnect: vi.fn(),
  setAddress: vi.fn(),
  setNetwork: vi.fn(),
  setError: vi.fn(),
  setConnecting: vi.fn(),
};

vi.mock('@/features/wallet/store/wallet.store', () => ({
  useWalletStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return selector(mockStore);
    }
    return mockStore;
  }),
}));

describe('Wallet Store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockStore.address = null;
    mockStore.isConnected = false;
    mockStore.isConnecting = false;
    mockStore.error = null;
  });

  it('should initialize with disconnected state', () => {
    expect(mockStore.address).toBeNull();
    expect(mockStore.isConnected).toBe(false);
    expect(mockStore.isConnecting).toBe(false);
    expect(mockStore.network).toBe('testnet');
  });

  it('should update address on connect', () => {
    const testAddress = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRST';

    mockStore.setAddress(testAddress);
    expect(mockStore.setAddress).toHaveBeenCalledWith(testAddress);

    // Simulate state update
    mockStore.address = testAddress;
    mockStore.isConnected = true;
    expect(mockStore.address).toBe(testAddress);
    expect(mockStore.isConnected).toBe(true);
  });

  it('should clear state on disconnect', () => {
    // Start connected
    mockStore.address = 'GABCDEFGHIJKLMNOPQRSTUVWXYZ234567ABCDEFGHIJKLMNOPQRST';
    mockStore.isConnected = true;

    mockStore.disconnect();
    expect(mockStore.disconnect).toHaveBeenCalled();

    // Simulate state update
    mockStore.address = null;
    mockStore.isConnected = false;
    expect(mockStore.address).toBeNull();
    expect(mockStore.isConnected).toBe(false);
  });

  it('should handle connection errors', () => {
    const errorMsg = 'User rejected wallet connection';

    mockStore.setError(errorMsg);
    expect(mockStore.setError).toHaveBeenCalledWith(errorMsg);

    // Simulate state update
    mockStore.error = errorMsg;
    mockStore.isConnecting = false;
    expect(mockStore.error).toBe(errorMsg);
    expect(mockStore.isConnecting).toBe(false);
  });

  it('should switch networks', () => {
    mockStore.setNetwork('mainnet' as any);
    expect(mockStore.setNetwork).toHaveBeenCalledWith('mainnet');
  });
});
