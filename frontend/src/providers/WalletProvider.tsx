'use client';

import { type ReactNode } from 'react';

/**
 * WalletProvider — wraps children with wallet context.
 * Actual wallet state lives in the Zustand store (features/wallet/store).
 * This provider exists as a mount point for wallet lifecycle effects.
 */
export function WalletProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
