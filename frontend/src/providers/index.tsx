'use client';

import { type ReactNode } from 'react';
import { QueryProvider } from './QueryProvider';
import { WalletProvider } from './WalletProvider';
import { ThemeProvider } from './ThemeProvider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <WalletProvider>{children}</WalletProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
