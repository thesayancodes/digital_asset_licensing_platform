'use client';

import { type ReactNode } from 'react';

/**
 * ThemeProvider — manages dark/light theme state.
 * Defaults to dark mode. The `dark` class is set on <html> in layout.tsx.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
