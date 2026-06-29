import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx — the standard cn() pattern.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Truncate a Stellar address for display: GABCD...WXYZ
 */
export function formatAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format a date to a human-readable string.
 */
export function formatDate(
  date: Date | number | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

/**
 * Format a date with time.
 */
export function formatDateTime(date: Date | number | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format an amount with locale-aware separators.
 * Amounts from Soroban are typically in stroops (7 decimal places).
 */
export function formatAmount(
  amount: number | bigint | string,
  decimals = 7,
  displayDecimals = 2
): string {
  const num =
    typeof amount === 'bigint'
      ? Number(amount) / Math.pow(10, decimals)
      : typeof amount === 'string'
        ? parseFloat(amount) / Math.pow(10, decimals)
        : amount / Math.pow(10, decimals);

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: displayDecimals,
    maximumFractionDigits: displayDecimals,
  }).format(num);
}

/**
 * Format XLM amount (7 decimal places).
 */
export function formatXLM(stroops: number | bigint | string): string {
  return `${formatAmount(stroops, 7, 2)} XLM`;
}

/**
 * Format royalty basis points to a percentage string.
 * e.g., 250 bps → "2.50%"
 */
export function formatRoyaltyBps(bps: number): string {
  return `${(bps / 100).toFixed(2)}%`;
}

/**
 * Generate a deterministic color from a string (for avatars, etc.).
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Sleep for ms milliseconds.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Shorten a content hash for display.
 */
export function shortenHash(hash: string, chars = 8): string {
  if (!hash) return '';
  if (hash.length <= chars * 2 + 3) return hash;
  return `${hash.slice(0, chars)}...${hash.slice(-chars)}`;
}
